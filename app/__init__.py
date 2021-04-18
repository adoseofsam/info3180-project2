from flask import Flask
from app.config import Config
from flask_sqlalchemy import SQLAlchemy
from flask_wtf.csrf import CSRFProtect 

app = Flask(__name__)
db = SQLAlchemy(app)
app.config.from_object(Config)
csrf = CSRFProtect(app)

from app import views