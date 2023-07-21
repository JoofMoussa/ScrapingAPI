// ++++++++++++++++++++++++  espace de connection des diffferents utilisateurs  ++++++++++++++++++++++++
// connection aux differents interfaces
document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('loginForm');

    loginForm.addEventListener('submit', (event) => {
        event.preventDefault();

        const username = document.getElementById('username').value;
        const password = document.getElementById('password').value;

        const formData = {
            username: username,
            password: password
        };

        console.log(formData);
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
                    // Redirection admin => dashboard.html
                    window.location.href = '/admin/dashboard.html';
                } else if (data.role === 'editor') {
                    // Redirect visiteur => index.html
                    window.location.href = '/editeur/index.html?username=' + formData['username'];
                } else {
                    // Redirect visiteur => index.html
                    window.location.href = '/visiteur/index.html?username=' + formData['username'];
                }
            })
            .catch(error => {
                console.error('Echec connexion:', error);
                alert('connection echouee. Reesayer!!!');
            });
    });
});

// ++++++++++++++++++++++++     espace d inscription de l utilisateur +++++++++++++++++++++++++++++
//espace inscription
document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('inscriptionClient');

    form.addEventListener('submit', (event) => {
        event.preventDefault(); // Prevent form from being submitted normally

        const username = document.getElementById('user_insc').value;
        const mot_de_passe = document.getElementById('passw_insc').value;
        const confirmPassword = document.getElementById('confirmPassword').value;
        const est_admin = false; // Set est_admin to true for admin user
        const est_editeur = false;
        console.log(mot_de_passe);
        console.log(confirmPassword);

        // Voir si les mots de passes sont coherents
        if (mot_de_passe != confirmPassword) {
            alert("Les mots de passe sont différents");
            return;
        }

        const formData = {
            username: username,
            mot_de_passe: mot_de_passe,
            est_admin: est_admin,
            est_editeur: est_editeur
        };

        fetch('/api/v1/utilisateur', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(formData)
            })
            .then(response => response.json())
            .then(data => {
                console.log('Utilisateur créé:', data);
                window.location.href = '/visiteur/index.html?username=' + formData['username'];

            })
            .catch(error => {
                console.error('Erreur de création de l\'utilisateur:', error);
            });
    });
});