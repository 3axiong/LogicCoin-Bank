from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
import json
from django.contrib.auth.hashers import make_password, check_password

from .models import Student

'''
You must run the backend in a virtual environment to ensure that the dependencies are properly managed and isolated from your global Python installation.
venv is in the gitignore file so each developer can create their own virtual environment without affecting others.

Creating and Starting a virtual environment (MaxOS/Linux)
blue_berry@DESKTOP-66SRABT:/mnt/c/LogicCoin/logic-coin-app/api$ python3 -m venv venv
blue_berry@DESKTOP-66SRABT:/mnt/c/LogicCoin/logic-coin-app/api$ source venv/bin/activate

Creating and Starting a virtual environment (Windows)
InkaDinka@DESKTOP-66SRABT MINGW64 ~/LogicCoin/LogicCoin-Bank/backend (main)
$ python -m venv venv
InkaDinka@DESKTOP-66SRABT MINGW64 ~/LogicCoin/LogicCoin-Bank/backend (main)
$ source venv/Scripts/activate
(venv) 

NOTE: Once the virtual environment is activated, you can install the required packages using pip:
      InkaDinka@DESKTOP-66SRABT MINGW64 ~/LogicCoin/LogicCoin-Bank/backend (main)
      $ pip install -r requirements.txt 

To exit the virual environment (Windows & MaxOS/Linux)
InkaDinka@DESKTOP-66SRABT MINGW64 ~/LogicCoin/LogicCoin-Bank/backend (main)
$ deactivate

To run the backend server (Windows & MaxOS/Linux)
InkaDinka@DESKTOP-66SRABT MINGW64 ~/LogicCoin/LogicCoin-Bank/backend (app_backend)
$ python manage.py runserver
'''

# Every route added here must also be added to api/urls.py as a path

def _json_request(request):
	try:
		return json.loads(request.body.decode('utf-8'))
	except Exception:
		return {}

#Excepts POST requests to obtain coin balance of a student
@csrf_exempt
def coinbalance(request):
	if request.method != 'POST':
		return JsonResponse({'message': 'Method not allowed'}, status=405)

	data = _json_request(request)
	email = data.get('name') or data.get('email')
	if not email:
		return JsonResponse({'message': 'Missing name/email'}, status=400)

	try:
		student = Student.objects.get(email=email)
	except Student.DoesNotExist:
		return JsonResponse({'message': 'Student not found'}, status=404)

	return JsonResponse({'available_coins': student.available_coins})

#Excepts POST requests to award coins to a student
@csrf_exempt
def awardCoins(request):
	if request.method != 'POST':
		return JsonResponse({'message': 'Method not allowed'}, status=405)

	data = _json_request(request)
	email = data.get('name') or data.get('email')
	amount = data.get('amount')
	if not email or amount is None:
		return JsonResponse({'message': 'Missing name/email or amount'}, status=400)

	try:
		student = Student.objects.get(email=email)
	except Student.DoesNotExist:
		return JsonResponse({'message': 'Student not found'}, status=404)

	try:
		amt = int(amount)
	except (TypeError, ValueError):
		return JsonResponse({'message': 'Invalid amount'}, status=400)

	student.available_coins += amt
	student.save()

	return JsonResponse({'message': 'Coins awarded successfully', 'available_coins': student.available_coins})

#Excepts POST requests to deduct coins from a student for transactions
@csrf_exempt
def transaction(request):
	if request.method != 'POST':
		return JsonResponse({'message': 'Method not allowed'}, status=405)

	data = _json_request(request)
	email = data.get('name') or data.get('email')
	amount = data.get('amount')
	if not email or amount is None:
		return JsonResponse({'message': 'Missing name/email or amount'}, status=400)

	try:
		student = Student.objects.get(email=email)
	except Student.DoesNotExist:
		return JsonResponse({'message': 'Student not found'}, status=404)

	try:
		amt = int(amount)
	except (TypeError, ValueError):
		return JsonResponse({'message': 'Invalid amount'}, status=400)

	if student.available_coins < amt:
		return JsonResponse({'message': 'Insufficient balance'}, status=400)

	student.available_coins -= amt
	student.save()

	return JsonResponse({'message': 'Transaction successful', 'available_coins': student.available_coins})

# Possible future routes for user register/login
'''
@csrf_exempt
def register(request):
	if request.method != 'POST':
		return JsonResponse({'message': 'Method not allowed'}, status=405)

	data = _json_request(request)
	email = data.get('email')
	password = data.get('password')
	if not email or not password:
		return JsonResponse({'message': 'Missing email or password'}, status=400)

	if Student.objects.filter(email=email).exists():
		return JsonResponse({'message': 'User already exists'}, status=400)

	hashed = make_password(password)
	student = Student(email=email, password=hashed)
	student.save()

	return JsonResponse({'message': 'registered successfully'})


@csrf_exempt
def login(request):
	if request.method != 'POST':
		return JsonResponse({'message': 'Method not allowed'}, status=405)

	data = _json_request(request)
	email = data.get('email')
	password = data.get('password')
	if not email or not password:
		return JsonResponse({'message': 'Missing email or password'}, status=400)

	try:
		user = Student.objects.get(email=email)
	except Student.DoesNotExist:
		return JsonResponse({'message': 'Student not found'}, status=404)

	if check_password(password, user.password):
		return JsonResponse({'message': 'login successful'})
	else:
		return JsonResponse({'message': 'wrong password'}, status=400)
'''