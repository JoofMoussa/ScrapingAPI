#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Created on Fri Jun 30 21:47:37 2023

@author: kala
"""

import pandas as pd
file1 = "/home/kala/Desktop/scrapper/medicaments.csv"
file2 = "/home/kala/Desktop/scrapper/categoriesprod.csv"

df1 = pd.read_table(file1, header=0, sep=',')
df2 = pd.read_table(file2, header=0, sep=',')

df2 = df2.assign(modele=df2['modele'].str.split("']").str.get(0).str.strip("[' "))
df2 = df2.drop('Unnamed: 0', axis=1)
df2 = df2.assign(image = 'http://www.pna.sn/'+df2['image'])
df2 = df2.assign(prix = df2['prix'].str.replace(' ', ''))
# for line in df2['prix']:
#     if line != 'nonspecifié':
#         df2['prix'] = pd.to_numeric(df2['prix'])
df2.to_json("medoc.json", orient='table')
df1.to_json("categoriemedoc.json", orient='table')