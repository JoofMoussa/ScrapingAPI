const express = require('express');
const bodyParser = require('body-parser');
const { Pool } = require('pg');
const path = require('path');



const app = express();
const port = 8009; // Changement du port


// Demarrer a partir du repertoire "public"
app.use(express.static(path.join(__dirname, 'public')));

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
// faire des requetes a partir du repertoire root
app.get('/', (req, res) => {
    // extraire les parametres de requete
    const query = req.query;

    // Serve the query.html page with the query parameters
    res.sendFile(path.join(__dirname, 'public', 'index.html'),{
        query: JSON.stringify(query),
    });
});

// creation de la connexion a postgres
const pool = new Pool({
    user: 'musajoof',
    host: 'localhost',
    database: 'sunuapi',
    password: 'root123'
        // dialect: "postgres",
        // // pool est optionnel
        // pool: {
        //     max: 5,
        //     min: 0,
        //     acquire: 30000,
        //     idle: 10000
        // }
});

// Login route
app.post('/api/login', (req, res) => {
    const { email, password, role } = req.body;
    // Example query to validate the email and password and retrieve user role
    pool.query('SELECT * FROM utilisateur WHERE email = $1 AND mot_de_passe = $2', [email, password], (error, results) => {
        if (error) {
            console.error('Error executing SQL query:', error);
            res.status(500).json({ error: 'An error occurred during login' });
        } else {
            if (results.rows.length === 0) {
                // Invalid credentials
                res.status(401).json({ error: 'Invalid email or password' });
            } else {
                // Valid credentials
                const user = results.rows[0];
                const userId = user.id;
                const userName = user.nom;
                const isAdmin = user.est_admin;
                const isEditor = user.est_editeur;

                // Handle different roles
                if (isAdmin) {
                    // Redirect to the admin dashboard
                    res.redirect('/dashboard.html');
                } else if (isEditor) {
                    // Redirect to the editor template
                    res.render('editor-template', { userId, userName });
                } else {
                    // Redirect to the visitor template
                    res.render('visitor-template', { userId, userName });
                }
            }
        }
    });
});


//  Voir tout

app.get('/medicaments', (req, res) => {
    // Recuperer tout les donnees de la table "medicament"
    pool.query('SELECT * FROM medicament', (error, results) => {
        if (error) {
            console.error('Error retrieving data:', error);
            res.status(500).json({ error: 'Erreur lors de la recherche de medicaments.' });
        } else {
            const data = results.rows.map(row => {
                const { id, categorie } = row;
                return { id, categorie };
            });
            res.json(data);
        }
    });
});


// recuperer tout les  medicaments
app.get('/produitpharma', (req, res) => {
    // Executer la requete SQL pour recuperer tout les lignes de la table "medicament"
    pool.query('SELECT * FROM produit', (error, results) => {
        if (error) {
            console.error('Erreur a la recuperation:', error);
            res.status(500).json({ error: 'Une erreur est apparue a la recherche .' });
        } else {
            const data = results.rows.map(row => {
                const { id, code, modele, image, prix, conditionnement, forme, specialites } = row;
                return { id, code, modele, image, prix, conditionnement, forme, specialites };
            });
            res.json(data);
        }
    });
});

// recuperer tout les  medicaments de la base de donnees globales
app.get('/basemedoc', (req, res) => {
    pool.query('SELECT * FROM drugbase', (error, results) => {
        if (error) {
            console.error('Erreur a la recuperation:', error);
            res.status(500).json({ error: 'Une erreur est apparue a la recherche medicaments.' });
        } else {
            res.json(results.rows);
        }
    });
});

// recuperer tout les  formes de medicaments
app.get('/formeproduitpharma', (req, res) => {
    pool.query('SELECT forme FROM produit GROUP BY forme ORDER BY forme', (error, results) => {
        if (error) {
            console.error('Erreur a la recuperation:', error);
            res.status(500).json({ error: 'Une erreur est apparue a la recherche des differents formes.' });
        } else {
            res.json(results.rows);
        }
    });
});



// recuperer tout les  utilisateurs
app.get('/utilisateur', (req, res) => {
    pool.query('SELECT * FROM utilisateur', (error, results) => {
        if (error) {
            console.error('Erreur a la recuperation:', error);
            res.status(500).json({ error: 'Une erreur est apparue a la recherche medicaments.' });
        } else {
            res.json(results.rows);
        }
    });
});


// recuperer tout les  medicaments de la base de donnees globales
app.get('/maladies', (req, res) => {
    pool.query('SELECT * FROM maladie', (error, results) => {
        if (error) {
            console.error('Erreur a la recuperations:', error);
            res.status(500).json({ error: 'Une erreur est apparue a la recherche .' });
        } else {
            res.json(results.rows);
        }
    });
});


//**********************************  BY ID *********************************/

// recuperer tout les utilisateurs par ID
app.get('/utilisateur/:id', (req, res) => {
    const id = req.params.id;

    pool.query('SELECT * FROM utilisateur WHERE id = $1', [id])
        .then(result => {
            const data = result.rows[0]; // Recuperer la premiere ligne
            res.json(data);
        })
        .catch(error => {
            console.error('Erreur a la recuperation:', error);
            res.status(500).json({ error: 'Une erreur est apparue a la recherche.' });
        });
});

