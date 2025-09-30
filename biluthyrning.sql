-- Session-inställningar (rimliga defaults för stramare validering)
SET NAMES utf8mb4 COLLATE utf8mb4_swedish_ci;
SET time_zone = '+00:00';
SET sql_mode = 'STRICT_TRANS_TABLES,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION';

-- 1) Databas
CREATE DATABASE IF NOT EXISTS biluthyrning
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_swedish_ci;

USE biluthyrning;

-- 2) Rensa i korrekt ordning utan FK-problem
SET FOREIGN_KEY_CHECKS = 0;
DROP TABLE IF EXISTS bokningar;
DROP TABLE IF EXISTS kunder;
DROP TABLE IF EXISTS bilar;
SET FOREIGN_KEY_CHECKS = 1;

-- Tabeller (InnoDB för FK & transaktioner)

-- Bilar
CREATE TABLE bilar (
  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  regnr VARCHAR(10) NOT NULL UNIQUE,
  `marke` VARCHAR(50) NOT NULL,
  modell VARCHAR(50) NOT NULL,
  pris_per_dag DECIMAL(10,2) NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CHECK (pris_per_dag > 0)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_swedish_ci;

-- Kunder
CREATE TABLE kunder (
  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  fnamn VARCHAR(50) NOT NULL,
  enamn VARCHAR(50) NOT NULL,
  personnummer VARCHAR(12) NOT NULL UNIQUE,
  telefon VARCHAR(20) NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_swedish_ci;

-- Bokningar
CREATE TABLE bokningar (
  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  bil_id INT UNSIGNED NOT NULL,
  kund_id INT UNSIGNED NOT NULL,
  start_datum DATE NOT NULL,
  slut_datum  DATE NOT NULL,
  total_pris  DECIMAL(10,2) NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT fk_bokningar_bil
    FOREIGN KEY (bil_id) REFERENCES bilar(id)
    ON DELETE RESTRICT
    ON UPDATE CASCADE,
  CONSTRAINT fk_bokningar_kund
    FOREIGN KEY (kund_id) REFERENCES kunder(id)
    ON DELETE RESTRICT
    ON UPDATE CASCADE,
  CHECK (start_datum <= slut_datum),
  CHECK (total_pris >= 0)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_swedish_ci;

-- 4) Index för vanligaste frågor
CREATE INDEX idx_bokningar_bil_datum ON bokningar (bil_id, start_datum, slut_datum);
CREATE INDEX idx_bokningar_kund ON bokningar (kund_id);
-- regnr/personnummer är redan UNIQUE

-- 5) Seed-data (anpassat till NOT NULL på personnummer och pris)

-- Kunder
INSERT INTO kunder (fnamn, enamn, personnummer, telefon) VALUES
('Erik',  'Johansson', '851212-0123', '0701234567'),
('Maria', 'Lindgren',  '900101-0000', '0707654321'),  -- var NULL tidigare
('Oskar', 'Berg',      '860103-1234', '0890811-2345'),
('Julia', 'Hennsen',   '900304-2345', '0724567890'),
('Marcus','König',     '920103-0001', '0727865943'),
('Sofia', 'Anderss',   '960207-2001', '0700987654'),
('David', 'Svensson',  '020425-3333', '0722234521'),
('Stefan','Ekengren',  '041030-4545', '0724545675');

-- Bilar
INSERT INTO bilar (regnr, `marke`, modell, pris_per_dag) VALUES
('ABC123', 'Volvo',      'XC60',     599.00),
('XYZ789', 'BMW',        '320i',     799.00),
('JKL456', 'Tesla',      'Model 3',  999.00),
('MNO321', 'Volkswagen', 'Golf',     499.00),
('PQR654', 'Audi',       'A4',       749.00),
('STU987', 'Toyota',     'Corolla',  459.00),
('DEF741', 'Mercedes',   'C200',     899.00),
('GHI852', 'Kia',        'Sportage', 549.00),
('CBA321', 'Volvo',      'XC90',     650.00),
('RQP456', 'Audi',       'Q8',      1200.00);

-- Bokningar (datum ligger i framtiden relativt exempeldatan)
INSERT INTO bokningar (bil_id, kund_id, start_datum, slut_datum, total_pris) VALUES
(2, 1, '2025-09-05', '2025-09-07', 1598.00),
(3, 2, '2025-09-10', '2025-09-13', 2997.00),
(5, 3, '2025-09-15', '2025-09-19', 2996.00);

-- 6) Snabb sanity check
SELECT COUNT(*) AS antal_bilar     FROM bilar;
SELECT COUNT(*) AS antal_kunder    FROM kunder;
SELECT COUNT(*) AS antal_bokningar FROM bokningar;
