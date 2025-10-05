'''
You must run the backend in a virtual environment to ensure that the dependencies are properly managed and isolated from your global Python installation.

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
'''


from flask import Flask, request, Response, redirect
from werkzeug.security import generate_password_hash, check_password_hash
from flask_sqlalchemy import SQLAlchemy


app = Flask(__name__)

app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///users.sqlite3'
app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False

db = SQLAlchemy(app)

#Class for creating a new user.
class Student(db.Model):
    __tablename__ = 'students'
    #Unique id for each user
    id = db.Column("id", db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    password = db.Column(db.String(200), nullable=False)
    #Class and user information
    email = db.Column(db.String(100), unique=True, nullable=False)
    available_coins = db.Column(db.Integer, default=0)

#React front end should send json data with student name to this route to get the balance of coins for the student.
@app.route('/balance', methods=['POST'])
def coinbalance():
    data = request.get_json()
    student = Student.query.filter_by(email=data['name']).first()
    if not student:
        return {"message": "Student not found"}
    return {"available_coins": student.available_coins}

#React front end should send json data with student name and amount to this route to award coins to the student.
@app.route('/awardCoins', methods=['POST'])
def awardCoins():
    data = request.get_json()
    student = Student.query.filter_by(email=data['name']).first()
    if not student:
        return {"message": "Student not found"}
    
    student.available_coins += data['amount']
    db.session.commit()
    
    return {"message": "Coins awarded successfully", "available_coins": student.available_coins}

#React front end should send json data with student name and amount to this route to make a transaction.
@app.route('/transaction', methods=['POST'])
def transaction():
    data = request.get_json()
    student = Student.query.filter_by(email=data['name']).first()
    if not student:
        return {"message": "Student not found"}
    
    if student.available_coins < data['amount']:
        return {"message": "Insufficient balance"}
    
    student.available_coins -= data['amount']
    db.session.commit()
    
    return {"message": "Transaction successful", "available_coins": student.available_coins}

#React front end should send json data to this route to add the student to the database.
@app.route('/register', methods=['POST'])
def register():
    data = request.get_json()

    hashed_password = generate_password_hash(data['password'], method='sha256')
    new_user = Student(email=data['email'], password=hashed_password)

    db.session.add(new_user)
    db.session.commit()

    return {"message": "registered successfully"}

#React front end should send json data to this route to verify the student account exists.
@app.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    user = Student.query.filter_by(email=data['email']).first()

    if not user:
        return {"message": "Student not found"}

    if check_password_hash(user.password, data['password']):
        return {"message": "login successful"}
    else:
        return {"message": "wrong password"}


if __name__ == '__main__':
    #Creates instance of database in current flask context. 
    with app.app_context():
        db.drop_all()
        db.create_all()

    app.run(host='0.0.0.0', port=5000, debug=True)
