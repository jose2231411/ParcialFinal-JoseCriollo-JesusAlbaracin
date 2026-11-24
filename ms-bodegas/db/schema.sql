-- db/schema.sql — base de datos de ms-bodegas
SET NAMES utf8mb4;

CREATE TABLE bodegas (
  id                   INT AUTO_INCREMENT PRIMARY KEY,
  nombre_bodega        VARCHAR(80) NOT NULL,
  ciudad               VARCHAR(60) NOT NULL,
  activa               BOOLEAN NOT NULL
);

INSERT INTO bodegas (nombre_bodega, ciudad, activa) VALUES
  ('Bodega Acopi', 'Yumbo', TRUE),
  ('Bodega Sur', 'Cali', TRUE),
  ('Bodega Palmira', 'Palmira', FALSE),
  ('Bodega Puerto', 'Buenaventura', TRUE);
