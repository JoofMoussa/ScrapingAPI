const express = require('express');// express framwork web Node.js
const bodyParser = require('body-parser'); // analyse les corps de requete
const { Pool } = require('pg'); // interapir avec une BD postgres
const path = require('path');
const http = require('http')

const app = express();
const server = http.createServer(app)
server.listen(process.env.PORT || 8011)

// creation de la connexion a postgres
const pool = new Pool({
    user: 'defaultuser2',
    host: 'localhost',
    database: 'sunuapi',
    password: 'root123'
    
});
   
app.use(express.json())
// création des endpoits avec les verbes(get,post,put,delete,putch)


// *********    création des endpoits avec les verbes(get,post,put,delete,putch)   *************

// recuperation des insectes
app.get('/P5_groupe1/API/insectes',(req,res) => {
    // Recuperer tous les insectes nuisibles de la table insecte
    pool.query('SELECT * from insecte',(error,resultats) =>{
        if(error){
            console.log('Error recuperation data:',error);
            res.status(500).json({error:"Erreur lors de la recherche d 'insectes"});
        } else {
            const data = resultats.rows.map(row => {
                const { id, nom,image_url,description_insecte,partie1,partie2,famille,diagnostic,id_service} = row;

                return {id, nom,image_url,description_insecte,partie1,partie2,famille,diagnostic,id_service}
            });
            res.json(data);
        }
    });
})

// recuperer un insecte par son identifiant
app.get('/P5_groupe1/API/insecte/:id', (req, res) => {
    const id = req.params.id;

    pool.query('SELECT * FROM insecte WHERE id = $1',[id])
        .then(result => {
            const data = result.rows[0]; // Recuperer la premiere ligne
            res.json(data);
        })
        .catch(error => {
            console.error('Erreur a la recuperation:', error);
            res.status(500).json({ error: 'Une erreur est apparue a la recherche.' });
        });
});


// creer un insecte nuisible

app.post('/P5_groupe1/API/ajout_insecte', (req, res) => {
    const { nom, image_url, description_insecte, partie1, partie2, famille,diagnostic,id_service} = req.body; //req.body est un objet qui contient les données envoyées avec la requéte POST

    pool.query(
            'INSERT INTO insecte (nom, image_url,description_insecte, partie1, partie2, famille,diagnostic,id_service) VALUES ($1, $2, $3, $4, $5, $6,$7,$8)', [nom, image_url, description_insecte, partie1, partie2, famille,diagnostic,id_service]
        )
        .then(() => {
            res.status(201).json({ message: 'création insecte réussi.' });
        })
        .catch(error => {
            console.error('erreur lors de la creation d insecte:', error);
            res.status(500).json({ error: 'An error occurred while creating the insect.' });
        });
});


// Mis a jour d'un insectes
app.put('/P5_groupe1/API/update_insecte/:id', (req, res) => {
    const id = req.params.id;
    const { nom, image_url, description_insecte, partie1, partie2, famille,diagnostic,id_service} = req.body; //req.body est un objet qui contient les données envoyées avec la requéte POST
    pool.query(
            'UPDATE insecte SET nom = $1, image_url = $2, description_insecte = $3, partie1 = $4, partie2 = $5, famille = $6,diagnostic = $7,id_service = $8 WHERE id = $9', [nom, image_url, description_insecte, partie1, partie2, famille,diagnostic,id_service, id]
        )
        .then(() => {
            res.json({ message: `insecte avec id ${id} a été mise à jour` });
        })
        .catch(error => {
            console.error('erreur de mise à jour insecte', error);
            res.status(500).json({ error: 'An error occurred while updating the insect.' });
        });
});


// Effacer un  insecte

app.delete('/P5_groupe1/API/delete_insecte/:id', (req, res) => {
    const id = req.params.id;

    pool.query('DELETE FROM insecte WHERE id = $1', [id])
        .then(() => {
            res.json({ message: `insecte avec l 'identifiant ${id} effacer avec success.` });
        })
        .catch(error => {
            console.error('Error deleting insect:', error);
            res.status(500).json({ error: 'An error occurred while deleting the insecte.' });
        });
});