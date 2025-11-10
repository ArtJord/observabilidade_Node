# 🧠 Projeto de Observabilidade — Node.js + PostgreSQL + Prometheus + Grafana

Aplicação Node.js instrumentada para observabilidade completa, com integração entre **dados de negócio (PostgreSQL)** e **métricas de desempenho (Prometheus)**, visualizadas em **painéis no Grafana**.

---

## 🚀 Tecnologias Utilizadas

- **Node.js / Express** → servidor da aplicação  
- **PostgreSQL** → banco de dados relacional  
- **Prometheus** → coleta e armazenamento de métricas  
- **Grafana** → visualização de métricas e dados SQL  
- **Docker / Docker Compose** → orquestração dos serviços  

---

## ⚙️ Estrutura do Projeto

```
parte1-node-observabilidade/
├── src/
│   └── server.js
├── scripts/
│   ├── migrate.js
│   └── seed.js
├── sql/
│   ├── schema.sql
│   └── seed.sql
├── prometheus/
│   └── prometheus.yml
├── grafana/
│   ├── dashboards/
│   │   └── dashboard-app-observa.json
│   └── provisioning/
│       ├── datasources/
│       │   └── datasources.yml
│       └── dashboards/
│           └── dashboards.yml
├── .env.example
├── Dockerfile
├── docker-compose.yml
├── README.md
└── Relatorio_Observabilidade.pdf
```

---

## 🧩 Configuração e Execução

### 1️⃣ Configurar o ambiente

Copie o arquivo `.env.example` para `.env`:
```bash
cp .env.example .env
```

---

### 2️⃣ Subir os containers
```bash
docker compose up -d --build
```

Isso iniciará:
- `app-observa` → aplicação Node.js (porta 3000)  
- `pg-observa` → banco PostgreSQL (porta 5432)  
- `prom-observa` → Prometheus (porta 9090)  
- `gf-observa` → Grafana (porta 3001)  

---

### 3️⃣ Criar tabela e popular o banco
```bash
docker compose exec app npm run migrate
docker compose exec app npm run seed
```

---

### 4️⃣ Testar endpoints
- **Saúde da aplicação:** [http://localhost:3000/health](http://localhost:3000/health)  
- **Listagem de vendas:** [http://localhost:3000/vendas](http://localhost:3000/vendas)  
- **Agregados por categoria:** [http://localhost:3000/vendas/por-categoria](http://localhost:3000/vendas/por-categoria)  
- **Métricas Prometheus:** [http://localhost:3000/metrics](http://localhost:3000/metrics)

---

### 5️⃣ Acessar interfaces
- **Prometheus:** [http://localhost:9090](http://localhost:9090)  
  - *Status → Targets* → deve aparecer `app:3000` como **UP**  
  - Exemplos de consultas PromQL:
    ```promql
    rate(http_requests_total[1m])
    histogram_quantile(0.95, sum(rate(http_request_duration_seconds_bucket[5m])) by (le))
    ```

- **Grafana:** [http://localhost:3001](http://localhost:3001)  
  - Login: `admin` / Senha: `admin`  
  - Painel provisionado: **Observabilidade - App → App Observa — Dados (SQL) & Observabilidade (Prometheus)**

---

## 📊 Consultas SQL Utilizadas

```sql
-- Vendas por categoria
SELECT categoria, SUM(valor)::double precision AS total_vendas
FROM vendas
GROUP BY categoria
ORDER BY total_vendas DESC;

-- Total de registros
SELECT COUNT(*)::bigint FROM vendas;

-- Valor médio das vendas
SELECT ROUND(AVG(valor)::numeric, 2)::double precision AS media_valor FROM vendas;

-- Últimos registros
SELECT id, categoria, valor::double precision AS valor, descricao, created_at
FROM vendas
ORDER BY created_at DESC
LIMIT 20;
```

---

## 📈 Métricas Prometheus Monitoradas

| Métrica | Descrição |
|----------|------------|
| `http_requests_total` | Contador total de requisições HTTP |
| `http_request_duration_seconds` | Latência das requisições (histograma) |
| `process_cpu_seconds_total` | Tempo total de CPU consumido |
| `nodejs_active_requests_total` | Requisições ativas no event loop |
| `nodejs_eventloop_lag_mean_seconds` | Atraso médio do event loop |
| `up` | Status do endpoint monitorado |

---

## 🧠 Dashboard do Grafana

O painel está dividido em duas seções principais:

### 🔹 Dados de Negócio (SQL)
- **Gráfico de barras** — vendas por categoria  
- **Indicadores numéricos** — total de registros e valor médio  
- **Tabela** — últimos registros inseridos  

### 🔹 Métricas de Observabilidade (Prometheus)
- **Latência p95 (histogram_quantile)**  
- **Throughput (req/s)**  
- **Taxa de erros (4xx / 5xx)**  
- **Status de coleta Prometheus (up)**  

---

## 🧾 Relatório Explicativo

O relatório técnico completo (PDF) está disponível em:  
[`Relatorio_Observabilidade.pdf`](./Relatorio_Observabilidade.pdf)

---

## 📦 Entregáveis
- Código-fonte da aplicação e scripts SQL  
- Arquivo `docker-compose.yml` funcional  
- Painel Grafana exportado (`.json`)  
- Capturas de tela do dashboard (dados + métricas)  
- Relatório explicativo (PDF)

---

## ✨ Créditos
Projeto desenvolvido por **Arthur**  
Disciplina: *Computação Gráfica e Modelagem – P2 (Observabilidade e Dashboards)*  
Ferramentas: Node.js, PostgreSQL, Prometheus, Grafana, Docker

---
