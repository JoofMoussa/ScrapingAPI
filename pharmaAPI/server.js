const express = require('express');
const { Pool } = require('pg');
const path = require('path');
const bodyParser = require('body-parser');




const app = express();
const port = 8005; // Changement du port

app.use(bodyParser.json());
// Demarrer a partir du repertoire "public"
app.use(express.static(path.join(__dirname, 'public')));

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

app.post('/api/login', (req, res) => {
    const { username, password } = req.body;

    pool.query("SELECT * FROM utilisateur WHERE username = $1 AND mot_de_passe = $2", [username, password])
        .then(result => {
            const user = result.rows[0];
            console.log(user);
            if (!user) {
                return res.status(401).json({ error: 'Nom d utilisateur ou mot de passe incorrecte.' });
            }

            // Prepare the data to be sent to the client
            const data = {
                role: 'visitor' // default role is 'visitor'
            };

            if (user.est_admin) {
                data.role = 'admin';
            } else if (user.est_editeur) {
                data.role = 'editor';
            }

            // Send the data as JSON response
            res.json(data);
        })
        .catch(error => {
            console.error('Erreur pendant la connexion:', error);
            res.status(500).json({ error: 'Une erreur est survenue pendant la connexion.' });
        });
});


// app.post('/api/login', (req, res) => {
//     const { username, password, role } = req.body;

//     pool.query("SELECT * FROM utilisateur WHERE username = $1 AND mot_de_passe = $2 ", [username, password])
//         .then(result => {
//             const user = result.rows[0];
//             console.log(user);
//             if (!user) {
//                 return res.status(401).json({ error: 'Nom d utilisateur ou mot de passe incorrecte.' });
//             }

//             // Check if the user is connected
//             const isConnected = true; // Replace this with your actual condition to check if the user is connected

//             // Prepare the data to be sent to the dashboard
//             const data = {
//                 username: username,
//                 isConnected: isConnected
//             };

//             // Send the data as JSON response
//             res.json(data);
//         })
//         .catch(error => {
//             console.error('Erreur pendant la connexion:', error);
//             res.status(500).json({ error: 'Une erreur est survenue pendant la connexion.' });
//         });
// });

// app.post('/api/login', (req, res) => {
//     const { username, password, role } = req.body;

//     pool.query("SELECT * FROM utilisateur WHERE username = $1 AND mot_de_passe = $2 ", [username, password])
//         .then(result => {
//             const user = result.rows[0];
//             console.log(user);
//             if (!user) {
//                 return res.status(401).json({ error: 'Nom d utilisateur ou mot de passe incorrecte.' });
//             }

//             // Check if the user is connected
//             const isConnected = true; // Replace this with your actual condition to check if the user is connected

//             // Prepare the redirect URL
//             let redirectUrl = '';
//             if (user.est_admin && isConnected) {
//                 console.log('admin connecte');
//                 // Redirect admin to dashboard.html
//                 //redirectUrl = 'admin/dashboard.html';
//                 redirectUrl = 'admin/dashboard.html?username=' + encodeURIComponent(username);
//             } else if (user.est_editeur && isConnected) {
//                 console.log('editeur connecte');
//                 // Redirect editor to index.html with suggest option
//                 redirectUrl = '/index.html?suggestion=true';
//             } else if (isConnected) {
//                 // Redirect visitor to index.html
//                 console.log('visiteur connecte');
//                 redirectUrl = '/index.html';
//             } else {
//                 // Handle the case when the user is not connected
//                 console.log('user not connected');
//                 return res.status(401).json({ error: 'Utilisateur non connecté.' });
//             }

//             // Send the redirect URL as JSON response
//             res.json({ redirectUrl });
//         })
//         .catch(error => {
//             console.error('Erreur pendant la connexion:', error);
//             res.status(500).json({ error: 'Une erreur est survenue pendant la connexion.' });
//         });
// });

// app.post('/api/login', (req, res) => {
//     const { username, password, role } = req.body;

//     pool.query("SELECT * FROM utilisateur WHERE username = $1 AND mot_de_passe = $2 ", [username, password])
//         .then(result => {
//             const user = result.rows[0];
//             console.log(user);
//             if (!user) {
//                 return res.status(401).json({ error: 'Nom d utilisateur ou mot de passe incorrecte.' });
//             }

