const express = require('express');
const morgan = require('morgan');
const { Pool } = require('pg');
const client = require('prom-client');
require('dotenv').config();

const app = express();


const collectDefaultMetrics = client.collectDefaultMetrics;
collectDefaultMetrics(); 


const httpRequestDuration = new client.Histogram({
  name: 'http_request_duration_seconds',
  help: 'Duração das requisições HTTP em segundos',
  labelNames: ['method', 'route', 'status_code'],
  buckets: [0.01, 0.05, 0.1, 0.3, 0.5, 1, 2, 5] 
});

const httpRequestsTotal = new client.Counter({
  name: 'http_requests_total',
  help: 'Contagem total de requisições HTTP',
  labelNames: ['method', 'route', 'status_code']
});


app.use((req, res, next) => {
  const start = process.hrtime.bigint();
  res.on('finish', () => {
    const diff = Number(process.hrtime.bigint() - start) / 1e9; 
    httpRequestDuration.labels(req.method, req.route ? req.route.path : req.path, res.statusCode).observe(diff);
    httpRequestsTotal.labels(req.method, req.route ? req.route.path : req.path, res.statusCode).inc();
  });
  next();
});

app.use(express.json());
app.use(morgan('dev'));


const pool = new Pool({
  host: process.env.DB_HOST || 'localhost',
  port: process.env.DB_PORT ? parseInt(process.env.DB_PORT) : 5432,
  user: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASSWORD || 'postgres',
  database: process.env.DB_NAME || 'observa_db'
});

app.get('/health', async (req, res) => {
  try {
    await pool.query('SELECT 1');
    res.json({ status: 'ok', db: 'connected' });
  } catch (err) {
    res.status(500).json({ status: 'error', error: err.message });
  }
});

app.get('/vendas', async (req, res) => {
  try {
    const { rows } = await pool.query('SELECT * FROM vendas ORDER BY created_at DESC LIMIT 50');
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


app.get('/vendas/por-categoria', async (req, res) => {
  try {
    const { rows } = await pool.query(`
      SELECT categoria, SUM(valor) AS total_vendas, COUNT(*) AS qtd
      FROM vendas
      GROUP BY categoria
      ORDER BY total_vendas DESC
    `);
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


app.get(process.env.METRICS_ENDPOINT || '/metrics', async (req, res) => {
  try {
    res.set('Content-Type', client.register.contentType);
    const metrics = await client.register.metrics();
    res.send(metrics);
  } catch (err) {
    res.status(500).end(err.message);
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
