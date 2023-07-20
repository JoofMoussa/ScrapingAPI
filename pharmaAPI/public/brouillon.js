if (line == 4) {
    cardby4.appendChild(cardColumn);
    resultContainer.appendChild(cardby4);
    line = 0;
} else {
    resultContainer.appendChild(cardColumn);
}

fetch('/medicaments')
    .then(function(response) {
        if (response.ok) {
            return response.json();
        } else {
            throw new Error('An error occurred');
        }
    })
    .then(function(responseData) {
        data = responseData;
        voirCategorie();
    })
    .catch(function(error) {
        console.error(error);
    });

function voirCategorie() {
    var catContainer = document.getElementById('cat-produits');
    data_cat.forEach(function(item) {
        var id = item.id;
        var idtypemed = item.idtypemed;
        var categorie = item.categorie;
    })
}