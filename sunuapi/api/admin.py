from django.contrib import admin

# Register your models here.
# import psycopg2

# connection = psycopg2.connect(
#         host='localhost',
#         database='sunuapi',
#         user='defaultuser2',
#         password='root123'
#     )
# cursor = connection.cursor()
# query = "SELECT table_name FROM information_schema.tables WHERE table_schema = 'public' AND table_name='medicament'"
# cursor.execute(query)
# table_medoc = cursor.fetchone()[0]
# print(table_medoc)

# query2 = "SELECT table_name FROM information_schema.tables WHERE table_schema = 'public' AND table_name='produit'"
# cursor.execute(query2)
# table_prod = cursor.fetchone()[0]
# print(table_prod)

# admin.site.register(table_medoc)
# admin.site.register(table_prod)
