/* Add your Application JavaScript */
// Instantiate our main Vue Instance
const app = Vue.createApp({
    data() {
        return {

        }
    }
});

app.component('app-header', {
    name: 'AppHeader',
    template: `
    <nav class="navbar navbar-expand-lg navbar-dark bg-primary fixed-top" id="nav-resize" :key="$route.fullPath">
    <router-link class="nav-link text-white" to="/" v-if="!isLoggedIn()"><i class="fa fa-car"></i>&nbsp&nbsp&nbsp&nbspUnited Auto Sales</router-link>
    <router-link class="nav-link text-white" to="/explore" v-if="isLoggedIn()"><i class="fa fa-car"></i>&nbsp&nbsp&nbsp&nbspUnited Auto Sales</router-link>
      <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
        <span class="navbar-toggler-icon"></span>
      </button>
    
      <div class="collapse navbar-collapse" id="navbarSupportedContent">
        
        <ul class="navbar-nav mr-auto" v-if="isLoggedIn()">
            <li class="nav-item active">
                <router-link class="nav-link" to="/cars/new">Add Car <span class="sr-only">(current)</span></router-link>
            </li>
            <li class="nav-item active">
                <router-link class="nav-link" to="/explore">Explore <span class="sr-only">(current)</span></router-link>
            </li>
            <li class="nav-item active">
                <a href="#" class="nav-link" @click="idpush" >My Profile <span class="sr-only">(current)</span></a>
            </li>
        </ul>
      
        <ul class="navbar-nav ml-auto">
          <li class="nav-item active" v-if="!isLoggedIn()">
            <router-link class="nav-link" to="/register">Register <span class="sr-only">(current)</span></router-link>
          </li>
          <li class="nav-item active" v-if="!isLoggedIn()">
            <router-link class="nav-link" to="/login">Login <span class="sr-only">(current)</span></router-link>
          </li>
          <li class="nav-item active" v-if="isLoggedIn()">
            <router-link class="nav-link" to="/logout">Logout <span class="sr-only">(current)</span></router-link>
          </li>
        </ul>

      </div>
    </nav>
    `,
    data() {
        return {}
    }, 
    methods: {
        isLoggedIn: function() {
            if (localStorage.hasOwnProperty('token') === true) {
                return true;
            }
            return false;
        },
        idpush(){
            let user=localStorage.getItem("current_user");
            router.push({ name: 'users', params: { id: user}}); 
        }
    }
});

app.component('app-footer', {
    name: 'AppFooter',
    template: `
    <footer>
        <div class="container">
            <p>Copyright &copy; {{ year }} Flask Inc.</p>
        </div>
    </footer>
    `,
    data() {
        return {
            year: (new Date).getFullYear()
        }
    }
});

const Home = {
    name: 'Home',
    template: `
        <div class="d-flex align-items-center home-div col-md-12">
            <div class="row align-items-center col-md-6 intro">
                <h1 class="font-weight-bold">Buy and Sell Cars Online</h1>
                <p class="mt-2 mb-4 text-secondary">United Auto Sales provides the fastest, easiest and most user friendly way to buy or sell cars online. Find a Great Price on the Vehicle You Want</p>
                <div class="flex-area">
                    <button @click="toRegister" class="btn bg-primary text-white" type="button">Register</button>
                    <button @click="toLogin" class="btn text-white Dahalia-Rodje-color" type="button">Login</button>
                </div>
            </div>
            <div class="fit col-md-6">
                <img class="" src="static/images/car3.jpg">
            </div>
        </div>
    `,
    data() {
        return {}
    }, 
    methods: {
        toRegister: function() {
            this.$router.push({ path: '/register' });
        },
        toLogin: function() {
            this.$router.push({ path: '/login' });
        }
    },
};

