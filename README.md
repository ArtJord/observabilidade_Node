# Parte 1 — Aplicação Node.js + PostgreSQL + /metrics

Aplicação simples em Node.js (Express) conectada ao PostgreSQL, expondo `/metrics` para Prometheus.

## Como rodar (Docker recomendado)

1. Copie `.env.example` para `.env` e ajuste se necessário.
2. Suba os serviços:
   ```bash
   docker compose up -d --build
   ```
3. Execute migração e seed:
   ```bash
   docker compose exec app npm run migrate
   docker compose exec app npm run seed
   ```
4. Testes rápidos:
   - Saúde da aplicação/DB: <http://localhost:3000/health>
   - Dados de negócio: <http://localhost:3000/vendas>
   - Agregados por categoria: <http://localhost:3000/vendas/por-categoria>
   - Métricas Prometheus: <http://localhost:3000/metrics>
5. (Opcional) Acesse Prometheus: <http://localhost:9090/> (já configurado para coletar de `app:3000`).

## Estrutura
- `src/server.js` — servidor Express com métricas e rotas
- `scripts/migrate.js` — cria tabela
- `scripts/seed.js` — insere 20+ registros
- `sql/schema.sql` e `sql/seed.sql`
- `prometheus/prometheus.yml` — scrape do app (opcional Parte 1)

Na Parte 2, adicionaremos Grafana e painéis.