//             // Check if the user is connected
//             const isConnected = true; // Replace this with your actual condition to check if the user is connected

//             // Redirect based on user role and connection status
//             if (user.est_admin && isConnected) {
//                 console.log('admin connecte');
//                 // Redirect admin to dashboard.html
//                 //return res.redirect('/dashboard.html');
//                 // Redirect admin to dashboard.html
//                 return res.json({ redirectUrl: '/dashboard.html' });

//             } else if (user.est_editeur && isConnected) {
//                 console.log('editeur connecte');
//                 // Redirect editor to index.html with suggest option
//                 return res.redirect('/index.html?suggest=true');
//             } else if (isConnected) {
//                 // Redirect visitor to index.html
//                 console.log('visiteur connecte');
//                 return res.redirect('/index.html');
//             } else {
//                 // Handle the case when the user is not connected
//                 console.log('user not connected');
//                 return res.status(401).json({ error: 'Utilisateur non connecté.' });
//             }
//         })
//         .catch(error => {
//             console.error('Erreur pendant la connexion:', error);
//             res.status(500).json({ error: 'Une erreur est survenue pendant la connexion.' });
//         });
// });


// app.post('/api/login', (req, res) => {
//     const { username, password, role } = req.body;

//     pool.query("SELECT * FROM utilisateur WHERE username = $1 AND mot_de_passe = $2 ", [username, password])
//         .then(result => {
//             const user = result.rows[0];
//             console.log(user);
//             if (!user) {
//                 return res.status(401).json({ error: 'Nom d utilisateur ou mot de passe incorrecte.' });
//             }
//             console.log(user.est_admin);
//             // verifier que l utilisateur est un admin  et le transferer vers le dashboard
//             if (user.est_admin === true) {
//                 //console.log('admin connecte');
//                 // Redirection admin  dashboard.html
//                 return res.redirect('public/admin/dashboard.html');
//                 //res.sendFile(path.join(__dirname, 'public/admin', 'dashboard.html'), {
//                 //    query: JSON.stringify(user.est_admin),
//                 //});
//             } else if (user.est_editeur) {
//                 //console.log('editeur connecte');
//                 // Redirect editor to index.html with suggest option
//                 return res.redirect('index.html?suggest=true');
//             } else {
//                 // Redirect visitor to index.html
//                 return res.redirect('index.html');
//                 //console.log('visiteur connecte');

//             }
//         })
//         .catch(error => {
//             console.error('Erreur pendant la connexion:', error);
//             res.status(500).json({ error: 'Une erreur est survenue pendant la connexion.' });
//         });
// });



// recuperer tout les  formes de medicaments
app.get('/api/v1/formeproduitpharma', (req, res) => {
    pool.query('SELECT forme FROM produit GROUP BY forme ORDER BY forme', (error, results) => {
        if (error) {
            console.error('Erreur a la recuperation:', error);
            res.status(500).json({ error: 'Une erreur est apparue a la recherche des differents formes.' });
        } else {
            res.json(results.rows);
        }
    });
});



app.get('/api/v1/produitbypattern', (req, res) => {
    const myParam = req.query.param;

    pool.query('SELECT * FROM produit WHERE modele LIKE $1', [`%${myParam}%`])
        .then(result => {
            const data = result.rows;
            res.json(data);
        })
        .catch(error => {
            console.error('Error during retrieval:', error);
            res.status(500).json({ error: 'An error occurred during the search.' });
        });
});


app.get('/api/v1/produitFilterSelect', (req, res) => {
    const selectedCategories = req.query.categories; // Get the selected categories from the query parameters

    let query = 'SELECT * FROM produit';
    let queryParams = [];

    // Check if categories are provided and build the WHERE clause for filtering
    if (selectedCategories && selectedCategories.length > 0) {
        const placeholders = selectedCategories.map((_, index) => `$${index + 1}`).join(',');
        query += ` WHERE forme=${placeholders})`;
        queryParams = selectedCategories;
    }

    pool.query(query, queryParams)
        .then(result => {
            const data = result.rows;
            res.json(data);
        })
        .catch(error => {
            console.error('Error retrieving produit data:', error);
            res.status(500).json({ error: 'An error occurred during the search.' });
        });
});


