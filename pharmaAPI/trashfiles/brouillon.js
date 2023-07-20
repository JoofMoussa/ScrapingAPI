// Combined routes for medicament, produitpharma, drugbase, maladies, and utilisateur tables
app.route('/api/v1/:table')
    // GET request for retrieving all records from a table
    .get((req, res) => {
        const table = req.params.table;

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

// The code provided combines the `GET`, `POST`, `PUT`, and `DELETE` routes for the `medicament`, `produitpharma`, `drugbase`, `maladies`, and `utilisateur` tables. Make sure to adjust the table names and column names in the queries to match your specific database schema.

// You can now send different requests to `/api/v1/:table` to perform the desired operations:

// - `GET`: Retrieve all records from a specific table (e.g., `/api/v1/medicament`).
// - `POST`: Create a new record in a specific table (e.g., `/api/v1/medicament`).
// - `PUT`: Update an existing record in a specific table (e.g., `/api/v1/medicament/:id`).
// - `DELETE`: Delete a record from a specific table (e.g., `/api/v1/medicament/:id`).

// Remember to provide the necessary data in the request body for `POST` and `PUT` requests, and include the `id` parameter in the URL for `PUT` and `DELETE` requests.

// Adjust the code further based on your specific requirements and database structure.


const checkboxes = document.querySelectorAll('input[type="checkbox"]');

checkboxes.forEach(checkbox => {
    checkbox.addEventListener('change', () => {
        filterCategories();
    });
});

function filterCategories() {
    const selectedCategories = Array.from(checkboxes)
        .filter(checkbox => checkbox.checked)
        .map(checkbox => checkbox.id.replace('Checkbox', ''));
    //trim pour enlever les caracteres speciaux
    const url = `/api/v1/produit?pattern=${encodeURIComponent(selectedCategories.trim())}`;
    console.log(url);
    fetch(url)
        .then(response => response.json())
        .then(responseData => {
            // Handle the response data and update the UI accordingly
            //console.log(data); // Example: Log the filtered data to the console
            data = responseData['data'];
            // Traitement des données de réponse
            console.log(data); // Affiche les données dans la console
            displayData(currentPage);
            createPagination();
        })
        .catch(error => {
            console.error('Error retrieving filtered produit data:', error);
            // Handle error and show error message to the user
        });
}


//espace inscription
document.getElementById('inscription').addEventListener('submit', function(event) {
    event.preventDefault(); // bloquer l envoi du formulaire

    var username = document.getElementById('username').value;
    var password = document.getElementById('password').value;
    var confirmPassword = document.getElementById('confirmPassword').value;

    if (password !== confirmPassword) {
        alert('Les mots de passes sont differents');
    } else {
        var userdata = {
            username: username,
            mot_de_passe: password
        };
        console.log(userdata);

        // Envoie des donnees a la route inscription
        fetch('/api/v1/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(userdata)
            })
            .then(function(response) {
                if (response.ok) {
                    return response.json();
                } else {
                    throw new Error("Desole il y'a une erreur");
                }
            })
            .catch(function(error) {
                console.error(error);
            });
    }
});

// Assuming you have a button element with id "loginButton"
const loginButton = document.getElementById('loginButton');

// Add an event listener to the login button
loginButton.addEventListener('click', () => {
    // Get the username and password from user input
    const username = document.getElementById('usernameInput').value;
    const password = document.getElementById('passwordInput').value;

    // Create an object with the login credentials
    const loginData = {
        username: username,
        mot_de_passe: password
    };

    // Make a POST request to the login route
    fetch('/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(loginData)
        })
        .then(response => {
            if (response.ok) {
                // Redirect to the appropriate page based on the response URL
                window.location.href = response.url;
            } else {
                // Handle login error
                console.error('Login failed:', response.statusText);
            }
        })
        .catch(error => {
            console.error('Login failed:', error);
        });
});
// Assuming you have a dropdown button element with id "userDropdown"
const userDropdown = document.getElementById('userDropdown');

