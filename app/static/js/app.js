// VARIABLES
var jwt;
let dangerMsg;
let displayDangerMsg = false;
let successMsg;
let displaySuccessMsg = false;

const app = Vue.createApp({
  data() {
      return {

      }
  }
});


app.component('app-header', {
  name: 'AppHeader',
  template: `
  <nav class="navbar navbar-expand-lg navbar-dark bg-dark fixed-top">
    <a class="navbar-brand" href="/"><img id="icon" src="../static/imgs/car-white.png" alt="Car Logo"> <b>United Auto Sales</b></a>
    <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
      <span class="navbar-toggler-icon"></span>
    </button>
    <div class="collapse navbar-collapse" id="navbarSupportedContent">
      <ul class="navbar-nav">
        <li class="nav-item active" v-if="loggedIn()">
          <router-link class="nav-link" to="/addcar">Add Car<span class="sr-only">(current)</span></router-link>
        </li>
        <li class="nav-item active" v-if="loggedIn()">
          <router-link class="nav-link" to="/explore">Explore<span class="sr-only">(current)</span></router-link>
        </li>
        <li class="nav-item active" v-if="loggedIn()">
          <router-link class="nav-link" to="/myprofile">My Profile<span class="sr-only">(current)</span></router-link>
        </li>
        <div id="navRight" class="d-flex justify-content-end">
          <li class="nav-item active" v-if="loggedIn()">
            <router-link class="nav-link" to="/logout">Logout<span class="sr-only">(current)</span></router-link>
          </li>
          <li class="nav-item active" v-if="!loggedIn()">
            <router-link class="nav-link" to="/register">Register<span class="sr-only">(current)</span></router-link>
          </li>
          <li class="nav-item active" v-if="!loggedIn()">
            <router-link class="nav-link" to="/login">Login<span class="sr-only">(current)</span></router-link>
          </li>
        </div>
      </ul>
    </div>
  </nav>
  `,
  data(){
    return {}
  },
  methods: {
    loggedIn: function() {
      if (localStorage.hasOwnProperty('token')=== true){
        return true;
      }
      return false;
    }
  }
});

