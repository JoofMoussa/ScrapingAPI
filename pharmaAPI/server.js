const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");

const app = express();

var corsOptions = {
    origin: "http://localhost:8081"
};

app.use(cors(corsOptions));

app.use(express.json());

app.use(express.urlencoded({ extended: true }));

// route simple
app.get("/", (req, res) => {
    res.json({ message: "Bienvenue dans l'API De Gestion de pharmacie." });
});

// parametrer le port pour les requetes
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
    // afficher un message pour acceder au serveur
    console.log(`Acceder au serveur http://localhost:${PORT}/`);
});