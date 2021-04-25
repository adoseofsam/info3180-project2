from app import db
from werkzeug.security import generate_password_hash
from datetime import datetime

class Cars(db.Model):
 
    id = db.Column(db.Integer, primary_key=True, autoincrement = True)
    description = db.Column(db.String(2000))
    make = db.Column(db.String(255))
    model = db.Column(db.String(255))
    colour = db.Column(db.String(255))
    year = db.Column(db.String(255))
    transmission = db.Column(db.String(255))
    car_type = db.Column(db.String(255))
    price = db.Column(db.Float)
    photo = db.Column(db.String(255))
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'))
 
    def __init__(self, description, make, model, colour, year, transmission, car_type, price, photo, user_id):
        self.description = description
        self.make = make
        self.model = model
        self.colour = colour
        self.year = year
        self.transmission = transmission
        self.car_type = car_type
        self.price = price
        self.photo = photo
        self.user_id = user_id
 
    def to_json(self):
        return {
            "description": self.description,
            "make": self.make,
            "model": self.model,
            "colour": self.colour,
            "year": self.year,
            "transmission": self.transmission,
            "car_type": self.car_type,
            "price": self.price,
            "photo": self.photo,
            "user_id": self.user_id
        }

    def get_id(self):
        try:
            return unicode(self.id)  # python 2 support
        except NameError:
            return str(self.id)  # python 3 support

    def __repr__(self):
        represent = '{0} - {1}'.format(self.make, self.model)
        return represent

class Users(db.Model):

    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(255), unique=True)
    password = db.Column(db.String(255))
    fullName = db.Column(db.String(255))
    email = db.Column(db.String(255))
    location = db.Column(db.String(255))
    biography = db.Column(db.String(2000))
    photo = db.Column(db.String(255))
    date_joined = db.Column(db.DateTime, default=datetime.utcnow)

    def __init__(self, username, password, fullName, email, location, biography, photo):
        self.username = username
        self.password = generate_password_hash(password, method='pbkdf2:sha256')
        self.fullName = fullName
        self.email = email
        self.location = location
        self.biography = biography
        self.photo = photo

    def to_json(self):
        return {
            "username": self.username,
            "fullName": self.fullName,
            "password": self.password,
            "email": self.email,
            "location": self.location,
            "biography": self.biography,
            "photo": self.photo,
            "date_joined": self.date_joined
        }

    def is_authenticated(self):
        return True

    def is_active(self):
        return True

    def is_anonymous(self):
        return False

    def get_id(self):
        try:
            return unicode(self.id)  # python 2 support
        except NameError:
            return str(self.id)  # python 3 support

    def __repr__(self):
        return '<User %r>' % self.username

class Favourites(db.Model):
 
    id = db.Column(db.Integer, primary_key=True, autoincrement = True)
    car_id = db.Column(db.Integer, db.ForeignKey("cars.id"))
    user_id = db.Column(db.Integer,db.ForeignKey("users.id"))

    def __init__(self, car_id, user_id):
        self.car_id = car_id
        self.user_id = user_id

    def to_json(self):
        return {
            "car_id": self.car_id,
            "user_id": self.user_id
        }

    def get_id(self):
        try:
            return unicode(self.id)  # python 2 support
        except NameError:
            return str(self.id)  # python 3 support

    def __repr__(self):
        represent = '{0} - {1}'.format(self.car_id, self.user_id)
        return represent
