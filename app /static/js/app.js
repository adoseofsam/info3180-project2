// VARIABLES
var jwt;
let dangerMsg;
let displayDangerMsg = false;
let successMsg;
let displaySuccessMsg = false;




Vue.component('app-header', {
    template: `
    <nav class="navbar navbar-expand-lg navbar-dark bg-primary fixed-top">
      <a class="navbar-brand" href="/"><img id="icon" src="../static/images/photogram.png" alt="Logo"/> <b>Photogram</b></a>
      <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
          <span class="navbar-toggler-icon"></span>
      </button>
      <div class="collapse navbar-collapse" id="navbarSupportedContent">
        <ul class="navbar-nav mr-auto">
          <li class="nav-item active">
            <router-link class="nav-link" to="/explore">Add Car<span class="sr-only">(current)</span></router-link>
          </li>
          <li class="nav-item active">
            <router-link class="nav-link" to="/myprofile">My Profile<span class="sr-only">(current)</span></router-link>
          </li>
          <li class="nav-item active">
            <router-link class="nav-link" to="/logout">Logout<span class="sr-only">(current)</span></router-link>
          </li>
        </ul>
      </div>
    </nav>
    `
});

Vue.component('app-footer', {
    template: `
    <footer>
        <br><br>
        <div class="container">
            <p>Copyright &copy; United Auto Sales.</p>
        </div>
    </footer>
    `
});

//BEGINNING OF FORMS

const registerForm = Vue.component('register-form', {
    template: `          
    <div class="container">
        <div id="centerDiv">
            <div class="register-form center-block">
                <div id = "message">
                    <p class="alert alert-success" v-if="success" id = "success"> {{ message }} </p>
                    <ul class="alert alert-danger" v-if="outcome === 'failure'" id = "errors">
                        <li v-for="error in errors" class="news__item"> {{ error }}</li>
                    </ul> 
                </div>
                <h1>Registration New User</h1>
                <form id="registerForm" @submit.prevent="registerUser" method="post" enctype="multipart/form-data">
                    <div class="form-group">
                        <label for="username"><b>Username</b></label> <input class="form-control" id="username" name="username" type="text" value="">
                    </div>
                    <div class="form-group">
                        <label for="password"><b>Password</b></label> <input class="form-control" id="password" name="password" type="password" value="">
                    </div>
                    <div class="form-group">
                        <label for="firstName"><b>Fullname</b></label> <input class="form-control" id="fullName" name="firstName" type="text" value="">
                    </div>
                    <div class="form-group">
                        <label for="email"><b>Email</b></label> <input class="form-control" id="email" name="email" type="text" value="">
                    </div>
                    <div class="form-group">
                        <label for="location"><b>Location</b></label> <input class="form-control" id="location" name="location" type="text" value="">
                    </div>
                    <div class="form-group">
                        <label for="biography"><b>Biography</b></label> <textarea class="form-control" id="biography" name="biography"></textarea>
                    </div>
                    <div class="form-group">
                        <label for="photo">Profile Photo</label>
                        <input class="form-control"  id="photo" name="photo" type="file">
                    </div>
                  
                    <button type="submit" name="submit" class="btn btn-primary btn-block"><b>Register</b></button>
                </form>
          </div>
        </div>
    </div>
    `,
    data: function() {
        return {
          outcome: '',
          errors: [],
          message: '',
          success: false
        }
    },
    methods: {
      registerUser: function() {
        let router = this.$router;
        let registerForm = document.getElementById('registerForm');
        let form_data = new FormData(registerForm);
        // let formDataJSON = JSON.stringify(Object.fromEntries(form_data));
        let self = this;
        fetch("/api/users/register", {
          method: 'POST',
          body: form_data,
          headers: {
            'X-CSRFToken': token
          },
          credentials: 'same-origin'
        })
          .then(function (response) {
            return response.json();
          })
          .then(function (jsonResponse) {
            // display a success message
            console.log(jsonResponse);
            if(jsonResponse.hasOwnProperty('registerError')) {
              self.errors = jsonResponse.registerError.errors;
              self.outcome = 'failure';
            } else {
              successMsg = jsonResponse.successMsg.message;
              displaySuccessMsg = true;
              router.push('login')
            }
          })
          .catch(function (error) {
            console.log(error);
          });
      }
    }
  });
  