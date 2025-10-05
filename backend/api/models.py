from django.db import models


# Student model matching the Flask `Student` table in app.py
class Student(models.Model):
	class Meta:
		db_table = 'students'

	# Unique id for each user (auto primary key)
	id = models.AutoField(primary_key=True)
	name = models.CharField(max_length=100)
	password = models.CharField(max_length=200)
	# Class and user information
	email = models.EmailField(max_length=100, unique=True)
	available_coins = models.IntegerField(default=0)

	def __str__(self):
		return f"{self.email} ({self.available_coins} coins)"
