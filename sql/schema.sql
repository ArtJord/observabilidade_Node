-- Criação de tabela de exemplo para dados de negócio
CREATE TABLE IF NOT EXISTS vendas (
  id SERIAL PRIMARY KEY,
  categoria VARCHAR(100) NOT NULL,
  valor NUMERIC(12,2) NOT NULL,
  descricao TEXT,
  created_at TIMESTAMP NOT NULL DEFAULT NOW()
);
