from app import db
from werkzeug.security import generate_password_hash
from datetime import datetime


class User(db.Model):
    # You can use this to change the table name. The default convention is to use
    # the class name. In this case a class name of UserProfile would create a
    # user_profile (singular) table, but if we specify __tablename__ we can change it
    # to `user_profiles` (plural) or some other name.
    __tablename__ = "user"

    id = db.Column(db.Integer, primary_key=True, autoincrement = True)
    first_name = db.Column(db.String(80))
    last_name = db.Column(db.String(80))
    username = db.Column(db.String(80), unique=True)
    email = db.Column(db.String(255))
    password = db.Column(db.String(255))
    photo = db.Column(db.String(255))
    location = db.Column(db.String(255))
    biography = db.Column(db.String(255))
    date_joined = db.Column(db.DateTime, default=datetime.utcnow)

    def __init__(
        self,
        first_name,
        last_name,
        username,
        password,
        photo,
        location,
        biography,
        email,
    ):
        self.first_name = first_name
        self.last_name = last_name
        self.username = username
        self.password = generate_password_hash(password, method="pbkdf2:sha256")
        self.photo = photo
        self.location = location
        self.biography = biography
        self.email = email

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
        return "<User %r>" % (self.username)

    def to_json(self):
        return {
            "id": self.id,
            "first_name": self.first_name,
            "last_name": self.last_name,
            "username": self.username,
            "photo": self.photo,
            "location": self.location,
            "biography": self.biography,
            "email": self.email,
            "date_joined": self.date_joined

        }