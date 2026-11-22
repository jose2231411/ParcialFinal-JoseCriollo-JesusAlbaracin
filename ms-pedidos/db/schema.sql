-- Base de datos de ms-pedidos.
-- Antes de ejecutar este script (como root):
--   CREATE DATABASE pedidos_db;
--   CREATE USER 'pedidos_user'@'localhost' IDENTIFIED BY 'una-clave-segura';
--   GRANT ALL PRIVILEGES ON pedidos_db.* TO 'pedidos_user'@'localhost';
USE pedidos_db;
SET NAMES utf8mb4;

CREATE TABLE pedidos (
  id       INT AUTO_INCREMENT PRIMARY KEY,
  numero   VARCHAR(50)  NOT NULL UNIQUE,
  cliente  VARCHAR(100) NOT NULL,
  cantidad INT          NOT NULL CHECK (cantidad > 0),
  fecha    DATE         NOT NULL,
  estado   VARCHAR(20)  NOT NULL CHECK (estado IN ('pendiente', 'enviado', 'entregado'))
);

INSERT INTO pedidos (numero, cliente, cantidad, fecha, estado) VALUES
('PED-001', 'Cliente A', 10, '2026-11-02', 'pendiente'),
('PED-002', 'Cliente B',  5, '2026-11-05', 'enviado'),
('PED-003', 'Cliente C', 20, '2026-11-10', 'entregado'),
('PED-004', 'Cliente A',  3, '2026-11-15', 'pendiente');
