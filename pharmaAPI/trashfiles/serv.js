app.route('/api/v1/:table')
    // GET request for retrieving all records from a table or pattern search
    .get((req, res) => {
        const table = req.params.table;
        const search = req.query.search;

        let query = '';
        let nomTable = '';

        if (table === 'medicament') {
            query = 'SELECT * FROM medicament';
            nomTable = 'medicament';
        } else if (table === 'produitpharma') {
            query = 'SELECT * FROM produit';
            nomTable = 'produit';
        } else if (table === 'drugbase') {
            query = 'SELECT * FROM drugbase';
            nomTable = 'drugbase';
        } else if (table === 'maladies') {
            query = 'SELECT * FROM maladies';
            nomTable = 'maladies';
        } else if (table === 'utilisateur') {
            query = 'SELECT * FROM utilisateur';
            nomTable = 'utilisateur';
        } else {
            return res.status(404).json({ error: 'Table not found.' });
        }

        if (search) {
            const fields = ['nom_generique', 'nom_standard'];
            const conditions = fields.map(field => `${field} LIKE '%${search}%'`);
            query += ` WHERE ${conditions.join(' OR ')}`;
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
    // POST request for creating a new record in a table
    .post((req, res) => {
        const table = req.params.table;
        const data = req.body;

        let query = '';
        let nomTable = '';

        if (table === 'medicament') {
            query = 'INSERT INTO medicament (nom_generique, nom_standard, force, expiration, entreprise, date_production) VALUES ($1, $2, $3, $4, $5, $6)';
            nomTable = 'medicament';
        } else if (table === 'produitpharma') {
            query = 'INSERT INTO produit (code, modele, image, prix, conditionnement, forme, specialites, refid) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)';
            nomTable = 'produit';
        } else if (table === 'drugbase') {
            query = 'INSERT INTO drugbase (field1, field2, field3, field4, field5) VALUES ($1, $2, $3, $4, $5)';
            nomTable = 'drugbase';
        } else if (table === 'maladies') {
            query = 'INSERT INTO maladies (field1, field2, field3, field4, field5) VALUES ($1, $2, $3, $4, $5)';
            nomTable = 'maladies';
        } else if (table === 'utilisateur') {
            query = 'INSERT INTO utilisateur (username, mot_de_passe) VALUES ($1, $2)';
            nomTable = 'utilisateur';
        } else {
            return res.status(404).json({ error: 'Table not found.' });
        }

        const values = Object.values(data);

        pool.query(query, values)
            .then(() => {
                res.status(201).json({ message: `${nomTable} created successfully.` });
            })
            .catch(error => {
                console.error(`Error creating ${nomTable}:`, error);
                res.status(500).json({ error: `An error occurred while creating the ${nomTable}.` });
            });
    })
    // PUT request for updating a record in a table
    .put((req, res) => {
        const table = req.params.table;
        const id = req.query.id;
        const data = req.body;

        let query = '';
        let nomTable = '';

        if (table === 'medicament') {
            query = 'UPDATE medicament SET nom_generique = $1, nom_standard = $2, force = $3, expiration = $4, entreprise = $5, date_production = $6 WHERE id = $7';
            nomTable = 'medicament';
        } else if (table === 'produitpharma') {
            query = 'UPDATE produit SET code = $1, modele = $2, image = $3, prix = $4, conditionnement = $5, forme = $6, specialites = $7, refid = $8 WHERE id = $9';
            nomTable = 'produit';
        } else if (table === 'drugbase') {
            query = 'UPDATE drugbase SET field1 = $1, field2 = $2, field3 = $3, field4 = $4, field5 = $5 WHERE id = $6';
            nomTable = 'drugbase';
        } else if (table === 'maladies') {
            query = 'UPDATE maladies SET field1 = $1, field2 = $2, field3 = $3, field4 = $4, field5 = $5 WHERE id = $6';
            nomTable = 'maladies';
        } else if (table === 'utilisateur') {
            query = 'UPDATE utilisateur SET username = $1, mot_de_passe = $2 WHERE id = $3';
            nomTable = 'utilisateur';
        } else {
            return res.status(404).json({ error: 'Table not found.' });
        }

        const values = [...Object.values(data), id];

        pool.query(query, values)
            .then(() => {
                res.json({ message: `${nomTable} with ID ${id} updated successfully.` });
            })
            .catch(error => {
                console.error(`Error updating ${nomTable}:`, error);
                res.status(500).json({ error: `An error occurred while updating the ${nomTable}.` });
            });
    })
    // DELETE request for deleting a record from a table
    .delete((req, res) => {
        const table = req.params.table;
        const id = req.query.id;

        let query = '';
        let nomTable = '';

        if (table === 'medicament') {
            query = 'DELETE FROM medicament WHERE id = $1';
            nomTable = 'medicament';
        } else if (table === 'produitpharma') {
            query = 'DELETE FROM produit WHERE id = $1';
            nomTable = 'produit';
        } else if (table === 'drugbase') {
            query = 'DELETE FROM drugbase WHERE id = $1';
            nomTable = 'drugbase';
        } else if (table === 'maladies') {
            query = 'DELETE FROM maladies WHERE id = $1';
            nomTable = 'maladies';
        } else if (table === 'utilisateur') {
            query = 'DELETE FROM utilisateur WHERE id = $1';
            nomTable = 'utilisateur';
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