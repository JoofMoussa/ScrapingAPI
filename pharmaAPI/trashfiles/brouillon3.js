// //  Voir tout

// app.get('/medicament', (req, res) => {
//     // Recuperer tout les donnees de la table "medicament"
//     pool.query('SELECT * FROM medicament', (error, results) => {
//         if (error) {
//             console.error('Error retrieving data:', error);
//             res.status(500).json({ error: 'Erreur lors de la recherche de medicaments.' });
//         } else {
//             const data = results.rows.map(row => {
//                 const { id, categorie } = row;
//                 return { id, categorie };
//             });
//             res.json(data);
//         }
//     });
// });


// // recuperer tout les  medicaments
// app.get('/produit', (req, res) => {
//     // Executer la requete SQL pour recuperer tout les lignes de la table "medicament"
//     pool.query('SELECT * FROM produit', (error, results) => {
//         if (error) {
//             console.error('Erreur a la recuperation:', error);
//             res.status(500).json({ error: 'Une erreur est apparue a la recherche .' });
//         } else {
//             const data = results.rows.map(row => {
//                 const { id, code, modele, image, prix, conditionnement, forme, specialites } = row;
//                 return { id, code, modele, image, prix, conditionnement, forme, specialites };
//             });
//             res.json(data);
//         }
//     });
// });

// // recuperer tout les  medicaments de la base de donnees globales
// app.get('/drugbase', (req, res) => {
//     pool.query('SELECT * FROM drugbase', (error, results) => {
//         if (error) {
//             console.error('Erreur a la recuperation:', error);
//             res.status(500).json({ error: 'Une erreur est apparue a la recherche medicaments.' });
//         } else {
//             res.json(results.rows);
//         }
//     });
// });


// // recuperer tout les  utilisateurs
// app.get('/utilisateur', (req, res) => {
//     pool.query('SELECT * FROM utilisateur', (error, results) => {
//         if (error) {
//             console.error('Erreur a la recuperation:', error);
//             res.status(500).json({ error: 'Une erreur est apparue a la recherche medicaments.' });
//         } else {
//             res.json(results.rows);
//         }
//     });
// });


// // recuperer tout les  medicaments de la base de donnees globales
// app.get('/maladies', (req, res) => {
//     pool.query('SELECT * FROM maladie', (error, results) => {
//         if (error) {
//             console.error('Erreur a la recuperations:', error);
//             res.status(500).json({ error: 'Une erreur est apparue a la recherche .' });
//         } else {
//             res.json(results.rows);
//         }
//     });
// });

// recuperer tout les utilisateurs par ID
// app.get('/api/v1/utilisateur/:id', (req, res) => {
//     const id = req.params.id;

//     pool.query('SELECT * FROM utilisateur WHERE id = $1', [id])
//         .then(result => {
//             const data = result.rows[0]; // Recuperer la premiere ligne
//             res.json(data);
//         })
//         .catch(error => {
//             console.error('Erreur a la recuperation:', error);
//             res.status(500).json({ error: 'Une erreur est apparue a la recherche.' });
//         });
// });


// // recuperer tout les medicament par ID
// app.get('/api/v1/medicament/:id', (req, res) => {
//     const id = req.params.id;

//     pool.query('SELECT * FROM medicament WHERE id = $1', [id])
//         .then(result => {
//             const data = result.rows[0]; // Recuperer la premiere ligne
//             res.json(data);
//         })
//         .catch(error => {
//             console.error('Erreur a la recuperation:', error);
//             res.status(500).json({ error: 'Une erreur est apparue a la recherche the medicament.' });
//         });
// });

// // recuperer tout les produit par ID
// app.get('/api/v1/produitpharma/:id', (req, res) => {
//     const id = req.params.id;

//     pool.query('SELECT * FROM produit WHERE id = $1', [id])
//         .then(result => {
//             const data = result.rows[0]; // Recuperer la premiere ligne
//             res.json(data);
//         })
//         .catch(error => {
//             console.error('Erreur a la recuperation:', error);
//             res.status(500).json({ error: 'Une erreur est apparue a la recherche the medicament.' });
//         });
// });

// // recuperer tout les medicaments de la base de donnees centrales par ID
// app.get('/api/v1/drugbase/:id', (req, res) => {
//     const id = req.params.id;

//     pool.query('SELECT * FROM drugbase WHERE id = $1', [id])
//         .then(result => {
//             const data = result.rows[0]; // Recuperer la premiere ligne
//             res.json(data);
//         })
//         .catch(error => {
//             console.error('Erreur a la recuperation:', error);
//             res.status(500).json({ error: 'Une erreur est apparue a la recherche ' });
//         });
// });

// app.get('/api/v1/maladies/:id', (req, res) => {
//     const id = req.params.id;

//     pool.query('SELECT * FROM maladie WHERE id = $1', [id])
//         .then(result => {
//             const data = result.rows[0]; // Recuperer la premiere ligne
//             res.json(data);
//         })
//         .catch(error => {
//             console.error('Erreur a la recuperation:', error);
//             res.status(500).json({ error: 'Une erreur est apparue a la recherche.' });
//         });
// });



// app.post('/api/v2/utilisateur/', (req, res) => {
//     const { username, mot_de_passe } = req.body;

//     pool.query(
//             'INSERT INTO utilisateur (username, mot_de_passe) VALUES ($1, $2)', [username, mot_de_passe]
//         )
//         .then(() => {
//             res.status(201).json({ message: 'Utilisateur créé avec succès.' });
//         })
//         .catch(error => {
//             console.error('Erreur lors de l enregistrement de l utilisateur:', error);
//             res.status(500).json({ error: 'Erreur lors de l enregistrement de l utilisateur.' });
//         });
// });