const Register = {
    name: 'Register',
    template: `
        <div class="maincontainer">
        <div class="register m-4">
            <h1 class="mb-4">Register New User</h1>
            <form method="POST" class="form" action="" id="register-form" @submit.prevent="registerUser()">
                <div class="d-flex flex-area1 mt-sm-1 mb-sm-1">
                    <div>
                        <label class="" for="username">Username</label><br>
                        <input type="text" class="form-control form-field" name="username" required>
                    </div>
                    <div>
                        <label class="" for="password">Password</label><br>
                        <input type="password" class="form-control form-field" name="password" required>
                    </div>
                </div>
                <div class="d-flex flex-area1 mt-sm-3 mb-sm-1">
                    <div>
                        <label class="" for="fullname">Fullname</label><br>
                        <input type="text" class="form-control form-field" name="fullname" required>
                    </div>
                    <div>
                        <label class="" for="email">Email</label><br>
                        <input type="email" class="form-control form-field" name="email" required>
                    </div>
                </div>
                <div class="mt-sm-3 mb-sm-1">
                    <label class="" for="location">Location</label><br>
                    <input type="text" class="form-control form-field" name="location" required>
                </div>
                <div class="mt-sm-3">
                    <label class="" for="biography">Biography</label><br>
                    <textarea name="biography" class="form-control" required></textarea><br>
                </div>
                <div class="form-group">
                    <label class="" for="photo">Upload Photo</label><br>
                    <input type="file" class="form-control" name="photo" accept=".jpeg, .jpg, .png">
                </div>
                <button type="submit" name="submit" class="btn  text-white mt-sm-3 mb-sm-1 Dahalia-Rodje-color">Register</button>
            </form>
        </div>
        </div>
    `,
    data: function() {
        return {
            
        };
    },
    methods: {
        registerUser: function() {

            let self = this;
            let registerForm = document.getElementById('register-form');
            let form_data = new FormData(registerForm);
            fetch("/api/register", {
                method: 'POST',
                body: form_data,
                headers: {
                    'X-CSRFToken': token
                },
                credentials: 'same-origin'        
            })
            .then(function(response) {
                return response.json();
            })
            .then(function(jsonResponse) {
                if(jsonResponse.errors==undefined){
                    router.push('/login');
                    swal({title: "Register",text: "User Successfully registered",icon: "success",button: "Proceed"});
                }else{
                    swal({title: "Register",text: jsonResponse.errors[0],icon: "error",button: "Try Again"});
                }
            })
            .catch(function(error) {
                console.log(error);
            });
        }
    }
};

const Login = {
    name: 'Login',
    template: `
        <div class="center-form m-4 login">
            <h2 class="text-center mb-4">Login to your account</h2>
            <form method="POST" class="form" action="" id="login-form" @submit.prevent="loginUser()">
                <div class="mt-sm-1 mb-sm-1">
                    <label class="" for="username">Username</label><br>
                    <input type="text" class="form-control form-field login-field" name="username" required>
                </div>
                <div class="mt-sm-3 mb-sm-1">
                    <label class="" for="biography">Password</label><br>
                    <input type="password" class="form-control form-field login-field" name="password" required>
                </div>
                <button type="submit" name="submit" class="btn  text-white mt-sm-3 mb-sm-1 Dahalia-Rodje-color login-field">Login</button>
            </form>
        </div>
    `,
    data() {
        return {}
    },
    methods: {
        loginUser: function() {
            let self = this;
            let loginForm = document.getElementById('login-form');
            let form_data = new FormData(loginForm);

            fetch("/api/auth/login", {
                method: 'POST',
                body: form_data,
                headers: {
                    'X-CSRFToken': token
                },
                credentials: 'same-origin'        
            })
            .then(function(response) {
                return response.json();
            })
            .then(function(jsonResponse) {
                if(jsonResponse.errors==undefined){
                    if(jsonResponse.token !== null) {
                        let jwt_token = jsonResponse.data.token;
                        let id = jsonResponse.data.id;
                        // stores token to localStorage
                        localStorage.setItem('token', jwt_token);
                        localStorage.setItem('current_user', id);
                        router.push('/explore');
                        swal({title: "Login",text: jsonResponse.data.message,icon: "success",button: "Proceed"});
                    }
                }else{
                    swal({title: "Logged In",text: jsonResponse.errors[0],icon: "error",button: "Try Again"});  
                }

            })
            .catch(function(error) {
                console.log(error);
            });
    
        }
    }
};

