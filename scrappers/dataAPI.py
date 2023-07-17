
import requests
import json
url = "https://insectvectors.science/api/vectors"

data_api_liste = []
    
data_api_dict = {}

response = requests.get(url)

if response.status_code == 200:

    data_gobal = response.json()
    data = data_gobal['results']
    for line in data:
        data_api_dict = {
            "nom_insecte":line['data']["title"],
            "premiere_partie":line['data']['genus'],
            "deuxieme_partie":line['data']['specificepithet'],
            "description":line['data']['descriptionBody'],
            "description_size":line['data']['descriptionSize'],
            "famille":line['data']['family'],
            "diagnostic":line['data']['diagnosis'],
            "filename":line['data']["image"]["filename"],
            "path":line['data']["image"]["path"],
            "media":line['data']["image"]["media"],
            "fieldname":line['data']["image"]["fieldname"],
            "alt":line['data']["image"]["alt"],
            "url":line['data']["image"]["url"],
            "extension":line['data']["image"]["extension"],

        }

        print(data_api_dict)
        data_api_liste.append(data_api_dict)

        with open('insert_insecte.sql','a+') as fichier:
            requete = """
                insert into insecte(nom,image_url,description_insecte,partie1,partie2,famille,diagnostic)
                values("{}","{}","{}","{}","{}","{}","{}");
            """.format(data_api_dict['nom_insecte'],data_api_dict['url'],data_api_dict['description'],data_api_dict['premiere_partie'],data_api_dict['description_size'],data_api_dict['famille'],data_api_dict['diagnostic'])
            fichier.write(requete)

    with open("donnees_API_insectes.json","a+") as fichier:
        json.dump(data_api_liste,fichier)
    
    
else:
    print(f"la requete a échoué avec le message d'erreur",response.status_code)
    print(f"le message d'erreur est ",response.text)