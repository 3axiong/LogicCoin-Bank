from django.http import JsonResponse, Http404
from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.http import require_GET, require_http_methods
import json
from django.contrib.auth.hashers import make_password, check_password, identify_hasher

from .models import Student, Product, Purchase, Instructors

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
def register_student(request):
    if request.method != 'POST':
        return JsonResponse({'error': 'POST only'}, status=405)
    try:
        data = json.loads(request.body.decode('utf-8'))
    except Exception:
        return JsonResponse({'error': 'Invalid JSON'}, status=400)

    name = data.get('name')
    email = data.get('email')
    password = data.get('password')
    coins = int(data.get('available_coins', 0))

    if not all([name, email, password]):
        return JsonResponse({'error': 'Missing required fields'}, status=400)

    if Student.objects.filter(email=email).exists():
        return JsonResponse({'error': 'Email already registered'}, status=409)

    s = Student.objects.create(
        name=name,
        email=email,
        password=make_password(password),
        available_coins=coins,
    )
    return JsonResponse({'message': 'registered', 'id': s.id}, status=201)

@csrf_exempt
def register_instructor(request):
    if request.method != 'POST':
        return JsonResponse({'error': 'POST only'}, status=405)
    try:
        data = json.loads(request.body.decode('utf-8'))
    except Exception:
        return JsonResponse({'error': 'Invalid JSON'}, status=400)

    name = data.get('name')
    email = data.get('email')
    password = data.get('password')

    if not all([name, email, password]):
        return JsonResponse({'error': 'Missing required fields'}, status=400)

    if Instructors.objects.filter(email=email).exists():
        return JsonResponse({'error': 'Email already registered'}, status=409)

    i = Instructors.objects.create(
        name=name,
        email=email,
        password=make_password(password),
    )
    return JsonResponse({'message': 'registered', 'id': i.id}, status=201)

@csrf_exempt
def login(request):
    if request.method != 'POST':
        return JsonResponse({'error': 'POST only'}, status=405)
    try:
        data = json.loads(request.body.decode('utf-8'))
    except Exception:
        return JsonResponse({'error': 'Invalid JSON'}, status=400)

    email = data.get('email')
    password = data.get('password')
    if not email or not password:
        return JsonResponse({'error': 'Missing email or password'}, status=400)
    # Try to find both Student and Instructor accounts with this email
    student_user = None
    instructor_user = None
    try:
        student_user = Student.objects.get(email=email)
    except Student.DoesNotExist:
        student_user = None

    try:
        instructor_user = Instructors.objects.get(email=email)
    except Instructors.DoesNotExist:
        instructor_user = None

    # If both account types exist for this email we require the client to specify role to disambiguate
    requested_role = (data.get('role') or '').lower()
    if student_user and instructor_user:
        if requested_role not in ('student', 'instructor'):
            return JsonResponse({'error': 'Conflicting emails for Student and Instructor'}, status=409)
        role = requested_role
        user = student_user if role == 'student' else instructor_user
    else:
        # only one exists
        if student_user:
            user = student_user
            role = 'student'
        elif instructor_user:
            user = instructor_user
            role = 'instructor'
        else:
            return JsonResponse({'error': 'User not found'}, status=404)

    # verify password
    if not check_password(password, user.password):
        return JsonResponse({'error': 'Wrong password'}, status=401)

    # Build response depending on role
    if role == 'student':
        return JsonResponse({
            'ok': True,
            'id': user.id,
            'name': user.name,
            'email': user.email,
            'role': 'student',
            'available_coins': user.available_coins,
        }, status=200)
    else:
        return JsonResponse({
            'ok': True,
            'id': user.id,
            'name': user.name,
            'email': user.email,
            'role': 'instructor',
        }, status=200)
	
def _json_request(request):
	try:
		return json.loads(request.body.decode('utf-8'))
	except Exception:
		return {}
     
def _parse_json(request):
    try:
        return json.loads(request.body.decode("utf-8"))
    except Exception:
        return {}
    
@csrf_exempt
@require_http_methods(["POST"])
def create_product(request):
    data = _parse_json(request)
    name = (data.get("name") or "").strip()
    price = data.get("price")
    description = (data.get("description") or "").strip()
    terms = data.get("terms") or []

    if not name or price is None or int(price) < 0:
        return JsonResponse({"error": "name and non-negative price required"}, status=400)

    from .models import Product
    p = Product.objects.create(
        name=name,
        price=int(price),
        description=description,
        terms=terms,
        is_active=True,
    )
    return JsonResponse({
        "id": p.id, "name": p.name, "price": p.price,
        "description": p.description or "", "terms": p.terms or []
    }, status=201)

@csrf_exempt
@require_http_methods(["PATCH", "PUT"])
def update_product(request, product_id: int):
    from .models import Product
    try:
        p = Product.objects.get(pk=product_id)
    except Product.DoesNotExist:
        return JsonResponse({"error": "not found"}, status=404)

    data = _parse_json(request)
    if "name" in data: p.name = (data["name"] or "").strip()
    if "price" in data:
        try:
            val = int(data["price"])
            if val < 0: raise ValueError()
            p.price = val
        except Exception:
            return JsonResponse({"error": "price must be non-negative int"}, status=400)
    if "description" in data: p.description = (data["description"] or "").strip()
    if "terms" in data: p.terms = data["terms"] or []
    if "is_active" in data: p.is_active = bool(data["is_active"])
    p.save()

    return JsonResponse({
        "id": p.id, "name": p.name, "price": p.price,
        "description": p.description or "", "terms": p.terms or [], "is_active": p.is_active
    })