const Logout = {
    name: 'Logout',
    template: `
    <h1 class="mt-sm-3">Logging out...</h1>
    `,
    created: function() {
        fetch("api/auth/logout", {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-CSRFToken': token,
                'Authorization': 'Bearer ' + localStorage.getItem('token')
            },
            credentials: 'same-origin'
        })
        .then(function(response){
          return response.json();
        })
        .then(function(jsonResponse){
            window.localStorage.removeItem('token');
            window.localStorage.removeItem('current_user');
            router.push('/');
        })
        .catch(function(error){
          console.log(error);
        });
    }
};

const Explore = {
    name: 'Explore',
    template: `
        <div class="container maincontainer" >
            <div id="displayexplore">
                <h1>Explore</h1>
                <div id="explore-search">
                    <form id="explore-form" method="GET" @submit.prevent="search()">
                        <div class="form-group col-4">
                            <label for="make">Make</label>
                            <input type="text" class="form-control" name="make" />
                        </div>
                        <div class="form-group col-4">
                            <label for="model">Model</label>
                            <input type="text" class="form-control" name="model" />
                        </div>
                        <div class="form-group search-btn-div">
                            <button type="submit" class="btn btn-success Dahalia-Rodje-color search-btn">Search</button>
                            </div>
                    </form>
                </div>  

                <div class="carslist" v-if="listOfCars[0]">
                <div v-for="cars in listOfCars">
                    <div class="card" style="width: 18rem;">
                        <img class="card-img-top favcar"  :src="cars.photo">
                        <div class="card-body">
                            <div class="name-model-price">

                                <div class="name-model">
                                    <span  class="car-name">{{cars.year.concat(" ",cars.make)}}</span>
                                    <span class="graytext">{{cars.model}}</span>
                                </div>

                                <a href="#" class="btn btn-success Dahalia-Rodje-color card-price-btn">
                                    <img class="icons" src='/static/images/tagicon.png'>
                                    <span><span>$</span>{{cars.price}}</span>
                                </a>

                            </div>
                            <a :href="cars.id" class="btn btn-primary card-view-btn" @click="getCarDetails">View more details</a>
                        </div>
                    </div>
                </div>
                </div>
            </div>
        </div>
    `,
    created() {
        let self = this;
        fetch("/api/cars", {
            method: 'GET',
            headers: {
                'X-CSRFToken': token,
                'Authorization': 'Bearer ' + localStorage.getItem('token')
            },
            credentials: 'same-origin'        
        })
        .then(function(response) {
            return response.json();
        })
        .then(function(jsonResponse) {
            let count=0
            let temp=[]
            let carz=jsonResponse.data.reverse()
            for (let index = 0; index < carz.length; index++) {
                if (index==3){
                    break;
                }
                temp.push(jsonResponse.data[index]); 
            }
            self.listOfCars=temp;
        })
        .catch(function(error) {
            console.log(error);
        });
    },
    data() {
        return {
            listOfCars : []
        }
    },
    methods: {
        getCarDetails: function(event) {
            event.preventDefault();
            let carid=event.target.getAttribute("href");
            router.push({ name: 'details', params: { id: carid}}); 
        },

        search: function() {
            let self = this;
            let exploreForm = document.getElementById('explore-form');
            let form_data = new FormData(exploreForm);
            
            let form_values = []

            for (var p of form_data) {
                form_values.push(p[1].trim());
            }

            let make = form_values[0];
            let model = form_values[1];

            fetch("/api/search?make=" + make + "&model=" + model, {
                method: 'GET',
                headers: {
                    'X-CSRFToken': token,
                    'Authorization': 'Bearer ' + localStorage.getItem('token')
                },
                credentials: 'same-origin'        
            })
            .then(function(response) {
                return response.json();
            })
            .then(function(jsonResponse) {
                self.listOfCars = jsonResponse.data.reverse();
            })
            .catch(function(error) {
                console.log(error);
            });
        }
    }
};