// Check if the user is logged in (you can use your own logic here)
const isLoggedIn = true; // Set to true if the user is logged in

if (isLoggedIn) {
    // Change the dropdown button text to "Profile"
    userDropdown.textContent = 'Profile';

    // Show the dropdown menu
    userDropdown.classList.add('dropdown-toggle');

    // Add event listener to the logout button
    const logoutButton = document.getElementById('logoutButton');
    logoutButton.addEventListener('click', () => {
        // Make a POST request to the logout route
        fetch('/logout', {
                method: 'POST'
            })
            .then(response => {
                if (response.ok) {
                    // Redirect to the login page or homepage after successful logout
                    window.location.href = '/login';
                } else {
                    // Handle logout error
                    console.error('Logout failed:', response.statusText);
                }
            })
            .catch(error => {
                console.error('Logout failed:', error);
            });
    });
}

// Handle the POST request to create a new user
app.post('/api/v1/login', (req, res) => {
    // Retrieve the form data from the request body
    const { username, password } = req.body;

    // Define the SQL query to insert a new user
    const query = 'INSERT INTO users (username, password) VALUES ($1, $2) RETURNING *';
    const values = [username, password, role];

    // Execute the query
    pool.query(query, values)
        .then((result) => {
            const user = result.rows[0];
            console.log('User created:', user);
            res.status(200).json({ message: 'User created successfully' });
        })
        .catch((error) => {
            console.error('Error creating user:', error);
            res.status(500).json({ error: 'An error occurred while creating the user' });
        });
});


// Handle the POST request to create a new user
app.post('/api/v1/signup', (req, res) => {
    // Retrieve the form data from the request body
    const { username, password } = req.body;

    // Define the SQL query to insert a new user
    const query = 'INSERT INTO utilisateur (username, mot_de_passe) VALUES ($1, $2) RETURNING *';
    const values = [username, password];

    // Execute the query
    pool.query(query, values)
        .then((result) => {
            const user = result.rows[0];
            console.log('User created:', user);
            res.status(200).json({ message: 'User created successfully' });
        })
        .catch((error) => {
            console.error('Error creating user:', error);
            res.status(500).json({ error: 'An error occurred while creating the user' });
        });
});


// Connection Utilisateur
app.post('/api/v1/login', (req, res) => {
    const { username, password } = req.body;
    pool.query('SELECT * FROM utilisateur WHERE username = $1 AND mot_de_passe = $2', [username, password], (error, results) => {
        if (error) {
            console.error('Erreur d execution de la requete:', error);
            res.status(500).json({ error: 'Erreur durant la connexion login' });
        } else {
            if (results.rows.length === 0) {
                res.status(401).json({ error: 'Nom utilisateur ou mot de passe invalide' });
            } else {
                const user = results.rows[0];
                const userId = user.id;
                const userName = user.nom;
                const isAdmin = user.est_admin;
                const isEditor = user.est_editeur;

                if (isAdmin) {
                    // Redirection => admin dashboard
                    res.redirect('/dashboard.html');
                } else if (isEditor) {
                    // Redirection => editeur template
                    res.render('/index.html', { isEditor, userName });
                } else {
                    // Redirection => visiteur template
                    res.render('/index.html', { userName });
                }
            }
        }
    });
});



