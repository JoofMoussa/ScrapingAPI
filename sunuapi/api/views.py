from django.shortcuts import render, get_object_or_404
from django.http import JsonResponse
import psycopg2

connection = psycopg2.connect(
        host='localhost',
        database='sunuapi',
        user='defaultuser2',
        password='root123'
    )

def categories(request):

    cursor = connection.cursor()
    query = "SELECT * FROM medicament "
    cursor.execute(query)
    data = cursor.fetchall()
    cats = []
    for row in data:
        infos =  {
                'id': row[0],
                'idtypemed': row[1],
                'categorie': row[2]
        }
        cats.append(infos)
    return JsonResponse(cats, safe=False)        


def medicaments(request):
    cursor = connection.cursor()
    query = "SELECT * FROM produit "
    cursor.execute(query)
    data = cursor.fetchall()
    prods = []
    for row in data:
        infos = {
            'id': row[0],
            'code': row[1],
            'modele': row[2],
            'image': row[3],
            'prix': row[4],
            'conditionnement': row[5],
            'forme': row[6],
            'specialites': row[7],
            'refid': row[8],
        }
        prods.append(infos)
    return JsonResponse(prods, safe=False)


    
    

