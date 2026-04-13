from django.urls import path
from . import views

urlpatterns = [
    path("api/balance/", views.coinbalance, name="balance"),
    path("api/awardCoins/", views.awardCoins, name="awardCoins"),
    path("api/transaction/", views.transaction, name="transaction"),
    path("api/leaderboard/", views.leaderboard, name="leaderboard"), # LB added

    path("api/register_student/", views.register_student, name="register_student"),
    path("api/register_instructor/", views.register_instructor, name="register_instructor"),
    path("api/login/", views.login, name="login"),

    path("api/students/import_csv/", views.import_students_csv, name="import_students_csv"),
    path("api/students/export_csv/", views.students_export_csv, name="students_export_csv"),
    path("api/students/", views.students_list, name="students_list"),
    path("api/products/", views.products_list, name="products_list"),
    path("api/students/<int:student_id>/activities/", views.student_activities, name="student_activities"),

    path("api/products/create/", views.create_product, name="create_product"),
    path("api/products/<int:product_id>/", views.update_product, name="update_product"),

    path("api/purchases/create/", views.create_purchase, name="create_purchase"),
    path("api/purchases/<int:purchase_id>/", views.update_purchase, name="update_purchase"),
]
