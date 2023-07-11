const express = require('express');
const { Pool } = require('pg');

const app = express();
const port = 3000;

// Configuration de la connexion à la base de données PostgreSQL
const pool = new Pool({
  user: 'defaultuser',
  host: 'localhost',
  database: 'sunuapi',
  password: 'root123',
  port: 5432,
});

// Récupérer toutes les données météo
app.get('/donne_meteo', (req, res) => {
  pool.query('SELECT * FROM donne_meteo', (error, results) => {
    if (error) {
      console.error(error);
      res.status(500).json({ error: 'Erreur lors de la récupération des données météo.' });
    } else {
      res.json(results.rows);
    }
  });
});

// Récupérer une donnée météo par ID
app.get('/donne_meteo/:id', (req, res) => {
  const id = req.params.id;
  pool.query('SELECT * FROM donne_meteo WHERE id = $1', [id], (error, results) => {
    if (error) {
      console.error(error);
      res.status(500).json({ error: 'Erreur lors de la récupération de la donnée météo.' });
    } else if (results.rows.length === 0) {
      res.status(404).json({ error: 'La donnée météo demandée est introuvable.' });
    } else {
      res.json(results.rows[0]);
    }
  });
});

// Ajouter une donnée météo
app.post('/donne_meteo', (req, res) => {
  const { id_service, region, temperature_max_jour, temperature_max_nuit, heure_soleil, jour_pluie, precipitation } = req.body;
  pool.query(
    'INSERT INTO donne_meteo (id_service, region, temperature_max_jour, temperature_max_nuit, heure_soleil, jour_pluie, precipitation) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *',
    [id_service, region, temperature_max_jour, temperature_max_nuit, heure_soleil, jour_pluie, precipitation],
    (error, results) => {
      if (error) {
        console.error(error);
        res.status(500).json({ error: 'Erreur lors de l\'ajout de la donnée météo.' });
      } else {
        res.status(201).json(results.rows[0]);
      }
    }
  );
});

// Mettre à jour une donnée météo
app.put('/donne_meteo/:id', (req, res) => {
  const id = req.params.id;
  const { id_service, region, temperature_max_jour, temperature_max_nuit, heure_soleil, jour_pluie, precipitation } = req.body;
  pool.query(
    'UPDATE donne_meteo SET id_service = $1, region = $2, temperature_max_jour = $3, temperature_max_nuit = $4, heure_soleil = $5, jour_pluie = $6, precipitation = $7 WHERE id = $8 RETURNING *',
    [id_service, region, temperature_max_jour, temperature_max_nuit, heure_soleil, jour_pluie, precipitation, id],
    (error, results) => {
      if (error) {
        console.error(error);
        res.status(500).json({ error: 'Erreur lors de la mise à jour de la donnée météo.' });
      } else if (results.rows.length === 0) {
        res.status(404).json({ error: 'La donnée météo demandée est introuvable.' });
      } else {
        res.json(results.rows[0]);
      }
    }
  );
});

// Supprimer une donnée météo
app.delete('/donne_meteo/:id', (req, res) => {
  const id = req.params.id;
  pool.query('DELETE FROM donne_meteo WHERE id = $1 RETURNING *', [id], (error, results) => {
    if (error) {
      console.error(error);
      res.status(500).json({ error: 'Erreur lors de la suppression de la donnée météo.' });
    } else if (results.rows.length === 0) {
      res.status(404).json({ error: 'La donnée météo demandée est introuvable.' });
    } else {
      res.json({ message: 'Donnée météo supprimée avec succès.' });
    }
  });
});

// Démarrer le serveur
app.listen(port, () => {
  console.log(`Serveur démarré sur le port ${port}`);
});
