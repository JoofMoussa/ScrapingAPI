-- Table des services
CREATE TABLE service (
  id SERIAL PRIMARY KEY,
  nom VARCHAR(100) NOT NULL,
  description TEXT,
  type VARCHAR(50) NOT NULL
);

-- Table des maladies
CREATE TABLE maladie (
  id SERIAL PRIMARY KEY,
  nom VARCHAR(100) NOT NULL,
  description TEXT
);

-- Table de liaison entre les services de médicaments et les maladies
CREATE TABLE service_maladie (
  id SERIAL PRIMARY KEY,
  service_id INTEGER NOT NULL,
  maladie_id INTEGER NOT NULL,
  FOREIGN KEY (service_id) REFERENCES service (id),
  FOREIGN KEY (maladie_id) REFERENCES maladie (id)
);

-- Table des insectes
CREATE TABLE insecte (
  id SERIAL PRIMARY KEY,
  nom VARCHAR(100) NOT NULL,
  description TEXT
);

-- Table des données météo
CREATE TABLE meteo (
  id SERIAL PRIMARY KEY,
  date TIMESTAMP NOT NULL,
  temperature DECIMAL(5,2),
  humidite DECIMAL(5,2)
);

-- Table des utilisateurs
CREATE TABLE utilisateur (
  id SERIAL PRIMARY KEY,
  nom VARCHAR(100) NOT NULL,
  role VARCHAR(50) NOT NULL
);

-- Table des propositions de modifications
CREATE TABLE proposition_modification (
  id SERIAL PRIMARY KEY,
  service_id INTEGER NOT NULL,
  champ_modifie VARCHAR(100) NOT NULL,
  nouvelle_valeur TEXT,
  statut VARCHAR(50) DEFAULT 'En attente',
  FOREIGN KEY (service_id) REFERENCES service (id)
);

-- Table des validations des modifications
CREATE TABLE validation_modification (
  id SERIAL PRIMARY KEY,
  proposition_id INTEGER NOT NULL,
  administrateur_id INTEGER NOT NULL,
  statut VARCHAR(50) NOT NULL,
  FOREIGN KEY (proposition_id) REFERENCES proposition_modification (id),
  FOREIGN KEY (administrateur_id) REFERENCES utilisateur (id)
);
