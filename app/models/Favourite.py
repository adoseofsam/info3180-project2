from app import db
from werkzeug.security import generate_password_hash
from datetime import datetime
 
class Favourite(db.Model):
    # You can use this to change the table name. The default convention is to use
    # the class name. In this case a class name of UserProfile would create a
    # user_profile (singular) table, but if we specify __tablename__ we can change it
    # to `user_profiles` (plural) or some other name.
    __tablename__ = 'Favourite'
 
    id = db.Column(db.Integer, primary_key=True, autoincrement = True)
    car_id = db.Column(db.Integer, db.ForeignKey("car.id"))
    user_id = db.Column(db.Integer,db.ForeignKey("user.id"))