app.component('app-footer', {
  name: 'AppFooter',
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

const registerForm = {
  name:'register-form', 
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
        <h1 id="registerhead">Register New User</h1>
        <form id="registerForm" @submit.prevent="registerUser" method="post" enctype="multipart/form-data">
          <div class="row">
            <div class="col-md-4">
              <label for="username"><b>Username</b></label>
              <input class="form-control" id="username" name="username" type="text" value="">
            </div>
            <div class="col-md-4">
              <label for="password"><b>Password</b></label>
              <input class="form-control" id="password" name="password" type="password" value="">
            </div>
          </div>
          <br>
          <div class="row">
            <div class="col-md-4">
              <label for="fullName"><b>Fullname</b></label> <input class="form-control" id="fullName" name="fullName" type="text" value="">
            </div>
            <div class="col-md-4">
              <label for="email"><b>Email</b></label> <input class="form-control" id="email" name="email" type="text" value="">
            </div>
          </div>
          <br>
          <div class="row">
            <div class="col-8">
              <label for="location"><b>Location</b></label> <input class="form-control" id="location" name="location" type="text" value="">
            </div>
            <br>
            <div class="col-sm-8">
              <label for="biography"><b>Biography</b></label> <textarea class="form-control" id="biography" name="biography"></textarea>
            </div>
          </div>
          <br>
          <div class="row">
            <div class="col-md-4">
              <label for="photo">Profile Photo</label>
              <input class="form-control"  id="photo" name="photo" type="file">
            </div>
          </div>
          <button type="submit" name="submit" class="btn btn-success btn-block"><b>Register</b></button>
        </form>
      </div>
    </div>
  </div>
  `,
  data(){
      return {
        outcome: '',
        errors: [],
        message: '',
        success: false
      }
  },
  methods: {
    registerUser() {
      let router = this.$router;
      let registerForm = document.getElementById('registerForm');
      let form_data = new FormData(registerForm);
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
};

//LOGIN FORM

const loginForm = {
  name:'login-form', 
  template: `
  <div class="container">
    <div id="centerDiv">
      <div class="login-form center-block">
        <div id = "message">
          <p class="alert alert-success" v-if="success" id = "success"> {{ message }} </p>
          <p class="alert alert-danger" v-if="outcome === 'singleError'" id = "error"> {{ errorMessage }} </p>
          <ul class="alert alert-danger" v-if="outcome === 'multipleErrors'" id = "errors">
            <li v-for="error in errors" class="news__item"> {{ error }}</li>
          </ul> 
        </div>
        <h1 id="loginhead">Login in to your account</h1>
        <form id="loginForm"  @submit.prevent="loginUser" method="post">
          <div class="form-group">
            <label for="username"><b>Username</b></label>
            <input class="form-control" id="username" name="username" type="text" value="">
          </div>
          <div class="form-group">
            <label for="password"><b>Password</b></label>
            <input class="form-control" id="password" name="password" type="password" value="">
          </div>
          <button type="submit" name="submit" class="btn btn-success btn-block"><b>Login</b></button>
        </form>
      </div>
    </div>
  </div>
  `,
  data(){
      return {
        outcome: '',
        errors: [],
        errorMessage: '',
        message: '',
        success: false
      }
  },
  mounted(){

    let self = this;
    if(displaySuccessMsg) {
      displaySuccessMsg = false;
      self.success = true;
      self.message = successMsg;
    }
        
  },
  methods: {
    loginUser() {
      let router = this.$router;
      let loginForm = document.getElementById('loginForm');
      let form_data = new FormData(loginForm);
      let self = this;
      fetch("/api/auth/login", {
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

          if(jsonResponse.hasOwnProperty('loginError')) {

            self.errorMessage = jsonResponse.loginError.error;
            self.outcome = 'singleError';
            self.success = false;

          } else if(jsonResponse.hasOwnProperty('loginErrors')) {

            self.errors = jsonResponse.loginErrors.errors;
            self.outcome = 'multipleErrors'
            self.success = false;

          } else {

            successMsg = jsonResponse.successMsg.message;
            current_userid = jsonResponse.successMsg.user_id;
            displaySuccessMsg = true;
            jwt = jsonResponse.successMsg.token;
            router.push('explore')

          }
        })
        .catch(function (error) {
          console.log(error);
        });
    }
  }
};

//EXPLORE PAGE 
const explore = {
  name:'explore',
  template: `          
    <div class="ExpCars">
        <div id = "message">
            <p class="alert alert-success" v-if="success" id = "success"> {{ message }} </p>
        </div>
       <h1 id="explorehead">Explore</h1>

    `,
    data() {
        return {
        }
      },
  };
  

const logout = {
  name:'logout', 
  template: `
  `,
  mounted: function() {

    let self = this;
    if(current_userid==0) {
      displayDangerMessage = true;
      dangerMessage = 'You are already logged out!';
      router.push("/")
    } else {
    fetch("/api/auth/logout", {
        method: 'GET',
        headers: {
          "Content-type": "application/json"
        },
      })
      .then(function (response) {
        return response.json();
      })
      .then(function (jsonResponse) {
        console.log(jsonResponse);
        successMessage = jsonResponse.successMessage.message;
        displaySuccessMessage = true;
        current_userid = 0;
        router.push('/login')
      })
      .catch(function (error) {
        console.log(error);
      });
    }
  },
  methods: {}
};

const Home = {
  name: 'Home',
  template: `
  <div>
    <div id = "message">
      <p class="alert alert-danger" v-if="danger" id = "success"> {{ message }} </p>
    </div>
      <div class="row">
        <div class="col">
          <h1 style="padding-top: 150px;"> Buy and Sell <br/>Cars Online</h1>
          <p class="lead">United Auto Sales provides the fastest, easiest and<br/>
          most user friendly way to buy or sell cars online. Find a<br/>
          Great Price on the Vehicle You Want.</p>
          <div class="row" style="padding-right: 450px;">
              <div class="col-sm-12 text-center">
                <div id="homeBtnsDiv">
                  <button id="btnRegister" class="btn btn-success" @click="$router.push('register')" type="submit" name="submit"><b>REGISTER</b></button>
                  <button id="btnLogin" class="btn btn-primary" @click="$router.push('login')" type="submit" name="submit"><b>LOGIN</b></button>
                </div>
              </div>
          </div>
        </div>
      <img id="redCar" style= "padding-bottom: 20px;" src="../static/imgs/red_audi-unsplash.jpg" alt="Red Car"/>
    </div>
  </div>
  `,
  data() {
      return {}
  }
};

const NotFound = {
  name: 'NotFound',
  template: `
  <div>
      <h1>404 - Not Found</h1>
  </div>
  `,
  data() {
      return {}
  }
};

// Define Routes
const routes = [
  { path: "/", component: Home },
  // Put other routes here
  {path: "/register", component: registerForm},
  {path: "/login", component: loginForm},
  {path: "/explore", component: explore},
  // {path: "/addcar", component: }
  // This is a catch all route in case none of the above matches
  {path: "/logout", component: logout},
  { path: '/:pathMatch(.*)*', name: 'not-found', component: NotFound }
];

const router = VueRouter.createRouter({
  history: VueRouter.createWebHistory(),
  routes, // short for `routes: routes`
});

app.use(router);

app.mount('#app');
  