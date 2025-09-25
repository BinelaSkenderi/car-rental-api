CREATE DATABASE IF NOT EXISTS biluthyrning
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_swedish_ci;

USE biluthyrning;


SET FOREIGN_KEY_CHECKS=0;
DROP TABLE IF EXISTS bokningar;
DROP TABLE IF EXISTS kunder;
DROP TABLE IF EXISTS bilar;
SET FOREIGN_KEY_CHECKS=1;

-- === Tabeller ===
CREATE TABLE bilar (
  id INT AUTO_INCREMENT PRIMARY KEY,
  regnr VARCHAR(10) NOT NULL UNIQUE,
  `märke` VARCHAR(50) NULL,
  modell VARCHAR(50) NULL,
  pris_per_dag DECIMAL(10,2) NULL
) ENGINE=InnoDB;

CREATE TABLE kunder (
  id INT AUTO_INCREMENT PRIMARY KEY,
  fnamn VARCHAR(50) NOT NULL,
  enamn VARCHAR(50) NOT NULL,
  personnummer VARCHAR(12) UNIQUE,
  telefon VARCHAR(20)
) ENGINE=InnoDB;

CREATE TABLE bokningar (
  id INT AUTO_INCREMENT PRIMARY KEY,
  bil_id INT NOT NULL,
  kund_id INT NOT NULL,
  start_datum DATE NOT NULL,
  slut_datum  DATE NOT NULL,
  total_pris  DECIMAL(10,2) NOT NULL,
  CONSTRAINT fk_bokningar_bil  FOREIGN KEY (bil_id)  REFERENCES bilar(id),
  CONSTRAINT fk_bokningar_kund FOREIGN KEY (kund_id) REFERENCES kunder(id)
) ENGINE=InnoDB;

-- === kunder ===
INSERT INTO kunder (fnamn, enamn, personnummer, telefon) VALUES
('Erik',  'Johansson', '851212-0123', '0701234567'),
('Maria', 'Lindgren',  NULL,          '0707654321'),
('Oskar', 'Berg',      '860103-1234', '0890811-2345'),
('Julia', 'Hennsen',   '900304-2345', '0724567890'),
('Marcus','König',     '920103-0001', '0727865943'),
('Sofia', 'Anderss',   '960207-2001', '0700987654'),
('David', 'Svensson',  '020425-3333', '0722234521'),
('Stefan','Ekengren',  '041030-4545', '0724545675');

-- === bilar ===
INSERT INTO bilar (regnr, `märke`, modell, pris_per_dag) VALUES
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

-- === bokningar ===
INSERT INTO bokningar (bil_id, kund_id, start_datum, slut_datum, total_pris) VALUES
(2, 1, '2025-09-05', '2025-09-07', 1598.00),
(3, 2, '2025-09-10', '2025-09-13', 2997.00),
(5, 3, '2025-09-15', '2025-09-19', 2996.00);

-- Snabb koll
SELECT COUNT(*) AS antal_bilar     FROM bilar;
SELECT COUNT(*) AS antal_kunder    FROM kunder;
SELECT COUNT(*) AS antal_bokningar FROM bokningar;
