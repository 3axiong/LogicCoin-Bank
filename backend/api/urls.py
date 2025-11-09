from django.urls import path
from . import views

# Any route added to views.py must also be added here as a path

urlpatterns = [
    path('balance', views.coinbalance, name='balance'),
    path('awardCoins', views.awardCoins, name='awardCoins'),
    path('transaction', views.transaction, name='transaction'),
    path('register', views.register, name='register'),
    path('login', views.login, name='login'),
    
    path("students/", views.students_list, name="students_list"),
    path("products/", views.products_list, name="products_list"),
    path("students/<int:student_id>/activities/", views.student_activities, name="student_activities"),
]
