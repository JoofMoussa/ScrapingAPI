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




            console.log(elt);

            br = document.createElement('br');

            console.log(responseData[elt]['region']);
            var res = document.getElementById('resultats');
            var box = document.createElement('div');
            box.className = 'col-lg-3';
            var content = document.createElement('div');
            content.className = 'card bshadow';
            content.style.marginTop = '50px';
            var content2 = document.createElement('div');
            content2.className = 'card-body';
            var myimg = document.createElement('img');
            myimg.className = 'card-img img img-thumbnail img-responsive';
            // // myimg.src="img/44.jpg";
            myimg.src = '../img/region/' + responseData[elt]['image'];
            content2.appendChild(myimg);
            var titlebox = document.createElement('div');
            titlebox.className = 'card-title';
            titlebox.innerHTML = '<h4 class="text-success">' + responseData[elt]['region'] + '</h4>';
            ol = document.createElement('ul');
            li = document.createElement('li');
            var footerbox = document.createElement('div');
            footerbox.className = 'card-footer';
            var jour = document.createElement('h6');
            jour.className = 'text-warning';
            jour.innerHTML = '<i class="fa fa-2x fa-cloud-sun"></i>  ' + "<span class='badge badge-green' style='background-color: skyblue; color:white;'><h4>" + responseData[elt]['temperature_max_jour'] + '</h4></span>';
            li.appendChild(jour);

            var nuit = document.createElement('h6');
            nuit.className = 'text-info';
            // nuit.
            nuit.innerHTML = '<i class="fa fa-2x fa-cloud-moon"></i>  ' + "<span class='badge badge-green' style='background-color: orange; color:white;'><h4>" + responseData[elt]['temperature_max_nuit'] + '</h4></span>';
            li.appendChild(nuit);

            var heure_soleile = document.createElement('h6');
            // heure_soleile.style.marginLeft='30px';
            heure_soleile.className = 'text-info';
            heure_soleile.innerHTML = 'heure_soleil : ' + "<span class='badge badge-green'>" + responseData[elt]['heure_soleil'] + '</span>';
            li.appendChild(heure_soleile);

            var jour_pluie = document.createElement('h6');
            jour_pluie.className = 'text-info'
            jour_pluie.innerHTML = 'jour_pluie : ' + "<span class='badge badge-green'>" + responseData[elt]['jour_pluie'] + '</span>';
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