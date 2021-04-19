"""
Flask Documentation:     http://flask.pocoo.org/docs/
Jinja2 Documentation:    http://jinja.pocoo.org/2/documentation/
Werkzeug Documentation:  http://werkzeug.pocoo.org/documentation/
This file creates your application.
"""
import os, datetime
from app import app
from flask import render_template, request, redirect, url_for, flash, send_from_directory, jsonify
from werkzeug.utils import secure_filename
from .forms import RegistrationForm, LoginForm, AddNewCarForm


###
# Routing for your application.
###

@app.route('/')
def home():
    """Render website's home page."""
    return render_template('home.html')


@app.route('/about/')
def about():
    """Render the website's about page."""
    return render_template('about.html', name="Logan Halsall")


@app.route('/uploads/<filename>')
def get_image(filename):
    root_dir = os.getcwd()
    return send_from_directory(os.path.join(root_dir, app.config['UPLOAD_FOLDER']), filename)


@app.route('/files')
def files():
    filenames = get_uploaded_images()
    return render_template('files.html', filenames=filenames)


def get_uploaded_images():
    rootdir = os.getcwd()
    filenames = []
    for subdir, dirs, files in os.walk(rootdir + app.config['UPLOAD_FOLDER'][1:]):
        for file in files:
            filenames.append(file)
    return filenames


"""
Start of project2 bit.
"""
#Accepts user information and saves it to the database.
#HTTP Method: 'POST'
@app.route('/api/register', methods=['POST', 'GET'])
def register():

    form = RegistrationForm()

    if request.method == 'POST' and form.validate_on_submit():
        username = form.username.data
        password = form.password.data
        name = form.name.data
        email = form.email.data
        location = form.location.data
        biography = form.biography.data
        photo = form.photo.data
        filename = secure_filename(photo.filename)
        photo.save(os.path.join(app.config['UPLOAD_FOLDER'], filename))
        date_joined = datetime.datetime.now().strftime("%Y-%m-%d %H:%M:%S")

        new_user = {
            'message': 'User Registration Successful.',
            'username': username,
            'password': password,
            'name': name,
            'email': email,
            'location': location,
            'biography': biography,
            'filename': filename,
            'date_joined': date_joined
        }
        return jsonify(new_user=new_user)
    """
    else:
        errors = form_errors(form)
        return jsonify(errors=errors)
    """
    return render_template("registration_form.html", form=form)


#Accepts login credentials as username and password.
#HTTP Method: 'POST'
@app.route('/api/auth/login', methods=['GET', 'POST'])
def login():

    #if current_user.is_authenticated:

    form = LoginForm()

    if request.method == 'POST' and form.validate_on_submit():
        if form.username.data:
            username = form.username.data
            password = form.password.data

            message = '{0} Successfully Logged In.'.format(username)

            login = {
                'message': message,
            }
            return jsonify(login=login)
    """        
    else:
        errors = form_errors(form)
        return jsonify(errors=errors)
    """        
    return render_template("login_form.html", form=form)


#Logout a user.
#HTTP Method: 'POST'
@app.route('/api/auth/logout', methods=['POST'])
def logout():
    if request.method == 'POST':
        #logout_user()
        return 3


#Return all cars ['GET'] or add new cars ['POST'].
#HTTP Method: 'GET' OR 'POST'
@app.route('/api/cars', methods=['GET', 'POST'])
def cars():

    form = AddNewCarForm()

    if request.method == 'POST' and form.validate_on_submit():
        description = form.description.data
        make = form.make.data
        model = form.model.data
        colour = form.colour.data
        year = form.year.data
        transmission = form.transmission.data
        car_type = form.car_type.data
        price = form.price.data
        photo = form.photo.data
        filename = secure_filename(photo.filename)
        photo.save(os.path.join(app.config['UPLOAD_FOLDER'], filename))

        new_car = {
            'message': 'New Car Added.',
            'description': description,
            'make': make,
            'model': model,
            'colour': colour,
            'year': year,
            'transmission': transmission,
            'car_type': car_type,
            'price': price,
            'filename': filename
        }
        return jsonify(new_car=new_car)
    """
    else:
        errors = form_errors(form)
        return jsonify(errors=errors)
    """
    return render_template("add_new_car_form.html", form=form)


#Get Details of a specific car.
#HTTP Method: 'GET'
@app.route('/api/cars/<car_id>', methods=['GET'])
def get_car():
    if request.method == 'GET':
        return 6


#Add car to Favourites for logged in user.
#HTTP Method: 'POST'
@app.route('/api/cars/<car_id>/favourite', methods=['POST'])
def add_favourite():
    if request.method == 'POST':
        return 7


#Search for cars by make or model.
#HTTP Method: 'GET'
@app.route('/api/search', methods=['GET'])
def search():
    if request.method == 'GET':
        return 8


#Get Details of a user.
#HTTP Method: 'GET'
@app.route('/api/users/<user_id>', methods=['GET'])
def get_user():
    if request.method == 'GET':
        return 9


#Get cars that a user has favourited.
#HTTP Method: 'GET'
@app.route('/api/users/<user_id>/favourites', methods=['GET'])
def get_favourites(user_id):
    if request.method == 'GET':
        return 10


# Here we define a function to collect form errors from Flask-WTF
# which we can later use
def form_errors(form):
    error_messages = []
    """Collects form errors"""
    for field, errors in form.errors.items():
        for error in errors:
            message = u"Error in the %s field - %s" % (
                    getattr(form, field).label.text,
                    error
                )
            error_messages.append(message)

    return error_messages

###
# The functions below should be applicable to all Flask apps.
###

# Flash errors from the form if validation fails
def flash_errors(form):
    for field, errors in form.errors.items():
        for error in errors:
            flash(u"Error in the %s field - %s" % (
                getattr(form, field).label.text,
                error), 'danger')

@app.route('/<file_name>.txt')
def send_text_file(file_name):
    """Send your static text file."""
    file_dot_text = file_name + '.txt'
    return app.send_static_file(file_dot_text)


@app.after_request
def add_header(response):
    """
    Add headers to both force latest IE rendering engine or Chrome Frame,
    and also to cache the rendered page for 10 minutes.
    """
    response.headers['X-UA-Compatible'] = 'IE=Edge,chrome=1'
    response.headers['Cache-Control'] = 'public, max-age=0'
    return response


@app.errorhandler(404)
def page_not_found(error):
    """Custom 404 page."""
    return render_template('404.html'), 404


if __name__ == '__main__':
    app.run(debug=True, host="0.0.0.0", port="8080")
