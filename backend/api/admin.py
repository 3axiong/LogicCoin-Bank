from django.contrib import admin
from .models import Student, Instructors, Product, Purchase


@admin.register(Student)
class StudentAdmin(admin.ModelAdmin):
    list_display = ('email', 'name', 'available_coins')
    search_fields = ('email', 'name')


@admin.register(Instructors)
class InstructorAdmin(admin.ModelAdmin):
    list_display = ('email', 'name')
    search_fields = ('email', 'name')


@admin.register(Product)
class ProductAdmin(admin.ModelAdmin):
    list_display = ('name', 'price', 'is_active')
    list_filter = ('is_active',)
    search_fields = ('name',)


@admin.register(Purchase)
class PurchaseAdmin(admin.ModelAdmin):
    list_display = (
        'student',
        'product_name',
        'quantity',
        'amount',
        'refunded',
        'date',
    )
    list_filter = ('refunded', 'date')
    search_fields = ('student__email', 'product_name')
