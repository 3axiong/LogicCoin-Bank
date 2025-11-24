import os, django
os.environ.setdefault("DJANGO_SETTINGS_MODULE", "setup.settings")
django.setup()

from django.contrib.auth.hashers import make_password
from api.models import Student

email = "student@example.com"
if not Student.objects.filter(email=email).exists():
    Student.objects.create(
        name="Bob",
        email=email,
        password=make_password("test123"),  
        available_coins=300
    )
    print("Seeded:", email, "password=test123")
else:
    print("Already exists:", email)