const Profile = {
    name: 'Profile',
    template: `
        <div class="container maincontainer">
            <div id="displayfav">

                <div id="profile">
                    <div id="profileimagediv">
                        <img class="favcar" id="round" :src="userInfo.photo">
                    </div>
                    <div id="profiledetailsdiv" class="descriptions">
                        <h2 id="profile-name">{{userInfo.name}}</h2>
                        <h4 class="graytext">@<span>{{userInfo.username}}</span></h4>
                        <p class="graytext">{{userInfo.biography}}</p>
                        <div id="elj">
                            <div>
                                <p class="profile-user-info graytext">Email</p>
                                <p class="profile-user-info graytext">Location</p>
                                <p class="profile-user-info graytext">Joined</p>
                            </div>
                            <div>
                                <p class="profile-user-info">{{userInfo.email}}</p>
                                <p class="profile-user-info">{{userInfo.location}}</p>
                                <p class="profile-user-info">{{userInfo.date_joined}}</p>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="carsfavtext"><h1>Cars Favourited</h1></div>

                <div class="carslist">
                <div v-for="cars in listOfCars">
                    <div class="card" style="width: 18rem;">
                        <img class="card-img-top favcar"  :src="cars.photo">
                        <div class="card-body">
                            <div class="name-model-price">

                                <div class="name-model">
                                    <span  class="car-name">{{cars.year.concat(" ",cars.make)}}</span>
                                    <span class="graytext">{{cars.model}}</span>
                                </div>

                                <a href="#" class="btn btn-success card-price-btn Dahalia-Rodje-color">
                                    <img class="icons" src='/static/images/tagicon.png'>
                                    <span><span>$</span>{{cars.price}}</span>
                                </a>

                            </div>
                            <a :href="cars.id" class="btn btn-primary card-view-btn" @click="getCarFavDetails">View more details</a>
                        </div>
                    </div>
                </div>
                </div>
            </div>
        </div>  
    `, 
    created: function() {
        let self=this;
            fetch("/api/users/"+ localStorage.getItem('current_user'), {
                method: 'GET',
                headers: {
                    'X-CSRFToken': token,
                    'Authorization': 'Bearer ' + localStorage.getItem('token')
                },
                credentials: 'same-origin'        
            })
            .then(function(response) {
                return response.json();
            })
            .then(function(jsonResponse) {
                self.userInfo = jsonResponse.data;
                fetch("/api/users/"+ localStorage.getItem('current_user') + "/favourites", {
                    method: 'GET',
                    headers: {
                        'X-CSRFToken': token,
                        'Authorization': 'Bearer ' + localStorage.getItem('token')
                    },
                    credentials: 'same-origin'        
                })
                .then(function(response) {
                    return response.json();
                })
                .then(function(jsonResponse) {
                    self.listOfCars = jsonResponse.data;
                })
                .catch(function(error) {
                    console.log(error);
                });
            })
            .catch(function(error) {
                console.log(error);
            });      
    },
    methods:{
        getCarFavDetails: function(event) {
            event.preventDefault();
            let carid=event.target.getAttribute("href");
            router.push({ name: 'details', params: { id: carid}}); 
        }
    },
    data() {
        return {
            listOfCars: [],
            userInfo: [],
            host:window.location.protocol + "//" + window.location.host
        }
    }
};