app.post('api/v1/login', (req, res) => {
    const { username, mot_de_passe, role } = req.body;

    pool.query('SELECT * FROM utilisateur WHERE username = $1 AND mot_de_passe = $2', [username, mot_de_passe])
        .then(result => {
            const user = result.rows[0];

            if (!user) {
                // User not found
                return res.status(401).json({ error: 'Nom d utilisateur ou mot de passe incorrecte.' });
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


app.post('/api/v1/login', (req, res) => {
    // Retrieve the form data from the request body
    const { username, mot_de_passe, est_admin, est_editeur } = req.body;

    // Define the SQL query to insert a new user
    const query = 'INSERT INTO utilisateur (username, mot_de_passe, est_admin, est_editeur) VALUES ($1, $2, $3, $4) RETURNING *';
    const values = [username, mot_de_passe, est_admin, est_editeur];

    // Execute the query
    pool.query(query, values)
        .then((result) => {
            const user = result.rows[0];
            console.log('User created:', user);
            res.status(200).json({ message: 'Utilisateur cree avec succes' });
        })
        .catch((error) => {
            console.error('Error creating user:', error);
            res.status(500).json({ error: 'An error occurred while creating the user' });
        });
});


<!-- var lpcontent = document.createElement('div');
lpcontent.className = 'col-sm-3 space_left';
var secondcontent = document.createElement('div');
secondcontent.className = 'shop_1r1i text-center clearfix text-danger';
secondcontent.textContent = drug['nom_standard'];
lpcontent.appendChild(secondcontent);
linkedprod.appendChild(lpcontent); -->


document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('inscriptionClient');

    form.addEventListener('submit', (event) => {
        event.preventDefault(); // Prevent form from being submitted normally

        const username = document.getElementById('user_insc').value.trim();
        const mot_de_passe = document.getElementById('passw_insc').value.trim();
        const confirmPassword = document.getElementById('confirmPassword').value.trim();
        const est_admin = false;
        const est_editeur = false;
        console.log(mot_de_passe);
        console.log(confirmPassword);

        // Check if passwords match
        // if (password !== confirmPassword) {
        //    console.log("Les mots de passes sont differents");
        //    return;
        //}

        const formData = {
            username: username,
            mot_de_passe: mot_de_passe,
            est_admin: est_admin,
            est_editeur: est_editeur
        };

        // Send an HTTP POST request to the server
        fetch('/api/v1/utilisateur', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(formData)
            })
            .then(response => response.json())
            .then(data => {
                console.log('Utilisateur Cree:', data);
                // Optionally, perform any additional actions such as showing a success message or redirecting to another page
            })
            .catch(error => {
                console.error('Erreur de creation de L utilisateur:', error);
                // Optionally, display an error message to the user
            });
    });
});


app.post('/api/v1/login', (req, res) => {
    const { username, password } = req.body;

    pool.query('SELECT * FROM utilisateur WHERE username = $1 AND mot_de_passe = $2', [username, password], (error, results) => {
        if (error) {
            console.error('Error executing SQL query:', error);
            res.status(500).json({ error: 'An error occurred during login' });
        } else {
            if (results.rows.length === 0) {
                res.status(401).json({ error: 'Invalid username or password' });
            } else {
                const user = results.rows[0];
                const admin = user.est_admin; // Assuming the user has a "role" column in the database
                const editeur = user.est_editeur;
                res.status(200).json({ admin: admin, editeur: editeur }); // Send the role information in the response
            }
        }
    });
});





document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('loginForm');

    loginForm.addEventListener('submit', (event) => {
        event.preventDefault();

        const username = document.getElementById('username').value;
        const password = document.getElementById('password').value;
        const role = document.getElementById('role').value;

        const formData = {
            username: username,
            password: password,
            role: role
        };

        console.log(formData);
        // Send a POST request to the server
        fetch('/api/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(formData)
            })
            .then(response => {
                if (response.ok) {
                    return response.json();
                } else {
                    throw new Error('connection echouee');
                }
            })
            .catch(error => {
                console.error('Echec connexion:', error);
                alert('connection echouee. Reesayer!!!');
            });
    });
});


document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('loginForm');

    loginForm.addEventListener('submit', (event) => {
        event.preventDefault();

        const username = document.getElementById('username').value;
        const password = document.getElementById('password').value;
        const role = document.getElementById('role').value;

        const formData = {
            username: username,
            password: password,
            role: role
        };

        console.log(formData);
        // Send a POST request to the server
        fetch('/api/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(formData)
            })
            .then(response => {
                if (response.ok) {
                    return response.json();
                } else {
                    throw new Error('connection echouee');
                }
            })
            .then(data => {
                // Perform redirect using JavaScript
                window.location.href = data.redirectUrl;
            })
            .catch(error => {
                console.error('Echec connexion:', error);
                alert('connection echouee. Reesayer!!!');
            });
    });
});


