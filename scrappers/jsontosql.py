#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Created on Fri Jun 30 22:48:42 2023

@author: kala
"""
import json

filejson = "/home/kala/Desktop/scrapper/categoriemedoc.json"
filejson2 = "/home/kala/Desktop/scrapper/medoc.json"

f = open(filejson)
f2 = open(filejson2)

line = f.readline()
line2 = f2.readline()

# d = eval(line)
d = json.loads(line)
d2 = json.loads(line2)

# print(type(d))

# for k in d:
    # print(repr(k))
datas = d['data']
medocdatas = d2['data']


with open('categoriemedoc.sql','w+') as f:
    for k in medocdatas:
        requete = """
            insert into produit (id, code, modele, image, prix, conditionnement, forme, specialites, refid) values({},'{}','{}','{}',{},'{}','{}','{}',{});
        """.format(int(k['index']+1),k['code'],k['modele'].replace('"','').replace("'",''),k['image'].replace("'",'_'),k['prix'],k['conditionnement'],k['forme'],k['specialites'],k['reference'])
        f.write(requete)
    
    f.close()
    
with open('medoc.sql','w+') as f:
    for k in datas:
        requete = """
            insert into medicament (idtypemed,  categorie) values('{}','{}');
        """.format(k['idtypemed'],k['Categorie'])
        f.write(requete)
    
    f.close()

    