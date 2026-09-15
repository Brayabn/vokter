-- Esquema de referencia de VOKTER.
-- En desarrollo, Sequelize crea estas tablas automáticamente (ver backend/src/server.js -> sequelize.sync()).
-- Este archivo documenta el modelo de datos para producción (MySQL/PostgreSQL).

CREATE TABLE users (
  id INT PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL UNIQUE,
  password_hash VARCHAR(255) NOT NULL,
  role ENUM('user', 'expert') DEFAULT 'user',
  bio TEXT,
  skills VARCHAR(500),          -- CSV: "marketing,estrategia,redes sociales"
  avatar_url VARCHAR(500),
  rating FLOAT DEFAULT 0,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE categories (
  id INT PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(100) NOT NULL UNIQUE,
  slug VARCHAR(100) NOT NULL UNIQUE,
  icon VARCHAR(10) DEFAULT '💡'
);

CREATE TABLE contents (
  id INT PRIMARY KEY AUTO_INCREMENT,
  title VARCHAR(255) NOT NULL,
  description TEXT NOT NULL,
  tags VARCHAR(500),             -- CSV, usado por el motor de matching VOKTER AI
  rating FLOAT DEFAULT 0,
  image_url VARCHAR(500),
  author_id INT NOT NULL REFERENCES users(id),
  category_id INT NOT NULL REFERENCES categories(id),
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE favorites (
  id INT PRIMARY KEY AUTO_INCREMENT,
  user_id INT NOT NULL REFERENCES users(id),
  content_id INT NOT NULL REFERENCES contents(id),
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  UNIQUE (user_id, content_id)
);
