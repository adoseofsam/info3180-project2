"""
Flask Documentation:     http://flask.pocoo.org/docs/
Jinja2 Documentation:    http://jinja.pocoo.org/2/documentation/
Werkzeug Documentation:  http://werkzeug.pocoo.org/documentation/
This file creates your application.
"""
import os
from app import app, db, login_manager
from flask import render_template, request, redirect, url_for, flash, send_from_directory, jsonify
from flask_login import login_user, logout_user, current_user, login_required
from werkzeug.utils import secure_filename
from app.forms import RegistrationForm, LoginForm, AddNewCarForm
from app.models import Cars, Users, Favourites
from werkzeug.security import check_password_hash


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


@app.route('/secure-page')
@login_required
def secure_page():
    return render_template('secure_page.html')


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
@app.route('/api/register', methods=['POST', 'GET']) #Method should be 'POST' ONLY but has 'GET' for now to allow render_template() to work
def register():

    #Instantiate form and get form data.
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

        #Save information to database.
        user = Users(username=username, password=password, name=name, email=email, location=location, biography=biography, photo=filename)
        db.session.add(user)
        db.session.commit()

        #Format and return response message.
        new_user = {
            'message': 'User Registration Successful.',
            'username': username,
            'name': name,
            'email': email,
            'location': location,
            'biography': biography,
            'photo': filename
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
@app.route('/api/auth/login', methods=['POST', 'GET']) #Method should be 'POST' ONLY but has 'GET' for now to allow render_template() to work
def login():

    if current_user.is_authenticated:
        return redirect(url_for('secure_page'))

    #Instantiate form and get form data.
    form = LoginForm()
    if request.method == 'POST' and form.validate_on_submit():
        if form.username.data:
            username = form.username.data
            password = form.password.data

            #Query the database and login user if passwords match.
            user = Users.query.filter_by(username=username).first()
            if user is not None and check_password_hash(user.password, password):
                login_user(user)

                #Format and return response message.
                message = '{0} Successfully Logged In. User ID: {1}'.format(username, current_user.get_id())
                login = {
                    'message': message,
                }
                return render_template('home.html')
    """        
    else:
        errors = form_errors(form)
        return jsonify(errors=errors)
    """
    return render_template("login_form.html", form=form)


#Logout a user.
#HTTP Method: 'POST'
@app.route("/logout" """, methods=['POST']""") #Method should be 'POST' ONLY
@login_required
def logout():
    # Logout the user and end the session
    logout_user()
    return redirect(url_for('home'))


#Return all cars ['GET'] or add new cars ['POST'].
#HTTP Method: 'GET' OR 'POST'
@app.route('/api/cars', methods=['GET', 'POST'])
@login_required
def cars():
    """ - Uncomment this method to return all cars, otherwise it will return the form to add new car.
    #If 'GET' then return all cars.
    if request.method == 'GET':
        crs = db.session.query(Cars).all()
        cars = []

        for cr in crs:
            car = {
                'id': cr.id,
                'description': cr.description,
                'make': cr.make,
                'model': cr.model,
                'colour': cr.colour,
                'year': cr.year,
                'transmission': cr.transmission,
                'car_type': cr.car_type,
                'price': cr.price,
                'photo': cr.photo,
                'user_id': cr.user_id
                }
            cars.append(car)

        return jsonify(cars=cars)
    """
    #If 'POST' then add new car.
    #Instantiate form and get form data.
    form = AddNewCarForm()
    if current_user.is_authenticated:
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

            #Save information to database.
            #Also
            #I cast price to float because i encountered an error where json cannot serialize float so being lazy i did this.
            car = Cars(description=description, make=make, model=model, colour=colour, year=year, transmission=transmission, car_type=car_type, price=float(price), photo=filename, user_id=current_user.get_id())
            db.session.add(car)
            db.session.commit()

            #Format and return response message.
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
                'photo': filename
            }
            return jsonify(new_car=new_car)
        """
        else:
            errors = form_errors(form)
            return jsonify(errors=errors)
        """
    return render_template("home.html", form=form)


