from django.shortcuts import render
import json
from bs4 import BeautifulSoup
from selenium import webdriver
from selenium.webdriver.common.action_chains import ActionChains



# Create your views here.

# configuration de selenium
driver = webdriver.Chrome()  # j'utilise le navigateur chrome
# url de la première page
url3 = 'https://www.agric.wa.gov.au/pest-insects/insect-pests-vegetables'

url2 = "https://plantnet.com.au/plant-care/pests-and-diseases/"

url = "https://extension.usu.edu/pests/research/insects-treefruit"



# charger la page initiale
driver.get(url)
# boucle de pagination

liste_insectes = []
while True:
    reponse_html = driver.page_source
    soup = BeautifulSoup(reponse_html, 'html.parser')

    # extraire des données de la page avec BeautifulSoup
    body_insectes = soup.find_all(class_="card-body")
    nom_insectes = soup.find_all(class_='stretched-link')
     # code pour extraire les données souhaitées
    for body_insecte, nom in zip(body_insectes, nom_insectes):
        try:
            image_url = body_insecte.div.a.img['src']
            nom_insecte = nom.get_text(strip=True)
            description_insecte = body_insecte.p.get_text(strip=True)
            dict_insecte = {
                'image': image_url,
                'nom': nom_insecte,
                'description': description_insecte
            }
            liste_insectes.append(dict_insecte)
            with open('insert_insecte.sql','a+') as fichier:
                requete = """
                insert into insecte(nom,image_url,description_insecte,partie1,partie2,famille,diagnostic)
                values("{}","{}","{}","{}","{}","{}","{}");
                """.format(dict_insecte['nom'],dict_insecte['image'],dict_insecte['description'],'','','','')
                fichier.write(requete)

            dict_insecte = {}
  
        
        except Exception as  e:
            print("une erreur s'est produite :",str(e))
           
    # faire défiler la page jusqu'au bas pour charger plus de contenu
    driver.execute_script("window.scrollTo(0, document.body.scrollHeight);")
    driver.implicitly_wait(5)  # Attendre 5 secondes
    # récupérer le code HTML de la page aprés le défilement
    page_after_defile = driver.page_source
    # vérifier si on a atteint la fin de la pagination
    if reponse_html == page_after_defile:
        # si les résultats sont les memes, nous avons atteint la fin de la pagination
        break

# Fermer le navigateur
driver.quit()

with open("data_scrapping_python_insectes.json","w+") as fichier:
    json.dump(liste_insectes,fichier)  
