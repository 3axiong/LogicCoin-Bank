import csv
import os
import django

os.environ.setdefault("DJANGO_SETTINGS_MODULE", "setup.settings")
django.setup()

from django.contrib.auth.hashers import make_password
from api.models import Student

INPUT_FILE = "students_passwords.csv"

def main():
    created = 0
    updated = 0

    with open(INPUT_FILE, newline="", encoding="utf-8") as infile:
        reader = csv.DictReader(infile)

        for row in reader:
            name = row["name"].strip()
            email = row["email"].strip().lower()
            section = row["section"].strip()
            raw_password = row["password"].strip()

            student, was_created = Student.objects.get_or_create(
                email=email,
                defaults={
                    "name": name,
                    "section": section,
                    "available_coins": 0,
                    "password": make_password(raw_password),
                }
            )

            if was_created:
                created += 1
            else:
                student.name = name
                student.section = section
                student.password = make_password(raw_password)
                student.save()
                updated += 1

    print(f"Created: {created}")
    print(f"Updated: {updated}")

if __name__ == "__main__":
    main()