#Get Details of a specific car.
#HTTP Method: 'GET'
@app.route('/api/cars/<car_id>', methods=['GET'])
def get_car(car_id):

    if request.method == 'GET':

        #Query the database.
        cr = Cars.query.filter_by(id=car_id).first()

        #Format and return the data.
        car = {
            'id': cr.id,
            'description': cr.description,
            'make': cr.make,
            'model': cr.model,
            'colour': cr.colour,
            'year': cr.year,
            'transmission': cr.transmission,
            'car_type': cr.car_type,
            'price': cr.price,
            'photo': cr.photo,
            'user_id': cr.user_id
        }
        return jsonify(car=car)


#Add car to Favourites for logged in user.
#HTTP Method: 'POST'
@app.route('/api/cars/<car_id>/favourite', methods=['POST', 'GET']) #Method should be 'POST' ONLY
@login_required
def add_favourite(car_id):

    if current_user.is_authenticated:
        if request.method == 'GET':

            #Save information to database.
            user_id=current_user.get_id()
            favourite = Favourites(car_id=car_id, user_id=user_id)
            db.session.add(favourite)
            db.session.commit()

            #Format and return response message.
            cr = Cars.query.filter_by(id=car_id).first()
            user = Users.query.filter_by(id=user_id).first()
            message = {
                'message': '{0} Successfully Added {1} - {2} To Favourites.'.format(user.username, cr.make, cr.model)
                }
            return jsonify(message=message)


#Search for cars by make or model.
#HTTP Method: 'GET'
@app.route('/api/search/<search_term>', methods=['GET'])
def search(search_term):

    if request.method == 'GET':

        crs = db.session.query(Cars).all()
        result = []

        for cr in crs:
            if search_term.lower() in cr.make.lower() or search_term.lower() in cr.model.lower():
                car = {
                    'id': cr.id,
                    'description': cr.description,
                    'make': cr.make,
                    'model': cr.model,
                    'colour': cr.colour,
                    'year': cr.year,
                    'transmission': cr.transmission,
                    'car_type': cr.car_type,
                    'price': cr.price,
                    'photo': cr.photo,
                    'user_id': cr.user_id
                    }
                result.append(car)
        return jsonify(result)


#Get Details of a user.
#HTTP Method: 'GET'
@app.route('/api/users/<user_id>', methods=['GET'])
def get_user(user_id):

    if request.method == 'GET':

        #Query the database.
        usr = Users.query.filter_by(id=user_id).first()

        #Format and return the data.
        user = {
            'id': usr.id,
            'username': usr.username,
            'name': usr.name,
            'email': usr.email,
            'location': usr.location,
            'biography': usr.biography,
            'photo': usr.photo,
            'date_joined': usr.date_joined
        }
        return jsonify(user=user)


#Get cars that a user has favourited.
#HTTP Method: 'GET'
@app.route('/api/users/<user_id>/favourites', methods=['GET'])
def get_favourites(user_id):

    if request.method == 'GET':

        #Query the database.
        favourites = Favourites.query.filter_by(user_id=user_id).all()
        cars = []

        #Format the data and populate the list.
        for favourite in favourites:
            cr = Cars.query.filter_by(id=favourite.car_id).first()
            car = {
                'id': cr.id,
                'description': cr.description,
                'make': cr.make,
                'model': cr.model,
                'colour': cr.colour,
                'year': cr.year,
                'transmission': cr.transmission,
                'car_type': cr.car_type,
                'price': cr.price,
                'photo': cr.photo,
                'user_id': cr.user_id
                }
            cars.append(car)

        #Return the data.
        return jsonify(cars=cars)


# user_loader callback. This callback is used to reload the user object from
# the user ID stored in the session
@login_manager.user_loader
def load_user(id):
    return Users.query.get(int(id))




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


# Flash errors from the form if validation fails
def flash_errors(form):
    for field, errors in form.errors.items():
        for error in errors:
            flash(u"Error in the %s field - %s" % (
                getattr(form, field).label.text,
                error), 'danger')


###
# The functions below should be applicable to all Flask apps.
###
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
