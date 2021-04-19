from app import db
from werkzeug.security import generate_password_hash
from datetime import datetime
 
 
class Car(db.Model):
    # You can use this to change the table name. The default convention is to use
    # the class name. In this case a class name of UserProfile would create a
    # user_profile (singular) table, but if we specify __tablename__ we can change it
    # to `user_profiles` (plural) or some other name.
    __tablename__ = "car"
 
    id = db.Column(db.Integer, primary_key=True, autoincrement = True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'))
 
    description = db.Column(db.String(255))
    model = db.Column(db.String(255))
    make = db.Column(db.String(255))
    colour = db.Column(db.String(255))
    year = db.Column(db.String(255))
    transmission = db.Column(db.String(255))
    car_type = db.Column(db.String(255))
    price = db.Column(db.Float)
    photo = db.Column(db.String(255))
 
    def __init__(self, user_id, photo, model, year, transmission, car_type, price, colour,make,description, ):
        self.description = description
        self.user_id = user_id
        self.make = make
        self.model = model
        self.colour = colour
        self.year = year
        self.transmission = transmission
        self.car_type = car_type
        self.price = price
        self.photo = photo
 
    def to_json(self):
        return {
            "user_id": self.user_id,
            "make": self.make,
            "model": self.model,
            "colour": self.colour,
            "year": self.year,
            "transmission": self.transmission,
            "car_type": self.car_type,
            "price": self.price,
            "photo": self.photo,
        }