// recuperer tout les medicament par ID
app.get('/medicaments/:id', (req, res) => {
    const id = req.params.id;

    pool.query('SELECT * FROM medicament WHERE id = $1', [id])
        .then(result => {
            const data = result.rows[0]; // Recuperer la premiere ligne
            res.json(data);
        })
        .catch(error => {
            console.error('Erreur a la recuperation:', error);
            res.status(500).json({ error: 'Une erreur est apparue a la recherche the medicament.' });
        });
});

// recuperer tout les produit par ID
app.get('/produitpharma/:id', (req, res) => {
    const id = req.params.id;

    pool.query('SELECT * FROM produit WHERE id = $1', [id])
        .then(result => {
            const data = result.rows[0]; // Recuperer la premiere ligne
            res.json(data);
        })
        .catch(error => {
            console.error('Erreur a la recuperation:', error);
            res.status(500).json({ error: 'Une erreur est apparue a la recherche the medicament.' });
        });
});

// recuperer tout les medicaments de la base de donnees centrales par ID
app.get('/basemedoc/:id', (req, res) => {
    const id = req.params.id;

    pool.query('SELECT * FROM drugbase WHERE id = $1', [id])
        .then(result => {
            const data = result.rows[0]; // Recuperer la premiere ligne
            res.json(data);
        })
        .catch(error => {
            console.error('Erreur a la recuperation:', error);
            res.status(500).json({ error: 'Une erreur est apparue a la recherche ' });
        });
});

app.get('/maladies/:id', (req, res) => {
    const id = req.params.id;

    pool.query('SELECT * FROM maladie WHERE id = $1', [id])
        .then(result => {
            const data = result.rows[0]; // Recuperer la premiere ligne
            res.json(data);
        })
        .catch(error => {
            console.error('Erreur a la recuperation:', error);
            res.status(500).json({ error: 'Une erreur est apparue a la recherche.' });
        });
});

//**********************************  BY NAME *********************************/

// recuperer tout les produit par ID
app.get('api/produitpharma/:nom', (req, res) => {
    const nomprod = req.params.nomprod;

    pool.query('SELECT * FROM produit WHERE modele = "$1"', [nomprod])
        .then(result => {
            const data = result.rows[0]; // Recuperer la premiere ligne
            res.json(data);
        })
        .catch(error => {
            console.error('Erreur a la recuperation:', error);
            res.status(500).json({ error: 'Une erreur est apparue a la recherche the medicament.' });
        });
});


// Ajouter utilisateur
app.post('/utilisateur', (req, res) => {
    const { email, username, password } = req.body;

    pool.query(
            'INSERT INTO utilisateur (email, username, mot_de_passe) VALUES ($1, $2, $3)', [email, username, password]
        )
        .then(() => {
            res.status(201).json({ message: 'Utilisateur cree avec succes.' });
        })
        .catch(error => {
            console.error('Erreur lors de l enregistrement de l utilisateur:', error);
            res.status(500).json({ error: 'Erreur lors de l enregistrement de l utilisateur.' });
        });
});



// Creer un medicament
app.post('/medicaments', (req, res) => {
    const { nom_generique, nom_standard, force, expiration, entreprise, date_production } = req.body;

    pool.query(
            'INSERT INTO medicament (nom_generique, nom_standard, force, expiration, entreprise, date_production) VALUES ($1, $2, $3, $4, $5, $6)', [nom_generique, nom_standard, force, expiration, entreprise, date_production]
        )
        .then(() => {
            res.status(201).json({ message: 'Medicament created successfully.' });
        })
        .catch(error => {
            console.error('Error creating medicament:', error);
            res.status(500).json({ error: 'An error occurred while creating the medicament.' });
        });
});

// Mis a jour des medicaments
app.put('/medicaments/:id', (req, res) => {
    const id = req.params.id;
    const { nom_generique, nom_standard, force, expiration, entreprise, date_production } = req.body;

    pool.query(
            'UPDATE medicament SET nom_generique = $1, nom_standard = $2, force = $3, expiration = $4, entreprise = $5, date_production = $6 WHERE id = $7', [nom_generique, nom_standard, force, expiration, entreprise, date_production, id]
        )
        .then(() => {
            res.json({ message: `Medicament with ID ${id} updated successfully.` });
        })
        .catch(error => {
            console.error('Error updating medicament:', error);
            res.status(500).json({ error: 'An error occurred while updating the medicament.' });
        });
});

// Effacer un  medicament
app.delete('/medicaments/:id', (req, res) => {
    const id = req.params.id;

    pool.query('DELETE FROM medicament WHERE id = $1', [id])
        .then(() => {
            res.json({ message: `Medicament avec l 'identifiant ${id} effacer avec success.` });
        })
        .catch(error => {
            console.error('Error deleting medicament:', error);
            res.status(500).json({ error: 'An error occurred while deleting the medicament.' });
        });
});

// Effacer tout les  medicaments
app.delete('/medicaments', (req, res) => {
    pool.query('DELETE FROM medicament')
        .then(() => {
            res.json({ message: 'Tout les medicaments effaces avec succes.' });
        })
        .catch(error => {
            console.error('Error deleting medicaments:', error);
            res.status(500).json({ error: 'An error occurred while deleting the medicaments.' });
        });
});


// Demarrage du serveur
app.listen(port, () => {
    console.log(`Acceder au serveur http://localhost:${port}`);
});