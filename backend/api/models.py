from django.db import models
from django.contrib.auth.hashers import make_password, identify_hasher


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
     
	def save(self, *args, **kwargs):
		if self.password:
			try:
                # Will raise an error if password is not already hashed
				identify_hasher(self.password)
			except Exception:
                # If plain text, hash it before saving
				self.password = make_password(self.password)
		return super().save(*args, **kwargs)
	
	@property
	def balance(self):
        # Expose available_coins as "balance" for the frontend
		return self.available_coins

	def __str__(self):
		return f"{self.email} ({self.available_coins} coins)"

# Product table
class Product(models.Model):
    class Meta:
        db_table = 'products'
        ordering = ['name']

    name = models.CharField(max_length=100, unique=True)
    description = models.TextField(blank=True, null=True)
    price = models.PositiveIntegerField()
    terms = models.JSONField(default=list, blank=True)
    is_active = models.BooleanField(default=True)  

    def __str__(self):
        return f"{self.name} ({self.price} coins)"


# Purchase table
class Purchase(models.Model):
    class Meta:
        db_table = 'purchases'
        ordering = ['-date']

    student = models.ForeignKey('Student', on_delete=models.CASCADE, related_name='purchases')
    product = models.ForeignKey('Product', on_delete=models.PROTECT, related_name='purchases')# prevent deleting products that were bought

    product_name = models.CharField(max_length=100)          
    unit_price_at_purchase = models.PositiveIntegerField()      
    quantity = models.PositiveIntegerField(default=1)

    amount = models.PositiveIntegerField()
    refunded = models.BooleanField(default=False)                 
    description = models.CharField(max_length=120, blank=True)   
    date = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.student.name} • {self.quantity}× {self.product_name} • {self.amount} coins"