@csrf_exempt
@require_http_methods(["POST"])
def create_purchase(request):
    from .models import Student, Product, Purchase
    data = _parse_json(request)
    student_id = data.get("studentId")
    product_id = data.get("productId")
    quantity = int(data.get("quantity", 1))
    description = (data.get("description") or "").strip()

    if not student_id or not product_id or quantity <= 0:
        return JsonResponse({"error": "studentId, productId, quantity>0 required"}, status=400)

    try:
        s = Student.objects.get(pk=student_id)
        p = Product.objects.get(pk=product_id)
    except (Student.DoesNotExist, Product.DoesNotExist):
        return JsonResponse({"error": "student or product not found"}, status=404)

    total = p.price * quantity
    if s.available_coins < total:
        return JsonResponse({"error": "insufficient balance", "balance": s.available_coins}, status=400)

    # deduct balance
    s.available_coins -= total
    s.save()

    x = Purchase.objects.create(
        student=s,
        product=p,
        product_name=p.name,
        unit_price_at_purchase=p.price,
        quantity=quantity,
        amount=total,
        description=description,
    )

    return JsonResponse({
        "id": x.id,
        "studentId": x.student_id,
        "product": x.product_name,
        "date": x.date.isoformat(),
        "amount": x.amount,
        "refunded": x.refunded,
        "description": x.description or "",
        "balance": s.available_coins,  # updated balance for UI
    }, status=201)
@csrf_exempt
@require_http_methods(["PATCH", "PUT"])
def update_purchase(request, purchase_id: int):
    from .models import Purchase, Student
    try:
        x = Purchase.objects.select_related("student").get(pk=purchase_id)
    except Purchase.DoesNotExist:
        return JsonResponse({"error": "not found"}, status=404)

    data = _parse_json(request)

    # Refund
    if data.get("refund") is True and not x.refunded:
        x.refunded = True
        # return amount to student
        s = x.student
        s.available_coins += x.amount
        s.save()
        x.save()
        return JsonResponse({
            "id": x.id, "refunded": True, "amount": x.amount,
            "studentId": x.student_id, "product": x.product_name,
            "date": x.date.isoformat(), "description": x.description or "",
            "balance": s.available_coins
        })

    # Edit amount (adjust student balance for delta, if not refunded)
    if "amount" in data:
        try:
            new_amt = int(data["amount"])
            if new_amt < 0: raise ValueError()
        except Exception:
            return JsonResponse({"error": "amount must be non-negative int"}, status=400)

        if x.refunded:
            return JsonResponse({"error": "cannot edit a refunded purchase"}, status=400)

        delta = x.amount - new_amt  # positive delta → give back coins
        s = x.student
        # Apply delta (ensure no negative balance violation)
        if delta < 0 and s.available_coins < abs(delta):
            return JsonResponse({"error": "insufficient balance to increase amount", "balance": s.available_coins}, status=400)
        s.available_coins += delta
        s.save()

        x.amount = new_amt
        x.save()

        return JsonResponse({
            "id": x.id, "refunded": x.refunded, "amount": x.amount,
            "studentId": x.student_id, "product": x.product_name,
            "date": x.date.isoformat(), "description": x.description or "",
            "balance": s.available_coins
        })

    return JsonResponse({"error": "nothing to update"}, status=400)

#Excepts POST requests to obtain coin balance of a student
@csrf_exempt
def coinbalance(request):
    if request.method != 'GET':
        return JsonResponse({'error': 'GET only'}, status=405)
    email = request.GET.get('email')
    if not email:
        return JsonResponse({'error': 'email query param required'}, status=400)
    try:
        user = Student.objects.get(email=email)
    except Student.DoesNotExist:
        return JsonResponse({'error': 'Student not found'}, status=404)
    return JsonResponse({'email': user.email, 'available_coins': user.available_coins}, status=200)
#Excepts POST requests to award coins to a student
@csrf_exempt
def awardCoins(request):
    if request.method != 'POST':
        return JsonResponse({'error': 'POST only'}, status=405)
    try:
        data = json.loads(request.body.decode('utf-8'))
    except Exception:
        return JsonResponse({'error': 'Invalid JSON'}, status=400)
    email = data.get('email')
    delta = int(data.get('delta', 0))
    try:
        user = Student.objects.get(email=email)
    except Student.DoesNotExist:
        return JsonResponse({'error': 'Student not found'}, status=404)
    user.available_coins = max(0, user.available_coins + delta)
    user.save()
    return JsonResponse({'ok': True, 'available_coins': user.available_coins}, status=200)

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

def _student_json(s: Student):
    return {
        "id": s.id,
        "name": s.name,
        "balance": s.balance,  # maps to available_coins 
    }

def _product_json(p: Product):
    return {
        "id": p.id,
        "name": p.name,
        "price": p.price,
        "description": p.description or "",
        "terms": p.terms or [],  # JSONField on Product
    }

def _activity_json(x: Purchase):
    return {
        "id": x.id,
        "studentId": x.student_id,
        "product": x.product_name,      
        "date": x.date.isoformat(),
        "amount": x.amount,
        "refunded": x.refunded,
        "description": x.description or "",
    }

@require_GET
def students_list(request):
    data = [_student_json(s) for s in Student.objects.order_by("name")]
    return JsonResponse(data, safe=False)

@require_GET
def products_list(request):
    data = [_product_json(p) for p in Product.objects.filter(is_active=True).order_by("name")]
    return JsonResponse(data, safe=False)

@require_GET
def student_activities(request, student_id: int):
    # 404 if student doesn't exist
    if not Student.objects.filter(pk=student_id).exists():
        raise Http404("Student not found")
    qs = Purchase.objects.filter(student_id=student_id).order_by("-date")
    data = [_activity_json(x) for x in qs]
    return JsonResponse(data, safe=False)