document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('loginForm');

    loginForm.addEventListener('submit', (event) => {
        event.preventDefault();

        const username = document.getElementById('username').value;
        const password = document.getElementById('password').value;
        const role = document.getElementById('role').value;

        const formData = {
            username: username,
            password: password,
            role: role
        };

        console.log(formData);
        // Send a POST request to the server
        fetch('/api/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(formData)
            })
            .then(response => {
                if (response.ok) {
                    return response.json();
                } else {
                    throw new Error('connection echouee');
                }
            })
            .then(data => {
                // Store the username in local storage
                localStorage.setItem('username', data.username);
                if (data.est_admin) {
                    // Perform redirect using JavaScript
                    window.location.href = '/admin/dashboard.html';
                } else if (data.est_admin === false & data.est_editeur === true) {
                    window.location.href = '/index.html?suggestion=true';
                } else {
                    window.location.href = '/index.html';
                }

            })
            .catch(error => {
                console.error('Echec connexion:', error);
                alert('connection echouee. Reesayer!!!');
            });
    });
});


document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('loginForm');

    loginForm.addEventListener('submit', (event) => {
        event.preventDefault();

        const username = document.getElementById('username').value;
        const password = document.getElementById('password').value;
        //const role = document.getElementById('role').value;

        const formData = {
            username: username,
            password: password
                // role: role
        };

        console.log(formData);
        // Send a POST request to the server
        fetch('/api/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(formData)
            })
            .then(response => {
                if (response.ok) {
                    return response.json();
                } else {
                    throw new Error('connection echouee');
                }
            })
            .then(data => {
                if (data.role === 'admin') {
                    // Redirect admin to dashboard.html
                    window.location.href = '/admin/dashboard.html';
                } else if (data.role === 'editor') {
                    // Redirect editor to index.html with suggest option
                    window.location.href = '/index.html?suggest=true';
                } else {
                    // Redirect visitor to index.html
                    window.location.href = '/index.html';
                }
            })
            .catch(error => {
                console.error('Echec connexion:', error);
                alert('connection echouee. Reesayer!!!');
            });
    });
});


<
script >
    // Appeler l'API route pour récupérer les données
    fetch('/api/v1/produit')
    .then(response => response.json())
    .then(data => {
        // Extraire les données de la colonne "forme" uniquement
        const formeData = data.data.map(item => item.forme);

        // Compter le nombre d'occurrences de chaque forme
        const formeCounts = formeData.reduce((counts, forme) => {
            counts[forme] = (counts[forme] || 0) + 1;
            return counts;
        }, {});

        // Trier les formes en fonction du nombre d'occurrences (du plus grand au plus petit)
        const sortedFormes = Object.keys(formeCounts).sort((a, b) => formeCounts[b] - formeCounts[a]);

        // Sélectionner les cinq formes les plus représentatives
        const top5Formes = sortedFormes.slice(0, 5);

        // Convertir les données en un tableau d'objets pour D3.js
        const pieData = top5Formes.map(forme => ({
            label: forme,
            value: formeCounts[forme],
        }));

        // Créer le Pie Chart
        const pie = d3.pie().value(d => d.value);

        const arc = d3.arc().innerRadius(0).outerRadius(200);

        const color = d3.scaleOrdinal(d3.schemeCategory10);

        const svg = d3.select("#chart-container")
            .append("svg")
            .attr("width", 500)
            .attr("height", 500)
            .append("g")
            .attr("transform", "translate(200,200)");

        const arcs = svg.selectAll("arc")
            .data(pie(pieData))
            .enter()
            .append("g");

        arcs.append("path")
            .attr("d", arc)
            .attr("fill", (d, i) => color(i));

        arcs.append("text")
            .attr("transform", d => "translate(" + arc.centroid(d) + ")")
            .attr("text-anchor", "middle")
            .text(d => d.data.label);
    })
    .catch(error => console.error('Erreur lors de la récupération des données:', error)); <
/script>