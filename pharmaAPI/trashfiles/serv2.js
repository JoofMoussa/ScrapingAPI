app.post('/login', (req, res) => {
    const { username, mot_de_passe } = req.body;

    pool.query('SELECT * FROM utilisateur WHERE username = $1 AND mot_de_passe = $2', [username, mot_de_passe])
        .then(result => {
            const user = result.rows[0];

            if (!user) {
                // User not found
                return res.status(401).json({ error: 'Invalid username or password.' });
            }

            // Check user role and redirect accordingly
            if (user.est_admin) {
                // Redirect admin to dashboard.html
                return res.redirect('/dashboard.html');
            } else if (user.est_editeur) {
                // Redirect editor to index.html with suggest option
                return res.redirect('/index.html?suggest=true');
            } else {
                // Redirect visitor to index.html
                return res.redirect('/index.html');
            }
        })
        .catch(error => {
            console.error('Error during login:', error);
            res.status(500).json({ error: 'An error occurred during login.' });
        });
});


app.route('/api/v1/:table')
    // GET request for retrieving all records from a table or pattern search
    .get((req, res) => {
        const table = req.params.table;
        const pattern = req.query.pattern; // Pattern for search

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

        // Add pattern search if provided
        if (pattern) {
            if (nomTable === 'utilisateur') {
                query += ` WHERE username LIKE '%${pattern}%' OR mot_de_passe LIKE '%${pattern}%'`;
            } else if (nomTable === 'maladie') {
                query += ` WHERE prescript LIKE '%${pattern}%' OR nom LIKE '%${pattern}%' OR description LIKE '%${pattern}%'`;
            } else if (nomTable === 'drugbase') {
                query += ` WHERE nom_generique LIKE '%${pattern}%' OR nom_standard LIKE '%${pattern}%'`;
            } else if (nomTable === 'medicament') {
                query += ` WHERE nom_generique LIKE '%${pattern}%' OR nom_standard LIKE '%${pattern}%'`;
            } else if (nomTable === 'produit') {
                query += ` WHERE code LIKE '%${pattern}%' OR modele LIKE '%${pattern}%'`;
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