const CarDetails = {
    name: 'CarDetails',
    template: `
        <div class="container maincontainer">
            <div id="display-car-details" v-if="details[0]">
                <div id="car-details-card">
                    <img id="car-d-image" class="car-detail-image" :src="details[0].photo" alt="car image in card">
                    <div id="car-details">
                        <h1 id="car-d-heading" > {{details[0].year.concat(" ",details[0].make)}}</h1>
                        <h4 class="graytext">{{details[0].model}}</h4>
                        <p class="car-d-description graytext">{{details[0].description}}</p>
                        <div id="reduce-gap">
                            <div class="cpbd">
                                <div class="cp">
                                    <div>
                                        <p class="car-d-spec graytext">Color</p>
                                    </div>
                                    <div>
                                        <p class="car-d-spec">{{details[0].colour}}</p>
                                    </div>
                                </div>
                                <div class="bd">
                                    <div>
                                        <p class="car-d-spec graytext">Body Type</p>
                                    </div>
                                    <div>
                                        <p class="car-d-spec">{{details[0].type}}</p>
                                    </div>
                                </div>
                                <br>
                            </div>

                            <div class="cpbd">
                                <div class="cp">
                                    <div>
                                        <p class="car-d-spec graytext">Price</p>
                                    </div>
                                    <div>
                                        <p class="car-d-spec">{{details[0].price}}</p>
                                    </div>
                                </div>
                                <div class="bd">
                                    <div>
                                        <p class="car-d-spec graytext">Transmission</p>
                                    </div>
                                    <div>
                                        <p class="car-d-spec">{{details[0].transmission}}</p>
                                    </div>
                                </div>
                                <br>
                            </div>
                        </div>
                        <div id="card-d-btns" >
                            <a href="#" class="btn btn-success email-owner">Email Owner</a>
                            <div id="card-d-heart" >
                                <button href="#" v-if="checkfav()" @click="addFavourite" id="heartbtn" class="heart fa fa-heart"></button>
                                <button href="#" v-else @click="addFavourite" id="heartbtn" class="heart fa fa-heart-o fa-heart"></button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div> 
    `,
    created(){
        let self=this;
        fetch("/api/cars/"+this.$route.params.id, {
            method: 'GET',
            headers: {
                'X-CSRFToken': token,
                'Authorization': 'Bearer ' + localStorage.getItem('token')
            },
            credentials: 'same-origin'        
        })
        .then(function(response) {
            return response.json();
        })
        .then(function(jsonResponse){
            self.details = jsonResponse.data;
            this.isFav=jsonResponse.isFav;
        })
        .catch(function(error) {
            console.log(error);
        });
    }, 
    methods: {
        addFavourite: function(event) {
            event.target.classList.toggle("fa-heart-o");
            if(event.target.classList.contains("fa-heart-o")===false){
                fetch("/api/cars/"+this.$route.params.id+"/favourite", {
                    method: 'POST',
                    body: JSON.stringify({"car_id": this.$route.params.id,"user_id": localStorage.getItem("current_user")}),
                    headers: {
                        'Content-Type': 'application/json',
                        'X-CSRFToken': token,
                        'Authorization': 'Bearer ' + localStorage.getItem('token')
                    },
                    credentials: 'same-origin' 
                })
                .then(function(response) {
                    return response.json();
                })
                .then(function(jsonResponse) {
                    if (jsonResponse.message!=undefined) {
                        
                    }
                })
                .catch(function(error) {
                    console.log(error);
                });
            }
            else{
                fetch("/api/cars/"+this.$route.params.id+"/favourite/remove", {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'X-CSRFToken': token,
                        'Authorization': 'Bearer ' + localStorage.getItem('token')
                    },
                    credentials: 'same-origin' 
                })
                .then(function(response) {
                    return response.json();
                })
                .then(function(jsonResponse) {
                    console.log(jsonResponse.data)
                })
                .catch(function(error) {
                    console.log(error);
                });
            }
        },
        checkfav(){
            if (self.isFav) {
                return true;
            }
            return false;
        
        }
    },
    data(){
        return {
            details: [],
            isFav: false
        }
    }
};

