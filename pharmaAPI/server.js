const express = require('express');
const { Pool } = require('pg');
const path = require('path');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const app = express();
// Port de demarrage du serveur
const port = 8489;
// Middleware pour parser le corps des requêtes
app.use(bodyParser.json());

// Demarrer a partir du repertoire "public"
// Middleware pour servir les fichiers HTML statiques
app.use(express.static(path.join(__dirname, 'public')));

// faire des requetes a partir du repertoire root
app.get('/', (req, res) => {
    // extraire les parametres de requete
    const query = req.query;
    // Serve the query.html page with the query parameters
    res.sendFile(path.join(__dirname, 'public', 'index.html'), {
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

// Route for user registration
app.post('/inscription', async(req, res) => {
    try {
        const { username, mot_de_passe } = req.body;
        const saltRounds = 10;

        // Hash the password
        const hashedPassword = await bcrypt.hash(mot_de_passe, saltRounds);

        // Store the hashed password in the database
        const query = 'INSERT INTO utilisateur (username, mot_de_passe) VALUES ($1, $2)';
        const values = [username, hashedPassword];
        await pool.query(query, values);

        res.status(201).json({ message: 'Utilisateur créé avec succès' });
    } catch (error) {
        res.status(500).json({ error: 'Une erreur s\'est produite lors de l\'inscription' });
    }
});



// Route de connexion de l'utilisateur
app.post('/login', async(req, res) => {
    try {
        const { username, mot_de_passe } = req.body;

        const query = `
        SELECT * FROM utilisateur
        WHERE username = $1;
        `;

        const result = await pool.query(query, [username]);

        if (result.rows.length === 0) {
            return res.status(401).json({ error: 'Nom d\'utilisateur incorrect' });
        }

        const user = result.rows[0];
        const passwordMatch = await bcrypt.compare(mot_de_passe, user.mot_de_passe);

        if (!passwordMatch) {
            return res.status(401).json({ error: 'Mot de passe incorrect' });
        }

        // Générer le token JWT
        const token = jwt.sign({ userId: user.id, roleadmin: user.est_admin, roleediteur: user.est_editeur },
            'votre_clé_secrète', { expiresIn: '1h' }
        );

        // Rediriger l'utilisateur vers la page correspondante en fonction de son rôle
        if (user.roleadmin) {
            return res.redirect('/admin/dashboard.html');
        } else if (user.roleediteur) {
            return res.redirect('/editeur/index.html');
        } else {
            return res.status(403).json({ error: 'Accès refusé' });
        }
    } catch (error) {
        res.status(500).json({ error: 'Une erreur s\'est produite lors de la connexion' });
    }
});

// Middleware pour vérifier l'authentification
const authenticateUser = (req, res, next) => {
    const token = req.headers.authorization;

    if (!token) {
        return res.status(401).json({ error: 'Token d\'authentification manquant' });
    }

    try {
        const decodedToken = jwt.verify(token, 'votre_clé_secrète');
        req.userData = { userId: decodedToken.userId, role: decodedToken.role };
        next();
    } catch (error) {
        res.status(401).json({ error: 'Token d\'authentification invalide' });
    }
};
// Route pour le tableau de bord de l'administrateur
app.get('/admin/dashboard.html', authenticateUser, async(req, res) => {
    try {
        const { role } = req.userData;

        if (role !== 'admin') {
            return res.status(403).json({ error: 'Accès refusé' });
        }

        // Récupérer les informations nécessaires pour le tableau de bord de l'administrateur
        const servicesQuery = 'SELECT * FROM services;';
        const propositionsQuery = 'SELECT * FROM proposition_modifications;';

        const [servicesResult, propositionsResult] = await Promise.all([
            pool.query(servicesQuery),
            pool.query(propositionsQuery),
        ]);

        const services = servicesResult.rows;
        const propositions = propositionsResult.rows;

        res.status(200).json({ services, propositions });
    } catch (error) {
        res.status(500).json({ error: 'Une erreur s\'est produite lors de la récupération des données' });
    }
});



// Route pour la plateforme de suggestions de l'éditeur
app.post('/suggestions', authenticateUser, async(req, res) => {
    try {
        const { role } = req.userData;

        if (role !== 'editeur') {
            return res.status(403).json({ error: 'Accès refusé' });
        }

        const { id_utilisateur, id_service, table_modifiee, colonne_modifiee, nouvelle_valeur, commentaire } = req.body;

        // Enregistrer la proposition de modification dans la table Propositions
        const query = `
      INSERT INTO proposition_modifications (id_utilisateur, id_service, table_modifiee, colonne_modifiee, nouvelle_valeur, date_proposition, commentaire)
      VALUES ($1, $2, $3, $4, $5, NOW(), $6)
      RETURNING id_proposition;
    `;

        const values = [id_utilisateur, id_service, table_modifiee, colonne_modifiee, nouvelle_valeur, commentaire];
        const result = await pool.query(query, values);

        const propositionId = result.rows[0].id_proposition;

        res.status(201).json({ message: 'Proposition de modification soumise avec succès', propositionId });
    } catch (error) {
        res.status(500).json({ error: 'Une erreur s\'est produite lors de la soumission de la proposition' });
    }
});

// Route d'inscription d'un utilisateur
app.post('/signup', async(req, res) => {
    try {
        const { username, mot_de_passe } = req.body;
        const hashedPassword = await bcrypt.hash(mot_de_passe, 10);

        const query = `
        INSERT INTO utilisateur (username, mot_de_passe, role_utilisateur)
        VALUES ($1, $2, $3)
        RETURNING id_utilisateur;
      `;

        const values = [username, hashedPassword];
        const result = await pool.query(query, values);

        const userId = result.rows[0].id;

        res.status(201).json({ message: 'Utilisateur créé avec succès', userId });
    } catch (error) {
        res.status(500).json({ error: 'Une erreur s\'est produite lors de l\'inscription' });
    }
});



// Exemple de route protégée nécessitant une authentification
app.get('/profile', authenticateUser, async(req, res) => {
    try {
        const { userId } = req.userData;

        const query = `
        SELECT * FROM utilisateurs
        WHERE id_utilisateur = $1;
      `;

        const result = await pool.query(query, [userId]);

        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Utilisateur non trouvé' });
        }

        const user = result.rows[0];

        res.status(200).json({ user });
    } catch (error) {
        res.status(500).json({ error: 'Une erreur s\'est produite lors de la récupération du profil utilisateur' });
    }
});

// Route de déconnexion de l'utilisateur (optionnelle)
app.post('/logout', (req, res) => {
    // Vous pouvez simplement détruire le token ici, car le JWT est auto-expirable
    res.status(200).json({ message: 'Déconnexion réussie' });
});

// Route pour récupérer tous les services avec leurs suggestions de modifications
app.get('/services', authenticateUser, async(req, res) => {
    try {
        const { role } = req.userData;

        if (role !== 'admin') {
            return res.status(403).json({ error: 'Accès refusé' });
        }

        const query = `
        SELECT s.*, p.*
        FROM services s
        LEFT JOIN proposition_modifications p ON s.id_service = p.id_service
        ORDER BY s.id_service;
      `;

        const result = await pool.query(query);

        const services = [];
        let currentService = null;

        for (const row of result.rows) {
            if (row.id_service !== (currentService && currentService.id_service)) {
                currentService = {
                    id_service: row.id_service,
                    nom_service: row.nom_service,
                    propositions: [],
                };
                services.push(currentService);
            }

            if (row.id_proposition) {
                const proposition = {
                    id_proposition: row.id_proposition,
                    table_modifiee: row.table_modifiee,
                    colonne_modifiee: row.colonne_modifiee,
                    nouvelle_valeur: row.nouvelle_valeur,
                    date_proposition: row.date_proposition,
                    commentaire: row.commentaire,
                };
                currentService.propositions.push(proposition);
            }
        }

        res.status(200).json({ services });
    } catch (error) {
        res.status(500).json({ error: 'Une erreur s\'est produite lors de la récupération des services' });
    }
});



// Route pour l'éditeur pour proposer une modification
app.post('/services/:id_service/propositions', authenticateUser, async(req, res) => {
    try {
        const { role, userId } = req.userData;
        const { id_service } = req.params;
        const { table_modifiee, colonne_modifiee, nouvelle_valeur, commentaire } = req.body;

        if (role !== 'editeur') {
            return res.status(403).json({ error: 'Accès refusé' });
        }

        const query = `
        INSERT INTO proposition_modifications (id_utilisateur, id_service, table_modifiee, colonne_modifiee, nouvelle_valeur, date_proposition, commentaire)
        VALUES ($1, $2, $3, $4, $5, CURRENT_TIMESTAMP, $6)
        RETURNING id_proposition;
      `;

        const values = [userId, id_service, table_modifiee, colonne_modifiee, nouvelle_valeur, commentaire];
        const result = await pool.query(query, values);

        const propositionId = result.rows[0].id_proposition;

        res.status(201).json({ message: 'Proposition de modification créée avec succès', propositionId });
    } catch (error) {
        res.status(500).json({ error: 'Une erreur s\'est produite lors de la proposition de modification' });
    }
});

// Route pour l'administrateur pour valider une proposition de modification
app.put('/services/:id_service/propositions/:id_proposition', authenticateUser, async(req, res) => {
    try {
        const { role } = req.userData;
        const { id_service, id_proposition } = req.params;

        if (role !== 'admin') {
            return res.status(403).json({ error: 'Accès refusé' });
        }

        const query = `
        UPDATE proposition_modifications
        SET validee = true
        WHERE id_proposition = $1;
      `;

        await pool.query(query, [id_proposition]);

        // Effectuer la modification dans la base de données en fonction de la proposition

        res.status(200).json({ message: 'Proposition de modification validée avec succès' });
    } catch (error) {
        res.status(500).json({ error: 'Une erreur s\'est produite lors de la validation de la proposition de modification' });
    }
});

// Route pour le tableau de bord de l'administrateur
app.get('/dashboard', authenticateUser, async(req, res) => {
    try {
        const { role } = req.userData;

        if (role !== 'admin') {
            return res.status(403).json({ error: 'Accès refusé' });
        }

        // Récupérer les informations nécessaires pour le tableau de bord de l'administrateur
        // ... votre logique de récupération des données ...

        res.status(200).json({ message: 'Tableau de bord de l\'administrateur' });
    } catch (error) {
        res.status(500).json({ error: 'Une erreur s\'est produite lors de la récupération des données' });
    }
});

// Route pour la plateforme de suggestions de l'éditeur
app.post('/suggestions', authenticateUser, async(req, res) => {
    try {
        const { role } = req.userData;

        if (role !== 'editeur') {
            return res.status(403).json({ error: 'Accès refusé' });
        }

        const { id_utilisateur, id_service, table_modifiee, colonne_modifiee, nouvelle_valeur, commentaire } = req.body;

        // Enregistrer la proposition de modification dans la table Propositions
        // ... votre logique d'enregistrement de la proposition ...

        res.status(201).json({ message: 'Proposition de modification soumise avec succès' });
    } catch (error) {
        res.status(500).json({ error: 'Une erreur s\'est produite lors de la soumission de la proposition' });
    }
});



app.post('/api/login', async(req, res) => {
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

app.route('/api/v1/utilisateurs/count')
    .get((req, res) => {
        const query = 'SELECT COUNT(*) AS userCount FROM utilisateur';

        pool.query(query, (error, results) => {
            if (error) {
                console.error('Error retrieving user count:', error);
                res.status(500).json({ error: 'An error occurred while retrieving user count.' });
            } else {
                const userCount = results.rows[0].usercount;
                res.json({ userCount });
            }
        });
    });

app.route('/api/v1/produits/count')
    .get((req, res) => {
        const query = 'SELECT COUNT(*) AS productCount FROM produit';

        pool.query(query, (error, results) => {
            if (error) {
                console.error('Error retrieving product count:', error);
                res.status(500).json({ error: 'An error occurred while retrieving product count.' });
            } else {
                const productCount = results.rows[0].productcount;
                res.json({ productCount });
            }
        });
    });

app.route('/api/v1/insectes/count')
    .get((req, res) => {
        const query = 'SELECT COUNT(*) AS insecteCount FROM insecte';

        pool.query(query, (error, results) => {
            if (error) {
                console.error('Error retrieving product count:', error);
                res.status(500).json({ error: 'An error occurred while retrieving product count.' });
            } else {
                const insecteCount = results.rows[0].insectecount;
                res.json({ insecteCount });
            }
        });
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
            query = 'SELECT id, image, modele, prix, conditionnement, forme, specialites FROM produit';
            nomTable = 'produit';
        } else if (table === 'insecte') {
            query = 'SELECT * FROM insecte';
            nomTable = 'insecte';
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
            } else if (nomTable === 'insecte') {
                query += `WHERE UPPER(nom) LIKE '%${pattern}%' OR UPPER(famille) LIKE '%${pattern}%'`;
            } else if (nomTable === 'produit') {
                query += ` WHERE forme LIKE '%${pattern}%' OR modele LIKE '%${pattern}%'`;
            } else if (nomTable === 'insecte') {
                query += `WHERE UPPER(nom) LIKE '%${pattern}%' OR UPPER(famille) LIKE '%${pattern}%'`;
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
            const hashedPassword = bcrypt.hash(mot_de_passe, 10);
            const values = [username, hashedPassword, est_admin, est_editeur];
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
        } else if (table === 'insecte') {
            const { nom, image_url, description_insecte, partie1, partie2, famille, diagnostic, id_service } = req.body; //req.body est un objet qui contient les données envoyées avec la requéte POST

            pool.query(
                    'INSERT INTO insecte (nom, image_url,description_insecte, partie1, partie2, famille,diagnostic,id_service) VALUES ($1, $2, $3, $4, $5, $6,$7,$8)', [nom, image_url, description_insecte, partie1, partie2, famille, diagnostic, id_service]
                )
                .then(() => {
                    res.status(201).json({ message: 'création insecte réussi.' });
                })
                .catch(error => {
                    console.error('erreur lors de la creation d insecte:', error);
                    res.status(500).json({ error: 'An error occurred while creating the insect.' });
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
        } else if (nomTable === 'insecte') {

            const id = req.params.id;
            const { nom, image_url, description_insecte, partie1, partie2, famille, diagnostic, id_service } = req.body; //req.body est un objet qui contient les données envoyées avec la requéte POST
            pool.query(
                    'UPDATE insecte SET nom = $1, image_url = $2, description_insecte = $3, partie1 = $4, partie2 = $5, famille = $6,diagnostic = $7,id_service = $8 WHERE id = $9', [nom, image_url, description_insecte, partie1, partie2, famille, diagnostic, id_service, id]
                )
                .then(() => {
                    res.json({ message: `insecte avec id ${id} a été mise à jour` });
                })
                .catch(error => {
                    console.error('erreur de mise à jour insecte', error);
                    res.status(500).json({ error: 'An error occurred while updating the insect.' });
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
        } else if (table === 'insecte') {
            query = 'DELETE FROM insecte WHERE id = $1';
            nomTable = 'insecte';
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

//###################  endpoints Insectes  #################################################

// *********    création des endpoits avec les verbes(get,post,put,delete,putch)   *************


// recuperer un insecte par son identifiant
app.get('/P5_groupe1/API/insecte/:id', (req, res) => {
    const id = req.params.id;

    pool.query('SELECT * FROM insecte WHERE id = $1', [id])
        .then(result => {
            const data = result.rows[0]; // Recuperer la premiere ligne
            res.json(data);
        })
        .catch(error => {
            console.error('Erreur a la recuperation:', error);
            res.status(500).json({ error: 'Une erreur est apparue a la recherche.' });
        });
});


// ajouter un insecte nuisible

app.post('/P5_groupe1/API/ajout_insecte', (req, res) => {
    const { nom, image_url, description_insecte, partie1, partie2, famille, diagnostic, id_service } = req.body; //req.body est un objet qui contient les données envoyées avec la requéte POST

    pool.query(
            'INSERT INTO insecte (nom, image_url,description_insecte, partie1, partie2, famille,diagnostic,id_service) VALUES ($1, $2, $3, $4, $5, $6,$7,$8)', [nom, image_url, description_insecte, partie1, partie2, famille, diagnostic, id_service]
        )
        .then(() => {
            res.status(201).json({ message: 'création insecte réussi.' });
        })
        .catch(error => {
            console.error('erreur lors de la creation d insecte:', error);
            res.status(500).json({ error: 'An error occurred while creating the insect.' });
        });
});


// Mettre à jour d'un insectes
app.put('/P5_groupe1/API/update_insecte/:id', (req, res) => {
    const id = req.params.id;
    const { nom, image_url, description_insecte, partie1, partie2, famille, diagnostic, id_service } = req.body; //req.body est un objet qui contient les données envoyées avec la requéte POST
    pool.query(
            'UPDATE insecte SET nom = $1, image_url = $2, description_insecte = $3, partie1 = $4, partie2 = $5, famille = $6,diagnostic = $7,id_service = $8 WHERE id = $9', [nom, image_url, description_insecte, partie1, partie2, famille, diagnostic, id_service, id]
        )
        .then(() => {
            res.json({ message: `insecte avec id ${id} a été mise à jour` });
        })
        .catch(error => {
            console.error('erreur de mise à jour insecte', error);
            res.status(500).json({ error: 'An error occurred while updating the insect.' });
        });
});


// supprimer un  insecte

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


//################### Fin  endpoints Insectes  #################################################

// Demarrage du serveur
app.listen(port, () => {
    console.log(`Acceder au serveur http://localhost:${port}`);
    console.log(`+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++`);
    console.log(`GET    => Voir utilisateur        http://localhost:${port}/api/v1/utilisateur`);
    console.log(`GET    => Voir les medicaments    http://localhost:${port}/api/v1/medicaments`);
    console.log(`GET    => voir insecte                http://localhost:${port}/api/v1/insecte`);
    console.log(`+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++`);


});
