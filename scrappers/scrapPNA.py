#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Created on Tue Jun 20 11:41:15 2023

@author: kala
"""
import os
from urllib.request import urlopen, urlretrieve
from urllib.error import HTTPError
from bs4 import BeautifulSoup as bsoup
import re
import pandas as pd
import time
import smtplib
from email.mime.text import MIMEText
from tqdm import tqdm
from urllib.parse import quote
import psycopg2

conn = psycopg2.connect(
    host="your_host",
    database="your_database",
    user="your_user",
    password="your_password"
)


def downloadfile(filename, url, destination_dir, expected_bytes = None, force = False):

    filepath = os.path.join(destination_dir, filename)

    if force or not os.path.exists(filepath):
        if not os.path.exists(destination_dir):
            os.makedirs(destination_dir)

        print('Attempting to download: ' + filename)
        filepath, _ = urlretrieve(url, filepath)
        print('Download complete!')

    statinfo = os.stat(filepath)

    if expected_bytes != None:
        if statinfo.st_size == expected_bytes:
            print('Found and verified: ' + filename)
        else:
            raise Exception('Failed to verify: ' + filename + '. Can you get to it with a browser?')
    else:
        print('Found: ' + filename)
        print('The size of the file: ' + str(statinfo.st_size))

    return filepath 


def sendMail(subject, body):
    msg = MIMEText(body)
    msg['Subject'] = subject
    msg['From'] ='christmas_alerts@pythonscraping.com'
    msg['To'] = 'ryan@pythonscraping.com'
    s = smtplib.SMTP('localhost')
    s.send_message(msg)
    s.quit()

# https://www.pna.sn/produits/692011.jpo

# Tables(categorie, produit)
base_url = "https://www.pna.sn/"
urlPage1 = "https://www.pna.sn/medicament.php?idmedicament=1"
urlmed = "https://www.pna.sn/medicament.php?idmedicament="
urlprod = "https://www.pna.sn/type_produit.php?idtypeproduit="
urlprix = "https://www.pna.sn/fiche_produit.php?idproduit="

def cleanInput(content):
    content = re.sub('\n|[[\d+\]]', ' ', content)
    content = bytes(content, "UTF-8")
    content = content.decode("ascii", "ignore")
    sentences = content.split('. ')
    return [cleanSentence(sentence) for sentence in sentences]

def getPage(url):
    try:
        html = urlopen(url)
    except HTTPError as e:
        return None
    try:
        bs = bsoup(html.read(), 'html.parser')
    except AttributeError as e:
        return None
    return bs

def getTitle(url):
    try:
        html = urlopen(url)
    except HTTPError as e:
        return None
    try:
        bs = bsoup(html.read(), 'html.parser')
        title = bs.body.h1
    except AttributeError as e:
        return None
    return title



def recupererCategorieMedicaments(codeSource):
    catmed = codeSource.find("div", class_="panel-body")
    tablemed = []
    medicaments = []
    fiche = pd.DataFrame(columns=['code', 'modele', 'image', 'prix', 'conditionnement', 'forme', 'specialites'])

    # Recuperer et Extraire la valeur dans l attribut href
    links = catmed.find_all('a')

    # Recuperer les medicaments
    for link in links:
        idmed = link['href'].split('=')[1]
        lienmed = urlmed + idmed
        pagemed = getPage(lienmed)
        thumb = pagemed.find_all("div", class_="thumbnail")
        catg = re.sub(r'\W+', ' ', link.text)
        medicaments.append(catg)
        tablemed.append(idmed)

        for contenu in thumb:
            imgs = contenu.find_all("img")
            linkprod = contenu.find_all("a")

            for im, lk in zip(imgs, linkprod):
                ref = lk['href'].split('=')[1]
                codesourcefp = getPage(base_url + lk['href'])
                csprix = getPage(urlprix + ref)
                span_elt = csprix.find("ul", class_="nav nav-pills nav-stacked")
                div_element = codesourcefp.find('div', class_='panel-heading bg-info')
                code_model_text = div_element.get_text(strip=True)
                print(code_model_text)
                txt = code_model_text.split("/")
                codemed = txt[1].split(":")[1].strip()
                data = str(txt[2:])

                info_dict = {
                    'code'     : codemed,
                    'modele'   : data,
                    'image'    : im['src'],
                    'reference': idmed
                }
                # filename = im['src'].replace("'", "_").replace(" ", "_").split("/")[-1]
                # filename = quote(image_url.split("/")[-1])
                
                downloadfile(im['src'].replace(" ", "_").split("/")[-1], base_url+im['src'], "produits/")
                # filename = im['src'].split("/")[-1]
                # urlretrieve (base_url+im['src'], filename)

                if span_elt:
                    prix = span_elt.find("span", class_="couleurNoir").text
                    conditionnement = span_elt.find_all("span", class_="couleurNoir")[1].text
                    forme = span_elt.find_all("span", class_="couleurNoir")[2].text
                    specialites = span_elt.find_all("span", class_="couleurNoir")[3].text
                    info_dict['prix'] = prix
                    info_dict['conditionnement'] = conditionnement
                    info_dict['forme'] = forme
                    info_dict['specialites'] = specialites

                fiche = fiche.append(info_dict, ignore_index=True)

    return medicaments, tablemed, fiche



# def recupererCategorieMedicaments(codeSource):
#     catmed = codeSource.find("div", class_="panel-body")
#     tablemed = []
#     medicaments = []
#     fiche = pd.DataFrame(columns=['code', 'modele', 'image'])

#     # Recuperer et Extraire la valeur dans l attribut href
#     links = catmed.find_all('a')

#     # Recuperer les medicaments
#     for link in links:
#         idmed = link['href'].split('=')[1]
#         lienmed = urlmed + idmed
#         pagemed = getPage(lienmed)
#         thumb = pagemed.find_all("div", class_="thumbnail")
#         catg = re.sub(r'\W+', ' ', link.text)
#         medicaments.append(catg)
#         tablemed.append(idmed)

#         for contenu in thumb:
#             imgs = contenu.find_all("img")
#             linkprod = contenu.find_all("a")

#             for im, lk in zip(imgs, linkprod):
#                 ref = lk['href'].split('=')[1]
#                 codesourcefp = getPage(base_url + lk['href'])
#                 csprix = getPage(urlprix + ref)
#                 span_elt = csprix.find("ul", class_="nav nav-pills nav-stacked")
#                 div_element = codesourcefp.find('div', class_='panel-heading bg-info')
#                 code_model_text = div_element.get_text(strip=True)
#                 print(code_model_text)
#                 txt = code_model_text.split("/")
#                 codemed = txt[1].split(":")[1].strip()
#                 data = str(txt[2:])

#                 info_dict = {
#                     'code': codemed,
#                     'modele': data,
#                     'image': im['src'],
#                     'ref' : idmed
#                 }
#                 fiche = fiche.append(info_dict, ignore_index=True)

#     return medicaments, tablemed, fiche


# def recupererCategorieMedicaments(codeSource) : 
#     catmed = codeSource.find("div", class_="panel-body")
#     tablemed = []
#     medicaments = []
#     fiche = pd.DataFrame()
#     #Recuperer et Extraire la valeur dans l attribut href
#     links = catmed.find_all('a')
#     #recuperer les medicaments
#     for link, cat in zip(links, catmed) :
#          idmed = link['href'].split('=')[1]
#          lienmed = urlmed+idmed
#          pagemed = getPage(lienmed)
#          thumb = pagemed.find_all("div", class_="thumbnail")
#          catg = re.sub(r'\W+', ' ',link.text)
#          medicaments.append(catg)
#          tablemed.append(idmed)
#          for contenu in thumb :
#               imgs = contenu.find_all("img")
#               linkprod =  contenu.find_all("a")
#               for im, lk in zip(imgs, linkprod) :
#                   ref = lk['href'].split('=')[1]
#                   codesourcefp = getPage(base_url+lk['href'])
#                   csprix = getPage(urlprix+ref)
#                   span_elt = csprix.find("ul", class_="nav nav-pills nav-stacked")
#                   div_element = codesourcefp.find('div', class_='panel-heading bg-info')
#                   code_model_text = div_element.get_text(strip=True)
#                   print(code_model_text)
#                   txt = code_model_text.split("/")
#                   codemed=txt[1].split(":")[1].strip()
#                   data = str(txt[2:])
#                   fiche['code'] = codemed
#                   fiche['modele']=data
#                   fiche['image']=im['src']
#                   inf = span_elt.find_all("span", class_="couleurNoir")
#                   for ip in inf :
#                        fiche['prix'] = ip.text
#          #         value = code_model_text.split(':')[1].strip()
#          #         code = value.split('/')[0]
#     return medicaments, tablemed, fiche
         
    # print(data)

         # for lienprod in thumb : 
         #     linkprod =  lienprod.a.href.split('=')[1]
         # for contenu in thumb :
         #     imgs = contenu.find_all("img")
         #     linkprod =  contenu.find_all("a")
         #     # print(linkprod)
         #     for im, lk in zip(imgs, linkprod) :
         #         ref = lk['href'].split('=')[1]
         #         codesourcefp = getPage(base_url+lk['href'])
         #         div_element = codesourcefp.find('div', class_='panel-heading bg-info')
         #         # infoprix = codesourcefp.find("ul", class_="nav nav-pills nav-stacked")
         #         code_model_text = div_element.get_text(strip=True)
         #         value = code_model_text.split(':')[1].strip()
         #         code = value.split('/')[0]
         #         #fiche.append(code)
         #         # span_elements = infoprix.find_all('span', class_='couleurNoir')
         #         # values_array = [span.get_text(strip=True) for span in span_elements]

         #         # for span in span_elements :
         #         #     docs.append(span.get_text(strip=True))
         #             # fiche.append(docs)
         #         #medicaments.append((ref,im['src'],idmed))
         # # imagesMed = pagemed.find_all("img", class_="thumbnail")
         # # print(imagesMed)
         # lien = re.sub(r'\W+', ' ',link.text)
         
         # tablemed.append((idmed, lien))
    # return medicaments

# def recupererCategorieProduits(codeSource, url) : 
#     catprod = codeSource.find("div", class_="panel-body")
#     catprod2 = catprod.find_next("div", class_="panel-body")
#     links = catprod2.find_all('a')
#     tableprod = []
#     produits = []
#     for link, cat in zip(links, catprod2) :
#          idtypeprod = link['href'].split('=')[1]
#          lienprod = urlprod+idtypeprod+'&limit=1'
#          pageprod = getPage(lienprod)
#          linksprod = pageprod.find_all('a')
#          thumb = pageprod.find_all("div", class_="thumbnail")
#          for img in thumb :
#              imgs = img.find_all("img")
#              for im in imgs :
#                  produits.append((idtypeprod,im['src']))
#          lien = re.sub(r'\W+', ' ',link.text)
#          tableprod.append((idtypeprod, lien))
#     return tableprod, produits

# def produitParId(id, ):
#     pass

# def medicamentParId():
#     pass
# df = pd.DataFrame()

codeSource = getPage(urlmed)
cat, tabm, data = recupererCategorieMedicaments(codeSource)
# print(cat, tabm)

# df = pd.DataFrame({"idtypemed": tabm, "Categorie": cat})
# df.to_csv('medicaments.csv',index=False)

# df2 = pd.DataFrame(data,index = True)

data.to_csv('categoriesprod.csv')



# cat2, produits = recupererCategorieProduits(codeSource, urlPage1)
# for ct in cat :
#     data = df.assign(categorie=ct)
# print(data)
# df = df.append(pd.Series(cat), ignore_index=True)
# print('************************************************')
# print(medicaments)


# print(produˇits)


# from bs4 import BeautifulSoup

# html_content = '''
# <div>
#     <a href="medicament.php?idmedicament=4">
#         <span class="glyphicon glyphicon-chevron-right text-left" aria-hidden="true"></span>&nbsp;
#         ANALGESIQUES, ANTIPYRETIQUES, ANTI-INFLAMMATOIRES
#     </a>
# </div>
# <hr />
# '''

# # Parse the HTML content
# soup = BeautifulSoup(html_content, 'html.parser')

# # Find the <a> element
# a_element = soup.find('a')

# # Extract the 'id' from the 'href' attribute
# href = a_element['href']
# id_medicament = href.split('=')[1]

# # Extract the inner text values
# inner_text = a_element.get_text(strip=True)

# # Print the results
# print("ID: ", id_medicament)
# print("Inner Text: ", inner_text)


# title       = getTitle(url)
# if title == None :
#     print('Cette page n a pas de titre')
# else:
#     print(title) 

# base_url = "https://www.pna.sn/"
# idpharma = 25
# for i in range(1, idpharma) : 
#     url = "https://www.pna.sn/medicament.php?idmedicament="+str(i)
#     codeSource  = getPage(url)
#     images = codeSource.find_all("img")
#     # print(images)
#     #recuperer tout les images
#     for image in images:
#         print(base_url+image['src'])




# imag = images.find_all('img',
#  {'src':re.compile('\.\.\/img.*\.jpo')})
# for image in images:
#     print(image['src'])

# for link in codeSource.find("div", {"class":"thumbnail"}) :
#      print(link)
    
# for child in codeSource.find("div", {"class":"thumbnail"}).children:
#     print(child)    
    


# print(codeSource)

# nam = codeSource.findAll('img', {'class':'green'})
# print(nam)
# for name in nameList:
# print(name.get_text())
    
# Here is a basic implementation that allows you to read arbitrary PDFs to a string,
# given a local file object:
from urllib.request import urlopen
from pdfminer.pdfinterp import PDFResourceManager, process_pdf
from pdfminer.converter import TextConverter
from pdfminer.layout import LAParams
from io import StringIO
from io import open
def readPDF(pdfFile):
    rsrcmgr = PDFResourceManager()
    retstr = StringIO()
    laparams = LAParams()
    device = TextConverter(rsrcmgr, retstr, laparams=laparams)
    process_pdf(rsrcmgr, device, pdfFile)
    device.close()
    content = retstr.getvalue()
    retstr.close()
    return content
pdfFile = urlopen('http://pythonscraping.com/'
'pages/warandpeace/chapter1.pdf')
outputString = readPDF(pdfFile)
print(outputString)
pdfFile.close()


import pandas as pd

# Initialize an empty DataFrame
data_frame = pd.DataFrame()

# Inside your loop or wherever you are appending data to the DataFrame
# Assuming you have a DataFrame called "new_data" to append
new_data = pd.DataFrame({'Column1': [1], 'Column2': [2]})

# Use pandas.concat to concatenate the new_data DataFrame to the data_frame
data_frame = pd.concat([data_frame, new_data])

# Continue appending data or performing other operations

# Print the resulting DataFrame
print(data_frame)

    
    