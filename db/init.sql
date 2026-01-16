-- Base de données: gestion_stocks
-- Compatible MySQL 8+

CREATE DATABASE IF NOT EXISTS gestion_stocks;
USE gestion_stocks;



DROP TABLE IF EXISTS app_user;
CREATE TABLE app_user (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nom VARCHAR(120) NOT NULL,
  email VARCHAR(190) NOT NULL UNIQUE,
  password_hash VARCHAR(255) NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ---------- Tables de base ----------

DROP TABLE IF EXISTS category;
CREATE TABLE category (
  id INT NOT NULL AUTO_INCREMENT,
  nom VARCHAR(255) NOT NULL,
  PRIMARY KEY (id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

DROP TABLE IF EXISTS client;
CREATE TABLE client (
  id INT NOT NULL AUTO_INCREMENT,
  nom VARCHAR(255) NOT NULL,
  prenom VARCHAR(255) NOT NULL,
  telephone VARCHAR(50) DEFAULT NULL,
  email VARCHAR(255) DEFAULT NULL,
  PRIMARY KEY (id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

DROP TABLE IF EXISTS fournisseur;
CREATE TABLE fournisseur (
  id INT NOT NULL AUTO_INCREMENT,
  nom VARCHAR(255) NOT NULL,
  contact VARCHAR(255) DEFAULT NULL,
  telephone VARCHAR(50) DEFAULT NULL,
  email VARCHAR(255) DEFAULT NULL,
  PRIMARY KEY (id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

DROP TABLE IF EXISTS produit;
CREATE TABLE produit (
  id INT NOT NULL AUTO_INCREMENT,
  nom VARCHAR(255) NOT NULL,
  category_id INT DEFAULT NULL,
  prix DECIMAL(10,2) NOT NULL,
  quantite INT NOT NULL DEFAULT 0,
  PRIMARY KEY (id),
  KEY idx_produit_category (category_id),
  CONSTRAINT fk_produit_category FOREIGN KEY (category_id) REFERENCES category(id)
    ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ---------- Commandes ----------

DROP TABLE IF EXISTS commande;
CREATE TABLE commande (
  id INT NOT NULL AUTO_INCREMENT,
  client_id INT NOT NULL,
  date DATETIME NOT NULL,
  total DECIMAL(10,2) NOT NULL,
  PRIMARY KEY (id),
  KEY idx_commande_client (client_id),
  CONSTRAINT fk_commande_client FOREIGN KEY (client_id) REFERENCES client(id)
    ON DELETE RESTRICT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

DROP TABLE IF EXISTS commande_ligne;
CREATE TABLE commande_ligne (
  id INT NOT NULL AUTO_INCREMENT,
  commande_id INT NOT NULL,
  product_id INT NOT NULL,
  product_name VARCHAR(255) DEFAULT NULL,
  quantite INT NOT NULL,
  prix DECIMAL(10,2) NOT NULL,
  PRIMARY KEY (id),
  KEY idx_ligne_commande (commande_id),
  KEY idx_ligne_produit (product_id),
  CONSTRAINT fk_ligne_commande FOREIGN KEY (commande_id) REFERENCES commande(id)
    ON DELETE CASCADE,
  CONSTRAINT fk_ligne_produit FOREIGN KEY (product_id) REFERENCES produit(id)
    ON DELETE RESTRICT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Table facture
DROP TABLE IF EXISTS facture;
CREATE TABLE facture (
  id INT AUTO_INCREMENT PRIMARY KEY,
  numero VARCHAR(50) NOT NULL UNIQUE,
  commande_id INT NOT NULL,
  date DATETIME NOT NULL,
  total DECIMAL(10,2) NOT NULL DEFAULT 0,
  statut ENUM('EMISE','PAYEE','ANNULEE') NOT NULL DEFAULT 'EMISE',
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_facture_commande FOREIGN KEY (commande_id) REFERENCES commande(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;



-- ---------- Livraisons ----------

DROP TABLE IF EXISTS livraison;
CREATE TABLE livraison (
  id INT NOT NULL AUTO_INCREMENT,
  commande_id INT NOT NULL,
  date_livraison DATETIME DEFAULT CURRENT_TIMESTAMP,
  statut ENUM('EN_ATTENTE', 'EXPEDIE', 'LIVRE') DEFAULT 'EN_ATTENTE',
  PRIMARY KEY (id),
  KEY idx_livraison_commande (commande_id),
  CONSTRAINT fk_livraison_commande FOREIGN KEY (commande_id) REFERENCES commande(id)
    ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ---------- Données démo ----------

INSERT INTO category (nom) VALUES ('Alimentation'), ('Électronique');
INSERT INTO client (nom, prenom, telephone, email) VALUES
  ('Doe', 'John', '0600000000', 'john.doe@mail.com'),
  ('Smith', 'Alice', '0700000000', 'alice.smith@mail.com');
INSERT INTO fournisseur (nom, contact, telephone, email) VALUES
  ('Fournisseur X', 'Mme X', '0500000000', 'fx@mail.com'),
  ('Fournisseur Y', 'M. Y', '0511111111', 'fy@mail.com');
INSERT INTO produit (nom, category_id, prix, quantite) VALUES
  ('Riz 5kg', 1, 12.50, 18),
  ('Souris USB', 2, 9.90, 4);

-- Données demo facture
INSERT INTO facture (numero, commande_id, date, total, statut) VALUES ('FAC-0001', 1, NOW(), 120.00, 'EMISE');
