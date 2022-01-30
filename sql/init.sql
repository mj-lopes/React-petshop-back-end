CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

CREATE TABLE IF NOT EXISTS usuarios(
  uuid uuid DEFAULT uuid_generate_v4(),
  nome VARCHAR NOT NULL,
  cpf VARCHAR NOT NULL,
  email VARCHAR NOT NULL,  
  senha VARCHAR NOT NULL,  
  flagativo char DEFAULT '1' NOT NULL,
  PRIMARY KEY (uuid)
)

CREATE TABLE IF NOT EXISTS produtos(
  uuid uuid DEFAULT uuid_generate_v4(),
  nome VARCHAR NOT NULL,
  categoria VARCHAR NOT NULL,
  tipoanimal VARCHAR NOT NULL,  
  marca VARCHAR NOT NULL,
  preco FLOAT NOT NULL,
  flagativo char DEFAULT '1' NOT NULL,
  imgurl VARCHAR DEFAULT '-' NOT NULL,  
  descricao VARCHAR NOT NULL,
  PRIMARY KEY (uuid),
)

CREATE TABLE IF NOT EXISTS compras(
  uuid uuid DEFAULT uuid_generate_v4(),
  fkusuariocomprador uuid NOT NULL,
  status VARCHAR NOT NULL,
  data DATE DEFAULT now(),
  PRIMARY KEY (uuid),
  FOREIGN KEY(fkusuariocomprador) REFERENCES usuarios(uuid)
)

CREATE TABLE IF NOT EXISTS produtoscompra(
  fkcompra uuid NOT NULL,
  fkproduto uuid NOT NULL,
  quantidade INTEGER NOT NULL,
  preco FLOAT NOT NULL,
  FOREIGN KEY(fkcompra) REFERENCES compras(uuid),
  FOREIGN KEY(fkproduto) REFERENCES produtos(uuid)
)

INSERT INTO usuarios (nome, cpf, email, senha) VALUES ('admin', '-', 'test@test.com', crypt('SENHA','SECRET'))