import psycopg2

connection = psycopg2.connect(
        host='localhost',
        database='sunuapi',
        user='defaultuser2',
        password='root123'
    )