// Creer un medicament
// app.post('/api/v2/medicament', (req, res) => {
//     const { nom_generique, nom_standard, force, expiration, entreprise, date_production } = req.body;

//     pool.query(
//             'INSERT INTO medicament (nom_generique, nom_standard, force, expiration, entreprise, date_production) VALUES ($1, $2, $3, $4, $5, $6)', [nom_generique, nom_standard, force, expiration, entreprise, date_production]
//         )
//         .then(() => {
//             res.status(201).json({ message: 'Medicament created successfully.' });
//         })
//         .catch(error => {
//             console.error('Error creating medicament:', error);
//             res.status(500).json({ error: 'An error occurred while creating the medicament.' });
//         });
// });


// // Mis a jour des medicaments
// app.put('/api/v3/medicament/:id', (req, res) => {
//     const id = req.params.id;
//     const { nom_generique, nom_standard, force, expiration, entreprise, date_production } = req.body;

//     pool.query(
//             'UPDATE medicament SET nom_generique = $1, nom_standard = $2, force = $3, expiration = $4, entreprise = $5, date_production = $6 WHERE id = $7', [nom_generique, nom_standard, force, expiration, entreprise, date_production, id]
//         )
//         .then(() => {
//             res.json({ message: `Medicament with ID ${id} updated successfully.` });
//         })
//         .catch(error => {
//             console.error('Error updating medicament:', error);
//             res.status(500).json({ error: 'An error occurred while updating the medicament.' });
//         });
// });
// Update a medicament
// app.put('/api/v3/medicament/:id', (req, res) => {
//     const id = req.params.id;
//     const { nom_generique, nom_standard, force, expiration, entreprise, date_production } = req.body;

//     pool.query(
//         'UPDATE medicament SET nom_generique = $1, nom_standard = $2, force = $3, expiration = $4, entreprise = $5, date_production = $6 WHERE id = $7',
//         [nom_generique, nom_standard, force, expiration, entreprise, date_production, id]
//     )
//     .then(() => {
//         res.json({ message: `Medicament with ID ${id} updated successfully.` });
//     })
//     .catch(error => {
//         console.error('Error updating medicament:', error);
//         res.status(500).json({ error: 'An error occurred while updating the medicament.' });
//     });
// });

// // Update a produit
// app.put('/api/v3/produit/:id', (req, res) => {
//     const id = req.params.id;
//     const { code, modele, image, prix, conditionnement, forme, specialites, refid } = req.body;

//     pool.query(
//         'UPDATE produit SET code = $1, modele = $2, image = $3, prix = $4, conditionnement = $5, forme = $6, specialites = $7, refid = $8 WHERE id = $9',
//         [code, modele, image, prix, conditionnement, forme, specialites, refid, id]
//     )
//     .then(() => {
//         res.json({ message: `Produit with ID ${id} updated successfully.` });
//     })
//     .catch(error => {
//         console.error('Error updating produit:', error);
//         res.status(500).json({ error: 'An error occurred while updating the produit.' });
//     });
// });

// // Update a drugbase
// app.put('/api/v3/drugbase/:id', (req, res) => {
//     const id = req.params.id;
//     const { field1, field2, field3, field4, field5 } = req.body;

//     pool.query(
//         'UPDATE drugbase SET field1 = $1, field2 = $2, field3 = $3, field4 = $4, field5 = $5 WHERE id = $6',
//         [field1, field2, field3, field4, field5, id]
//     )
//     .then(() => {
//         res.json({ message: `Drugbase with ID ${id} updated successfully.` });
//     })
//     .catch(error => {
//         console.error('Error updating drugbase:', error);
//         res.status(500).json({ error: 'An error occurred while updating the drugbase.' });
//     });
// });

// // Update a maladies
// app.put('/api/v3/maladies/:id', (req, res) => {
//     const id = req.params.id;
//     const { field1, field2, field3, field4, field5 } = req.body;

//     pool.query(
//         'UPDATE maladies SET field1 = $1, field2 = $2, field3 = $3, field4 = $4, field5 = $5 WHERE id = $6',
//         [field1, field2, field3, field4, field5, id]
//     )
//     .then(() => {
//         res.json({ message: `Maladies with ID ${id} updated successfully.` });
//     })
//     .catch(error => {
//         console.error('Error updating maladies:', error);
//         res.status(500).json({ error: 'An error occurred while updating the maladies.' });
//     });
// });



// Effacer un  medicament
// app.delete('/api/v4/medicament/:id', (req, res) => {
//     const id = req.params.id;

//     pool.query('DELETE FROM medicament WHERE id = $1', [id])
//         .then(() => {
//             res.json({ message: `Medicament avec l 'identifiant ${id} effacer avec success.` });
//         })
//         .catch(error => {
//             console.error('Error deleting medicament:', error);
//             res.status(500).json({ error: 'An error occurred while deleting the medicament.' });
//         });
// });

// // Effacer tout les  medicaments
// app.delete('/api/v4/medicament', (req, res) => {
//     pool.query('DELETE FROM medicament')
//         .then(() => {
//             res.json({ message: 'Tout les medicaments effaces avec succes.' });
//         })
//         .catch(error => {
//             console.error('Error deleting medicaments:', error);
//             res.status(500).json({ error: 'An error occurred while deleting the medicaments.' });
//         });
// });