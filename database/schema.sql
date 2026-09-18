-- Esquema de VOKTER en PostgreSQL (producción: Neon).
--
-- NO hace falta ejecutarlo: el backend crea las tablas al arrancar con
-- sequelize.sync() (crea las que falten, no altera ni borra las existentes).
-- Este archivo documenta el esquema EXACTO que genera Sequelize; se obtuvo con
-- `pg_dump --schema-only` sobre una base inicializada por el backend y se
-- condensó (SERIAL en lugar de secuencias explícitas) para leerlo fácilmente.

CREATE TYPE enum_users_role AS ENUM ('user', 'expert');

CREATE TABLE users (
  id             SERIAL PRIMARY KEY,
  name           VARCHAR(255) NOT NULL,
  email          VARCHAR(255) NOT NULL UNIQUE,
  "passwordHash" VARCHAR(255) NOT NULL,            -- bcrypt, 10 rondas
  role           enum_users_role DEFAULT 'user',
  bio            TEXT DEFAULT '',
  skills         VARCHAR(255) DEFAULT '',          -- CSV, usado por VOKTER AI
  "avatarUrl"    VARCHAR(255) DEFAULT '',
  rating         DOUBLE PRECISION DEFAULT 0,
  "createdAt"    TIMESTAMPTZ NOT NULL,
  "updatedAt"    TIMESTAMPTZ NOT NULL
);

CREATE TABLE categories (
  id   SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL UNIQUE,
  slug VARCHAR(255) NOT NULL UNIQUE,               -- identificador usado en URLs y filtros
  icon VARCHAR(255) DEFAULT '💡'
);

CREATE TABLE contents (
  id           SERIAL PRIMARY KEY,
  title        VARCHAR(255) NOT NULL,
  description  TEXT NOT NULL,
  tags         VARCHAR(255) DEFAULT '',            -- CSV, usado por la búsqueda
  rating       DOUBLE PRECISION DEFAULT 0,
  "imageUrl"   VARCHAR(255) DEFAULT '',
  "createdAt"  TIMESTAMPTZ NOT NULL,
  "updatedAt"  TIMESTAMPTZ NOT NULL,
  "authorId"   INTEGER REFERENCES users(id) ON UPDATE CASCADE ON DELETE SET NULL,
  "categoryId" INTEGER REFERENCES categories(id) ON UPDATE CASCADE ON DELETE SET NULL
);

-- Relación N:M usuario ↔ contenido. La restricción única impide favoritos duplicados
-- a nivel de base de datos (además de la lógica idempotente del API).
CREATE TABLE favorites (
  id          SERIAL PRIMARY KEY,
  "createdAt" TIMESTAMPTZ NOT NULL,
  "updatedAt" TIMESTAMPTZ NOT NULL,
  "userId"    INTEGER REFERENCES users(id) ON UPDATE CASCADE ON DELETE CASCADE,
  "contentId" INTEGER REFERENCES contents(id) ON UPDATE CASCADE ON DELETE CASCADE,
  UNIQUE ("userId", "contentId")
);
