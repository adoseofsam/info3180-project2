from flask_wtf import FlaskForm
from wtforms import StringField, PasswordField, TextAreaField, SelectField
from wtforms.validators import InputRequired, Email, Optional
from flask_wtf.file import FileField, FileRequired, FileAllowed

"""
Start of project2 bit.
"""
class RegistrationForm(FlaskForm):
    username = StringField('Username', validators=[InputRequired()])
    password = PasswordField('Password', validators=[InputRequired()])
    fullName = StringField('FullName', validators=[InputRequired()])
    email = StringField('Email', validators=[InputRequired(), Email()])
    location = StringField('Location', validators=[InputRequired()])
    biography = TextAreaField('Biography', validators=[InputRequired()])
    photo = FileField('Photo', validators=[FileRequired(), FileAllowed(['jpg', 'jpeg', 'png'], 'Images only!')])


class LoginForm(FlaskForm):
    username = StringField('Username', validators=[InputRequired()])
    password = PasswordField('Password', validators=[InputRequired()])


class AddNewCarForm(FlaskForm):
    description = TextAreaField('Description', validators=[InputRequired()])
    make = StringField('Make', validators=[InputRequired()])
    model = StringField('Model', validators=[InputRequired()])
    colour = StringField('Colour', validators=[InputRequired()])
    year = StringField('Year', validators=[InputRequired()])
    transmission = SelectField('Transmission', choices=[('Automatic'), ('Manual')])
    car_type = SelectField(u'Car Type', choices=[('Coupe'), ('Sedan'), ('HatchBack'), ('SUV'), ('Van'), ('MiniVan'), ('Truck')])
    price = StringField('Price', validators=[InputRequired()])
    photo = FileField('Photo', validators=[FileRequired(), FileAllowed(['jpg', 'png', 'jpeg','Images only!'])])