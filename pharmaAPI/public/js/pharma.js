//Tri par defaut
fetch('/api/v1/formeproduitpharma')
    .then(function(response) {
        if (response.ok) {
            return response.json();
        } else {
            throw new Error('An error occurred');
        }
    })
    .then(function(responseData) {
        toutformes = responseData;
        addForme();
    })
    .catch(function(error) {
        console.error(error);
    });

function addForme() {
    var selectContent = document.getElementById('subject');
    selectContent.innerHTML = '';
    toutformes.forEach(function(formedata) {
        var formevalue = formedata.forme;
        var opts = document.createElement('option');
        opts.textContent = formevalue;
        opts.value = formevalue;
        selectContent.appendChild(opts);
    });

}
//Fin Tri par defaut




fetch('/api/v1/produit')
    .then(function(response) {
        if (response.ok) {
            return response.json();
        } else {
            throw new Error('An error occurred');
        }
    })
    .then(function(responseData) {
        data = responseData['data'];
        displayData(currentPage);
        createPagination();
    })
    .catch(function(error) {
        console.error(error);
    });

document.getElementById('rechercheProduit').addEventListener('submit', function(event) {
    event.preventDefault(); // Empêche la soumission du formulaire par défaut

    var myParam = document.getElementById('nomprod').value.toUpperCase(); // Récupère la valeur du paramètre de chaîne
    console.log(myParam);
    // Effectue la requête Fetch
    fetch('api/v1/produit?pattern=' + encodeURIComponent(myParam))
        .then(function(response) {
            if (response.ok) {
                return response.json(); // Renvoie les données de la réponse sous forme de JSON
            } else {
                throw new Error('Erreur lors de la requête.');
            }
        })
        .then(function(responseData) {
            data = responseData['data'];
            // Traitement des données de réponse
            console.log(data); // Affiche les données dans la console
            displayData(currentPage);
            createPagination();
        })
        .catch(function(error) {
            // Gestion des erreurs
            console.error(error);
        });
});

fetch('/api/v1/medicament')
    .then(function(response) {
        if (response.ok) {
            return response.json();
        } else {
            throw new Error('An error occurred');
        }
    })
    .then(function(responseData) {
        toutcategories = responseData['data'];
        showCategories();
    })
    .catch(function(error) {
        console.error(error);
    });

// filter by the selector

const selectElement = document.getElementById('subject');
selectElement.addEventListener('change', filterSelect);

function filterSelect() {
    const selectedCategories = [selectElement.value];
    console.log(selectedCategories);
    document.getElementById('selectOption').textContent = selectedCategories;

    // Make API request to the server with the selected categories
    const url = `/api/v1/produit?pattern=${encodeURIComponent(selectedCategories)}`;
    console.log(url);
    fetch(url)
        .then(response => response.json())
        .then(responseData => {
            //console.log(responseData['data']); // Example: Log the filtered data to the console
            data = responseData['data'];
            //nomtable = responseData['nomTable'];
            // Traitement des données de réponse
            console.log(responseData); // Affiche les données dans la console
            displayData(currentPage);
            createPagination();
        })
        .catch(error => {
            console.error('Error retrieving filtered produit data:', error);
            // Handle error and show error message to the user
        });
}



function showCategories() {
    var catContainer = document.getElementById('cat-produits');
    catContainer.innerHTML = ''; // vider dabord le container
    var separateur = document.createElement('hr');

    toutcategories.forEach(function(cat) {
        var categorie = cat.categorie;
        var block = document.createElement('col-sm-1');
        var eltcontainer = document.createElement('h5');
        var elts = document.createElement('input');
        elts.className = 'form_1';
        elts.setAttribute('type', 'checkbox');
        elts.setAttribute('data-category', categorie.toLowerCase() + 'Checkbox')
        elts.setAttribute('id', categorie.toLowerCase() + 'Checkbox');
        elts.addEventListener('change', function(event) {
            var category = event.target.getAttribute('data-category');
            if (event.target.checked) {
                selectedCategories.push(category);
            } else {
                var index = selectedCategories.indexOf(category);
                if (index > -1) {
                    selectedCategories.splice(index, 1);
                }
            }
            applyFilters();
        });

        var eltslink = document.createElement('label');
        eltslink.setAttribute('for', categorie.toLowerCase() + 'Checkbox');
        eltslink.textContent = categorie;

        var spaninfo = document.createElement('span');
        spaninfo.className = 'badge pull-right';
        spaninfo.textContent = '20';

        eltcontainer.appendChild(elts);
        block.appendChild(eltslink);
        eltcontainer.appendChild(block);
        eltcontainer.appendChild(spaninfo);
        eltcontainer.appendChild(separateur);
        catContainer.appendChild(eltcontainer);
    });
}


function applyFilters() {
    var filteredData = data;
    if (selectedCategories.length > 0) {
        filteredData = filteredData.filter(function(item) {
            return selectedCategories.includes(item.categorie);
        });
    }

    var priceMin = document.getElementById('price-min').value;
    filteredData = filteredData.filter(function(item) {
        return item.prix >= priceMin;
    });

    return filteredData;
}


var currentPage = 1;
var cardsPerPage = 12;
var line = 0;
var data;
var selectedCategories = [];

