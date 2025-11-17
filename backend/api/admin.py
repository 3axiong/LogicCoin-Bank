from django.contrib import admin
from .models import Student


@admin.register(Student)
class StudentAdmin(admin.ModelAdmin):
	list_display = ('email', 'name', 'available_coins')
	search_fields = ('email', 'name')
