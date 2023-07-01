#from django.contrib import admin
#from django.urls import path
#from .apiviews import Listemedocs, Listecategories

#urlpatterns = [
#    path('api/categories', Listecategories.as_view(), name='categories'),
#    path('api/medicaments', Listemedocs.as_view() , name='medicaments'),
    
#]
from django.contrib import admin
from django.urls import path, include
from .views import categories, medicaments

urlpatterns = [
    path('api/categories', categories, name='categories'),
    path('api/medicaments', medicaments, name='medicaments'),
    
]
# from django.urls import path
# from .apiviews import MedicamentAPIView

# urlpatterns = [
#     path('medicaments/', MedicamentAPIView.as_view(), name='medicaments_list'),
#     path('medicaments/<int:pk>/', MedicamentAPIView.as_view(), name='medicaments_detail'),
    
# ]

