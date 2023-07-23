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


 // Get the produit ID from the URL
 const params = new URLSearchParams(window.location.search);
 const id = params.get('id');
console.log(id,'********************************')
 // Fetch the produit data using the ID
 fetch(`/api/v1/insecte/${id}`)
     .then(function(response) {
         return response.json();
     })
     .then(function(data_insecte) {

         // Use the data as needed on the detail.html page
         console.log('insecte data:', data_insecte);

         var imgcontainer = document.getElementById('imginsecte');
         var imgblock = document.createElement('img');
         imgblock.src = data_insecte['image_url'];
         imgblock.className = 'img img-responsive img-polaroid card-img2';
         imgcontainer.appendChild(imgblock);

         var nom_insecte = document.getElementById('nom_famille');
         nom_insecte.className = 'text-info';
         nom_insecte.innerHTML = data_insecte['famille'];

         var nom_insecte = document.getElementById('nom_insecte');
         nom_insecte.className = 'text-info';
         nom_insecte.innerHTML = data_insecte['nom'];

         var partie1_insecte = document.getElementById('partie1_insecte');
         partie1_insecte.className = 'text-info';
         partie1_insecte.innerHTML = data_insecte['partie1'];

         var partie2_insecte = document.getElementById('partie2_insecte');
         console.log(partie2_insecte)
         partie2_insecte.className = 'text-info';
         partie2_insecte.innerHTML = data_insecte['partie2'];
         console.log(data_insecte['partie2'])

         var diagnostic = document.getElementById('diag_insecte');
         diagnostic.className = 'text-info';
         diagnostic.innerHTML = data_insecte['diagnostic'];

         var description = document.getElementById('desc_insecte');
         description.className = 'text-info';
         description.innerHTML = data_insecte['description_insecte'];
         
    })
    .catch(function(error){
        console.log(error)
     

    });