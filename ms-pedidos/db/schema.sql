USE pedidos_db;
SET NAMES utf8mb4;           

CREATE TABLE pedidos (
  id       INT AUTO_INCREMENT PRIMARY KEY,
  numero   VARCHAR(50) NOT NULL UNIQUE,
  cliente  VARCHAR(100) NOT NULL,
  cantidad INT NOT NULL,
  fecha    DATE NOT NULL,
  estado   VARCHAR(20) NOT NULL
);

INSERT INTO pedidos (numero, cliente, cantidad, fecha, estado) VALUES
('PED-001', 'Cliente A', 10, '2024-01-15', 'pendiente'),
('PED-002', 'Cliente B', 5, '2024-01-16', 'en_proceso'),
('PED-003', 'Cliente C', 20, '2024-01-17', 'completado');