app.get('/api/v1/produitlink', (req, res) => {
    const selectedCategories = req.query.categories; // Get the selected categories from the query parameters

    let query = 'SELECT * FROM produit';
    let queryParams = [];
    // SELECT * FROM produit WHERE refid=(SELECT idtypemed FROM medicament WHERE categorie LIKE '%ORL%')
    // Check if categories are provided and build the WHERE clause for filtering
    if (selectedCategories && selectedCategories.length > 0) {
        const placeholders = selectedCategories.map((_, index) => `$${index + 1}`).join(',');
        query += ` WHERE refid=(SELECT idtypemed FROM medicament) WHERE categorie IN (${placeholders})`;
        queryParams = selectedCategories;
    }

    pool.query(query, queryParams)
        .then(result => {
            const data = result.rows;
            res.json(data);
        })
        .catch(error => {
            console.error('Error retrieving produit data:', error);
            res.status(500).json({ error: 'An error occurred during the search.' });
        });
});

app.get('/api/produitbyid/:id', async(req, res) => {
    try {
        const id = req.params.id;

        const client = await pool.connect();
        const query = 'SELECT * FROM produit WHERE id = $1';
        const result = await client.query(query, [id]);
        client.release();

        const row = result.rows[0];

        res.json(row);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal server error' });
    }
});


