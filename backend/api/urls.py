from django.urls import path
from . import views

# Any route added to views.py must also be added here as a path

urlpatterns = [
    path('balance', views.coinbalance, name='balance'),
    path('awardCoins', views.awardCoins, name='awardCoins'),
    path('transaction', views.transaction, name='transaction'),
    path('register_student', views.register_student, name='register_student'),
    path('register_instructor', views.register_instructor, name='register_instructor'),
    path('login', views.login, name='login'),
]