const AddCar = {
    name: 'AddCar',
    template: `
    <div class="container maincontainer">
    <div class="add_car m-4 ">
        <h1 class="mb-4" id="addnew">Add New Car</h1>
        <form method="POST" class="form" action="" id="car-form" @submit.prevent="addCar()">
            <div class="mt-sm-1 mb-sm-1 d-flex flex-area1">
                <div>
                    <label class="" for="make">Make</label><br>
                    <input type="text" class="form-control form-field" name="make" required>
                </div>
                <div>
                    <label class="" for="model">Model</label><br>
                    <input type="text" class="form-control form-field" name="model" required>
                </div>
            </div>
            <div class="mt-sm-3 mb-sm-1 d-flex flex-area1">
                <div>
                    <label class="" for="colour">Colour</label><br>
                    <input type="text" class="form-control form-field" name="colour" required>
                </div>
                <div>
                    <label class="" for="year">Year</label><br>
                    <input type="text" class="form-control form-field" name="year" required>
                </div>
            </div>
            <div class="mt-sm-3 mb-sm-1 d-flex flex-area1">
                <div>
                    <label class="" for="price">Price</label><br>
                    <input type="number" class="form-control form-field" name="price" required>
                </div>
                <div>
                    <label class="" for="car_type">Car Type</label><br>
                    <select name="car_type" class="form-control form-field" required>
                        <option value="SUV">SUV</option>
                        <option value="Hybrid/Electric">Hybrid/Electric</option>                        <option value="Convertible">Convertible</option>
                        <option value="Sedan">Sedan</option>
                        <option value="Hatchback">Hatchback</option>
                        <option value="Van">Van</option>
                        <option value="Wagon">Wagon</option>
                        <option value="Diesel">Diesel</option>
                        <option value="Crossover">Crossover</option>
                    </select>
                </div>
            </div>
            <div class="mt-sm-3 mb-sm-1">
                <label class="" for="transmission">Transmission</label><br>
                <select name="transmission" class="form-control form-field" required>
                    <option value="Automatic">Automatic</option>
                    <option value="Manual">Manual</option>
                </select>
            </div>
            <div class="mt-sm-3 mb-sm-1">
                <label class="" for="description">Description</label><br>
                <textarea name="description" class="form-control" rows="4" required></textarea><br>
            </div>
            <div class="">
                <label class="" for="photo">Upload Photo</label><br>
                <input type="file" class="form-control form-field" name="photo" accept=".jpeg, .jpg, .png" required>
            </div>
            <button type="submit" name="submit" class="btn Dahalia-Rodje-color text-white mt-sm-3 mb-sm-1">Save</button>
        </form>
    </div>
    </div>
    `,
    data() {
        return {}
    }, 
    methods: {
        addCar: function() {

            let self = this;
            let carForm = document.getElementById('car-form');
            let form_data = new FormData(carForm);

            fetch("/api/cars", {
                method: 'POST',
                body: form_data,
                headers: {
                    'X-CSRFToken': token,
                    'Authorization': 'Bearer ' + localStorage.getItem('token')
                },
                credentials: 'same-origin'        
            })
            .then(function(response) {
                console.log(response);
                return response.json();
            })
            .then(function(jsonResponse) {
                if(jsonResponse.data){
                    router.push('/explore');
                    swal({title: "Add Car",text: jsonResponse.message,icon: "success",button: "Proceed"});
                }else{
                    swal({title: "Add Car",text: jsonResponse.errors[0],icon: "error",button: "Try Again"});
                }
                
            })
            .catch(function(error) {
                console.log(error);
            });
    
        }
        
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
    { path: "/register", component: Register },
    { path: "/login", component: Login },
    { path: "/logout", component: Logout },
    { path: "/explore", component: Explore },
    { path: "/users/:id",name:"users", component: Profile },
    { path: "/cars/new", component: AddCar },
    { path: "/cars/:id",name:"details", component: CarDetails},

    // This is a catch all route in case none of the above matches
    { path: '/:pathMatch(.*)*', name: 'not-found', component: NotFound }
];

const router = VueRouter.createRouter({
    history: VueRouter.createWebHistory(),
    routes, // short for `routes: routes`
});

app.use(router);
app.mount('#app');