app.route('/api/v1/:table')
    .get((req, res) => {
        const table = req.params.table;
        const pattern = req.query.pattern;

        let query = '';
        let nomTable = '';

        if (table === 'utilisateur') {
            query = 'SELECT * FROM utilisateur';
            nomTable = 'utilisateur';
        } else if (table === 'maladie') {
            query = 'SELECT * FROM maladie';
            nomTable = 'maladie';
        } else if (table === 'drugbase') {
            query = 'SELECT * FROM drugbase';
            nomTable = 'drugbase';
        } else if (table === 'medicament') {
            query = 'SELECT * FROM medicament';
            nomTable = 'medicament';
        } else if (table === 'produit') {
            query = 'SELECT * FROM produit';
            nomTable = 'produit';
        } else {
            return res.status(404).json({ error: 'Table not found.' });
        }
        // ajouter a la requete si l utilisateur augmente un pattern
        if (pattern) {
            if (nomTable === 'maladie') {
                query += ` WHERE UPPER(prescript) LIKE '%${pattern}%' OR UPPER(nom) LIKE '%${pattern}%' `;
            } else if (nomTable === 'drugbase') {
                query += ` WHERE UPPER(nom_generique) LIKE '%${pattern}%' OR UPPER(nom_standard) LIKE '%${pattern}%'`;
            } else if (nomTable === 'medicament') {
                query += ` WHERE nom_generique LIKE '%${pattern}%' OR nom_standard LIKE '%${pattern}%'`;
            } else if (nomTable === 'produit') {
                query += ` WHERE forme LIKE '%${pattern}%' OR modele LIKE '%${pattern}%'`;
            }
        }

        pool.query(query, (error, results) => {
            if (error) {
                console.error('Error retrieving data:', error);
                res.status(500).json({ error: 'An error occurred during the search.' });
            } else {
                const data = results.rows;
                res.json({ nomTable, data });
            }
            //return res.redirect('/index.html');

        });
    })
    .post((req, res) => {
        const table = req.params.table;
        const data = req.body;

        let query = '';
        let nomTable = '';

        if (table === 'utilisateur') {
            const { username, mot_de_passe, est_admin, est_editeur } = data;
            query = 'INSERT INTO utilisateur (username, mot_de_passe, est_admin, est_editeur) VALUES ($1, $2, $3, $4)';
            nomTable = 'utilisateur';
            const values = [username, mot_de_passe, est_admin, est_editeur];
            pool.query(query, values)
                .then(() => {
                    res.status(201).json({ message: `${nomTable} created successfully.` });
                })
                .catch(error => {
                    console.error(`Error creating ${nomTable}:`, error);
                    res.status(500).json({ error: `An error occurred while creating the ${nomTable}.` });
                });
        } else if (table === 'maladie') {
            const { prescript, nom, description, vote, recommandation } = data;
            query = 'INSERT INTO maladie (prescript, nom, description, vote, recommandation) VALUES ($1, $2, $3, $4, $5)';
            nomTable = 'maladie';
            const values = [prescript, nom, description, vote, recommandation];
            pool.query(query, values)
                .then(() => {
                    res.status(201).json({ message: `${nomTable} created successfully.` });
                })
                .catch(error => {
                    console.error(`Error creating ${nomTable}:`, error);
                    res.status(500).json({ error: `An error occurred while creating the ${nomTable}.` });
                });
        } else if (table === 'drugbase') {
            const { id, nom_generique, nom_standard, force, expiration, entreprise, dateproduct, idservice } = data;
            query = 'INSERT INTO drugbase (id, nom_generique, nom_standard, force, expiration, entreprise, dateproduct, idservice) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)';
            nomTable = 'drugbase';
            const values = [id, nom_generique, nom_standard, force, expiration, entreprise, dateproduct, idservice];
            pool.query(query, values)
                .then(() => {
                    res.status(201).json({ message: `${nomTable} created successfully.` });
                })
                .catch(error => {
                    console.error(`Error creating ${nomTable}:`, error);
                    res.status(500).json({ error: `An error occurred while creating the ${nomTable}.` });
                });
        } else if (table === 'medicament') {
            const { nom_generique, nom_standard, force, expiration, entreprise, date_production } = data;
            query = 'INSERT INTO medicament (nom_generique, nom_standard, force, expiration, entreprise, date_production) VALUES ($1, $2, $3, $4, $5, $6)';
            nomTable = 'medicament';
            const values = [nom_generique, nom_standard, force, expiration, entreprise, date_production];
            pool.query(query, values)
                .then(() => {
                    res.status(201).json({ message: `${nomTable} created successfully.` });
                })
                .catch(error => {
                    console.error(`Error creating ${nomTable}:`, error);
                    res.status(500).json({ error: `An error occurred while creating the ${nomTable}.` });
                });
        } else if (table === 'produit') {
            const { id, code, modele, image, prix, conditionnement, forme, specialites, refid } = data;
            query = 'INSERT INTO produit (id, code, modele, image, prix, conditionnement, forme, specialites, refid) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)';
            nomTable = 'produit';
            const values = [id, code, modele, image, prix, conditionnement, forme, specialites, refid];
            pool.query(query, values)
                .then(() => {
                    res.status(201).json({ message: `${nomTable} created successfully.` });
                })
                .catch(error => {
                    console.error(`Error creating ${nomTable}:`, error);
                    res.status(500).json({ error: `An error occurred while creating the ${nomTable}.` });
                });
        } else {
            return res.status(404).json({ error: 'Table not found.' });
        }
    })
    .put((req, res) => {
        const table = req.params.table;
        const id = req.query.id;
        const data = req.body;

        let query = '';
        let nomTable = '';

        if (table === 'utilisateur') {
            const { username, mot_de_passe, est_admin, est_editeur } = data;
            query = 'UPDATE utilisateur SET username = $1, mot_de_passe = $2, est_admin = $3, est_editeur = $4 WHERE id = $5';
            nomTable = 'utilisateur';
            const values = [username, mot_de_passe, est_admin, est_editeur, id];
            pool.query(query, values)
                .then(() => {
                    res.json({ message: `${nomTable} with ID ${id} updated successfully.` });
                })
                .catch(error => {
                    console.error(`Error updating ${nomTable}:`, error);
                    res.status(500).json({ error: `An error occurred while updating the ${nomTable}.` });
                });
        } else if (table === 'maladie') {
            const { prescript, nom, description, vote, recommandation } = data;
            query = 'UPDATE maladie SET prescript = $1, nom = $2, description = $3, vote = $4, recommandation = $5 WHERE id = $6';
            nomTable = 'maladie';
            const values = [prescript, nom, description, vote, recommandation, id];
            pool.query(query, values)
                .then(() => {
                    res.json({ message: `${nomTable} with ID ${id} updated successfully.` });
                })
                .catch(error => {
                    console.error(`Error updating ${nomTable}:`, error);
                    res.status(500).json({ error: `An error occurred while updating the ${nomTable}.` });
                });
        } else if (table === 'drugbase') {
            const { id, nom_generique, nom_standard, force, expiration, entreprise, dateproduct, idservice } = data;
            query = 'UPDATE drugbase SET nom_generique = $1, nom_standard = $2, force = $3, expiration = $4, entreprise = $5, dateproduct = $6, idservice = $7 WHERE id = $8';
            nomTable = 'drugbase';
            const values = [nom_generique, nom_standard, force, expiration, entreprise, dateproduct, idservice, id];
            pool.query(query, values)
                .then(() => {
                    res.json({ message: `${nomTable} with ID ${id} updated successfully.` });
                })
                .catch(error => {
                    console.error(`Error updating ${nomTable}:`, error);
                    res.status(500).json({ error: `An error occurred while updating the ${nomTable}.` });
                });
        } else if (table === 'medicament') {
            const { nom_generique, nom_standard, force, expiration, entreprise, date_production } = data;
            query = 'UPDATE medicament SET nom_generique = $1, nom_standard = $2, force = $3, expiration = $4, entreprise = $5, date_production = $6 WHERE id = $7';
            nomTable = 'medicament';
            const values = [nom_generique, nom_standard, force, expiration, entreprise, date_production, id];
            pool.query(query, values)
                .then(() => {
                    res.json({ message: `${nomTable} with ID ${id} updated successfully.` });
                })
                .catch(error => {
                    console.error(`Error updating ${nomTable}:`, error);
                    res.status(500).json({ error: `An error occurred while updating the ${nomTable}.` });
                });
        } else if (table === 'produit') {
            const { id, code, modele, image, prix, conditionnement, forme, specialites, refid } = data;
            query = 'UPDATE produit SET code = $1, modele = $2, image = $3, prix = $4, conditionnement = $5, forme = $6, specialites = $7, refid = $8 WHERE id = $9';
            nomTable = 'produit';
            const values = [code, modele, image, prix, conditionnement, forme, specialites, refid, id];
            pool.query(query, values)
                .then(() => {
                    res.json({ message: `${nomTable} with ID ${id} updated successfully.` });
                })
                .catch(error => {
                    console.error(`Error updating ${nomTable}:`, error);
                    res.status(500).json({ error: `An error occurred while updating the ${nomTable}.` });
                });
        } else {
            return res.status(404).json({ error: 'Table not found.' });
        }
    })
    .delete((req, res) => {
        const table = req.params.table;
        const id = req.query.id;

        let query = '';
        let nomTable = '';

        if (table === 'utilisateur') {
            query = 'DELETE FROM utilisateur WHERE id = $1';
            nomTable = 'utilisateur';
        } else if (table === 'maladie') {
            query = 'DELETE FROM maladie WHERE id = $1';
            nomTable = 'maladie';
        } else if (table === 'drugbase') {
            query = 'DELETE FROM drugbase WHERE id = $1';
            nomTable = 'drugbase';
        } else if (table === 'medicament') {
            query = 'DELETE FROM medicament WHERE id = $1';
            nomTable = 'medicament';
        } else if (table === 'produit') {
            query = 'DELETE FROM produit WHERE id = $1';
            nomTable = 'produit';
        } else {
            return res.status(404).json({ error: 'Table not found.' });
        }

        pool.query(query, [id])
            .then(() => {
                res.json({ message: `${nomTable} with ID ${id} deleted successfully.` });
            })
            .catch(error => {
                console.error(`Error deleting ${nomTable}:`, error);
                res.status(500).json({ error: `An error occurred while deleting the ${nomTable}.` });
            });
    });
// Demarrage du serveur
app.listen(port, () => {
    console.log(`Acceder au serveur http://localhost:${port}`);
    console.log(`+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++`);
    console.log(`POST   => Ajouter utilisateur     http://localhost:${port}/api/v2/utilisateur`);
    console.log(`+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++`);
    console.log(`GET    => Recuperer tout les medicaments http://localhost:${port}/api/v1/medicaments`);
    console.log(`POST   => Ajout de medicaments http://localhost:${port}/api/v2/medicaments`);
    console.log(`UPDATE => MIS A JOUR des medicaments  http://localhost:${port}/api/v3/medicaments`);
    console.log(`DELETE => Effacer les medicaments  http://localhost:${port}/api/v4/medicaments`);

});