
const { ceil } = Math;
$(document).ready(function(){
    var secondaryNav = $('.cd-secondary-nav'),
        secondaryNavTopPosition = secondaryNav.offset().top;
    $(window).on('scroll', function() {
        if ($(window).scrollTop() > secondaryNavTopPosition) {
            secondaryNav.addClass('is-fixed');
        } else {
            secondaryNav.removeClass('is-fixed');
        }
    });
});

// consommation de l'api avec fetch

fetch('api/v1/insecte')
    .then(function(response){
        if(response.ok){
            return response.json()
        }
        else{
            throw new Error("une erreur s'est produite")
        }
    })
    .then(function(responseData){
        les_insectes = responseData['data'];
       
        liste_insectes(pageCourant);
        createPagination()
    })
    .catch(function(error){
        console.log(error)
    });


var pageCourant = 1;
var nbreElementPage = 12;
var line = 0;

// parcours des insectes et création de cartes pour l'affichage
function liste_insectes(page){
    var startIndex = (page -1) * nbreElementPage;
    var endIndex = page * nbreElementPage;
    var resultContainer = document.getElementById('result');
    resultContainer.innerHTML = '';
    les_insectes.slice(startIndex,endIndex).forEach(function(item){
        var id = item.id;
        var nom_insecte = item.nom
        var image = item.image_url;
        var descrip = item.description_insecte;
        var partie1 = item.partie1;
        var partie2 = item.partie2;
        var famille = item.famille;
        var diagnostic =  item.diagnostic;
        var id_service = item.id_service;
        line += 1;
        // creation des cartes
        var cardby = document.createElement('div');
        cardby.className = 'row';

        var cardColumn = document.createElement('div');
        cardColumn.className = 'col-sm-3 space_left';

        var cardcontent = document.createElement('div');
        cardcontent.className = "shop_1r1i text-center clearfix";

        var imgcontent = document.createElement('img')
        imgcontent.className = 'img img-responsive img-thumbnail card-img';
        path = image;
        imgcontent.setAttribute('src',path);
        var card = document.createElement('div');
        card.className = 'card mtop10';

        var cardBody = document.createElement('div');
        cardBody.className = 'card-body';

        var cardFooter = document.createElement('div');
        cardFooter.className = 'card-footer';

        var cardDescription = document.createElement('p');
        cardDescription.className = 'description';
        cardDescription.innerText = descrip;
        cardcontent.appendChild(cardDescription);

        var cardText = document.createElement('p');
        formeField = document.createElement('h6');
        formeField.className = 'text-info';
        formeField.textContent = famille;

        nom_insecte_Field = document.createElement('h6');
        nom_insecte_Field.className = 'bold text-info';
        nom_insecte_Field.textContent = nom_insecte;

        cardBody.appendChild(imgcontent);
        cardFooter.appendChild(cardText);
        cardFooter.appendChild(formeField);
        cardFooter.appendChild(nom_insecte_Field);
        card.appendChild(cardBody);
        card.appendChild(cardFooter);

        cardcontent.appendChild(card);
        cardColumn.appendChild(cardcontent);
        if(line === 4){
            // console.log('ligne :' +line);
            cardby.appendChild(cardColumn);
            resultContainer.appendChild(cardby);
            line = 0;
        }
        else{
            resultContainer.appendChild(cardColumn);
        }
        
    });
}

function createPagination(){
    var totalPages = Math.ceil(les_insectes.length / nbreElementPage);
    var paginationContainer = document.getElementById('pagination');
    paginationContainer.innerHTML = '';

    var maxPageButtons = 10;
    var startPage = 1;
    var endPage = totalPages;
    if (totalPages > maxPageButtons){
        var  milieuPage = Math/ceil(maxPageButtons / 2);
        if (pageCourant > milieuPage){

            startPage = pageCourant - milieuPage + 1;
            endPage = pageCourant +milieuPage -1;
            if (endPage > totalPages) {
                endPage = totalPages;
        }
        else{
            console.log("");
        }
        }
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
            pageCourant--;
            liste_insectes(pageCourant);
            updatePagination();
        });
        prevPageItem.appendChild(prevPageLink);
        paginationContainer.appendChild(prevPageItem);
    }

    for (var i = startPage; i <= endPage; i++) {
        var pageItem = document.createElement('li');
        pageItem.className = 'page-item' + (i === pageCourant ? ' active' : '');
        var pageLink = document.createElement('a');
        pageLink.className = 'page-link';
        pageLink.href = '#';
        pageLink.textContent = i;
        pageLink.addEventListener('click', function(event) {
            event.preventDefault();
            pageCourant = parseInt(event.target.textContent);
            liste_insectes(pageCourant);
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
            pageCourant++;
            liste_insectes(pageCourant);
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
        if (pageNumber === pageCourant) {
            item.classList.add('active');
        } else {
            item.classList.remove('active');
        }
    });
}

var insecte = document.getElementsByClassName('img img-responsive img-thumbnail card-img');
// insecte.addEventListener('click',function(event) =>{


// })
console.log(insecte);