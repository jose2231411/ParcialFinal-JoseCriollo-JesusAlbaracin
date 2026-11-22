USE usuarios_db;
SET NAMES utf8mb4;           

CREATE TABLE usuarios (
  id             INT AUTO_INCREMENT PRIMARY KEY,
  nombre         VARCHAR(100) NOT NULL,
  email          VARCHAR(120) NOT NULL UNIQUE,
  password_hash  VARCHAR(100) NOT NULL,    
  rol            VARCHAR(30)  NOT NULL,
  activo         BOOLEAN      NOT NULL DEFAULT TRUE
);

INSERT INTO usuarios (nombre, email, password_hash, rol, activo) VALUES
  ('Administrador General', 'admin@empresa.com',
   '$2b$10$O7aBlpBQjnWE69ssLR1Nr.pNZpZiIx3r4kGZGsRHeEkM6SVhg.mUS', 'administrador', TRUE);