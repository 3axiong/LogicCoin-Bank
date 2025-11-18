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
    
    path("students/", views.students_list, name="students_list"),
    path("products/", views.products_list, name="products_list"),
    path("students/<int:student_id>/activities/", views.student_activities, name="student_activities"),
        # Products CRUD (minimal)
    path('products/create/', views.create_product, name='create_product'),
    path('products/<int:product_id>/', views.update_product, name='update_product'),

    # Purchases
    path('purchases/create/', views.create_purchase, name='create_purchase'),
    path('purchases/<int:purchase_id>/', views.update_purchase, name='update_purchase'),
]
