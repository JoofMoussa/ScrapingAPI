
    // fetch("/donne_meteo")
    //     .then(reponse => reponse.json())
    //     .then(reponse2 => console.table(reponse2))
    
    fetch('/donne_meteo')
        .then(function(response) {
            if (response.ok) {
                return response.json();
            } else {
                throw new Error('il a eu un erreur coriger');
            }
        })
        .then(function(responseData) {
            for (elt in responseData) {
                // console.log(responseData[elt]['region']);
                // var res = document.getElementById('resultats');
                // var content = document.createElement('div');
                // content.className = 'card';
                // var content2 = document.createElement('div');
                // content2.className = 'card-body';
                // var myimg = document.createElement('img');
                // myimg.className="card-img-top";
                // // // myimg.src="img/44.jpg";
                // myimg.src=responseData[elt]['image'];
                // content2.appendChild(myimg);
                // var list = document.createElement('div');
                // var ulem = document.createElement('ul');
                // list.appendChild(ulem);
                // var li = document.createElement('li');
                // titlebox.innerHTML = responseData[elt]['region'];
                // li.appendChild(titlebox);
                // var li = document.createElement('li');
                // li.className = 'text-info';
                // jour.innerHTML = responseData[elt]['temperature_max_jour'];
                // li.appendChild(jour);
                





                br = document.createElement('br');

                console.log(responseData[elt]['region']);
                var res = document.getElementById('resultats');
                var box =  document.createElement('div');
                box.className = 'col-lg-12';
                var content = document.createElement('div');
                content.className = 'card';
                var content2 = document.createElement('div');
                content2.className = 'card-body';
                var myimg = document.createElement('img');
                myimg.className='img img-thumbnail img-responsive';
                // // myimg.src="img/44.jpg";
                myimg.src=responseData[elt]['image'];
                content2.appendChild(myimg);
                var titlebox = document.createElement('div');
                titlebox.className = 'card-title';
                titlebox.innerHTML = responseData[elt]['region'];
                ol = document.createElement('ul');
                li = document.createElement('li');
                var footerbox = document.createElement('div');
                footerbox.className = 'card-footer';
                var jour = document.createElement('h4');
                jour.className = 'text-info';
                jour.innerHTML = 'temperature_max_jour :  '+responseData[elt]['temperature_max_jour'];
                li.appendChild(jour);

                var nuit = document.createElement('h4');
                nuit.className = 'text-info';
                // nuit.style.marginLeft='30px';
                nuit.innerHTML= 'temperature_max_nuit : ' + responseData[elt]['temperature_max_nuit'];
                li.appendChild(nuit);

                var heure_soleile = document.createElement('h4');
                // heure_soleile.style.marginLeft='30px';
                heure_soleile.className = 'text-info';
                heure_soleile.innerHTML= 'heure_soleil : ' + responseData[elt]['heure_soleil'];
                li.appendChild(heure_soleile);

                var jour_pluie = document.createElement('h4');
                jour_pluie.className = 'text-info'
                jour_pluie.innerHTML= 'jour_pluie : ' + responseData[elt]['jour_pluie'];
                li.appendChild(jour_pluie);
                ol.appendChild(li);
                
                content.appendChild(titlebox);
                content.appendChild(content2);
                footerbox.appendChild(ol);
                // footerbox.appendChild(jour);
                // footerbox.appendChild(nuit);
                // footerbox.appendChild(inline);
                // footerbox.appendChild(heure_soleile);
                // footerbox.appendChild(jour_pluie);
                content.appendChild(footerbox);
                box.appendChild(content);
                res.appendChild(box);
             }
             
                
        })
        .catch(function(error) {
            console.error(error);
        });