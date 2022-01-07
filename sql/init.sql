CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

CREATE TABLE IF NOT EXISTS usuarios(
  uuid uuid DEFAULT uuid_generate_v4(),
  nome VARCHAR NOT NULL,
  cpf VARCHAR NOT NULL,
  email VARCHAR NOT NULL,  
  senha VARCHAR NOT NULL,  
  PRIMARY KEY (uuid)
)

CREATE TABLE IF NOT EXISTS produtos(
  uuid uuid DEFAULT uuid_generate_v4(),
  nome VARCHAR NOT NULL,
  categoria VARCHAR NOT NULL,
  tipoanimal VARCHAR NOT NULL,  
  marca VARCHAR NOT NULL,
  preco FLOAT NOT NULL,  
  PRIMARY KEY (uuid),
)

CREATE TABLE IF NOT EXISTS compras(
  uuid uuid DEFAULT uuid_generate_v4(),
  fkusuariocomprador VARCHAR FOREIGN KEY usuarios(uuid) NOT NULL,
  status VARCHAR NOT NULL,
  data DATE DEFAULT now(),
  valor FLOAT NOT NULL,
  PRIMARY KEY (uuid),
  FOREIGN KEY(fkusuariocomprador) REFERENCES usuarios(uuid)
)

CREATE TABLE IF NOT EXISTS produtoscompra(
  fkcompra VARCHAR NOT NULL,
  fkproduto VARCHAR NOT NULL,
  FOREIGN KEY(fkcompra) REFERENCES compras(uuid),
  FOREIGN KEY(fkproduto) REFERENCES produtos(uuid)
)

INSERT INTO usuarios (nome, cpf, email, senha) VALUES ('admin', '-', '-', 'ADMIN', crypt('69832062288','quero_trabalho_poh'))