function displayData(page) {
    var startIndex = (page - 1) * cardsPerPage;
    var endIndex = page * cardsPerPage;
    var infopage = document.getElementById('page-display');
    var resultContainer = document.getElementById('result');
    resultContainer.innerHTML = '';

    //var filteredData = applyFilters();

    data.slice(startIndex, endIndex).forEach(function(item) {
        var id = item.id;
        var code = item.code;
        var modele = item.modele;
        var image = item.image;
        var conditionnement = item.conditionnement;
        var forme = item.forme;
        var prix = item.prix;
        line += 1;

        // Creation des cartes
        var cardby = document.createElement('div');
        cardby.className = 'row';

        var cardColumn = document.createElement('div');
        cardColumn.className = 'col-sm-3 space_left';

        var cardcontent = document.createElement('div');
        cardcontent.className = "shop_1r1i text-center clearfix";


        var imgcontent = document.createElement('img');
        imgcontent.className = 'img img-responsive img-thumbnail card-img';
        path = 'produits/' + image.substring(27).replace('_', "'");
        var imgref = document.createElement('a');
        imgcontent.setAttribute('src', path);
        imgref.setAttribute('href', 'detail.html/' + id);
        imgref.appendChild(imgcontent);
        var card = document.createElement('div');
        card.className = 'card mtop10';

        var cardBody = document.createElement('div');
        cardBody.className = 'card-body';

        var cardFooter = document.createElement('div');
        cardFooter.className = 'card-footer';

        var cardText = document.createElement('p');
        formeField = document.createElement('h6');
        formeField.className = 'text-info';
        formeField.textContent = forme;

        modeleField = document.createElement('h6');
        modeleField.className = 'bold text-info';
        modeleField.textContent = modele;

        condField = document.createElement('h5');
        condField.className = 'bold text-danger';
        condField.textContent = conditionnement;


        priceField = document.createElement('h4');
        priceField.className = 'bold text-success';
        priceField.textContent = prix + ' CFA';

        panierField = document.createElement('h5');
        var voirDetailBtn = document.createElement('button');
        voirDetailBtn.className = 'btn button_1';
        voirDetailBtn.textContent = 'Voir Detail';
        voirDetailBtn.addEventListener('click', function() {
            // Get the value to send (e.g., item.id)
            var valueToSend = item.id;

            // Construct the URL with the value as a query parameter
            var detailPageUrl = 'detail.html?id=' + valueToSend;

            // Navigate to the detail.html page with the value as a query parameter
            window.location.href = detailPageUrl;
        });

        cardBody.appendChild(imgcontent);
        cardFooter.appendChild(cardText);
        cardFooter.appendChild(formeField);
        cardFooter.appendChild(modeleField);
        cardFooter.appendChild(condField);
        cardFooter.appendChild(priceField);
        cardFooter.appendChild(panierField)
        card.appendChild(cardBody);
        card.appendChild(cardFooter);
        cardcontent.appendChild(card);
        cardColumn.appendChild(cardcontent);
        cardFooter.appendChild(voirDetailBtn);
        if (line === 4) {
            console.log('ligne :' + line);
            cardby.appendChild(cardColumn);
            resultContainer.appendChild(cardby);
            line = 0;

        } else {
            resultContainer.appendChild(cardColumn);
        }

    });
}


function createPagination() {
    var totalPages = Math.ceil(data.length / cardsPerPage);
    var paginationContainer = document.getElementById('pagination');
    paginationContainer.innerHTML = ''; // Effacer le contenu de la pagination

    var maxPageButtons = 10; // Nombre maximum de pages a afficher

    var startPage = 1;
    var endPage = totalPages;

    if (totalPages > maxPageButtons) {
        var middlePage = Math.ceil(maxPageButtons / 2);
        if (currentPage > middlePage) {
            startPage = currentPage - middlePage + 1;
            endPage = currentPage + middlePage - 1;
            if (endPage > totalPages) {
                endPage = totalPages;
            }
        } // else {
        //http: //localhost:8009/api/v1/produit/?pattern=BETA
        //}
    }

    if (startPage > 1) {
        var prevPageItem = document.createElement('li');
        prevPageItem.className = 'page-item';
        var prevPageLink = document.createElement('a');
        prevPageLink.className = 'page-link';
        prevPageLink.href = '#';
        prevPageLink.textContent = 'Précédent';
        prevPageLink.addEventListener('click', function(event) {
            event.preventDefault();
            currentPage--;
            displayData(currentPage);
            updatePagination();
        });
        prevPageItem.appendChild(prevPageLink);
        paginationContainer.appendChild(prevPageItem);
    }


    for (var i = startPage; i < endPage; i++) {
        var pageItem = document.createElement('li');
        pageItem.className = 'page-item' + (i === currentPage ? ' active' : '');
        var pageLink = document.createElement('a');
        pageLink.className = 'page-link';
        pageLink.href = '#';
        pageLink.textContent = i;
        pageLink.addEventListener('click', function(event) {
            event.preventDefault();
            currentPage = parseInt(event.target.textContent);
            displayData(currentPage);
            updatePagination();
        });
        pageItem.appendChild(pageLink);
        paginationContainer.appendChild(pageItem);
    }

    if (endPage < totalPages) {
        var nextPageItem = document.createElement('li');
        nextPageItem.className = 'page-item';
        var nextPageLink = document.createElement('a');
        nextPageLink.className = 'page-link';
        nextPageLink.href = '#';
        nextPageLink.textContent = 'Suivant';
        nextPageLink.addEventListener('click', function(event) {
            event.preventDefault();
            currentPage++;
            displayData(currentPage);
            updatePagination();
        });
        nextPageItem.appendChild(nextPageLink);
        paginationContainer.appendChild(nextPageItem);
    }
}

function updatePagination() {
    var paginationItems = document.querySelectorAll('#pagination .page-item');
    paginationItems.forEach(function(item) {
        var pageLink = item.querySelector('.page-link');
        var pageNumber = parseInt(pageLink.textContent);
        if (pageNumber === currentPage) {
            item.classList.add('active');
        } else {
            item.classList.remove('active');
        }
    });
}