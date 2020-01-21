const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const passport = require("passport");
const LocalStrategy = require("passport-local");
const Campground = require("./models/campground");
const Comment = require("./models/comment");
const User = require("./models/user");
const seedDB = require("./seed");

// CONECTING TO DB
mongoose.connect('mongodb://localhost/yelp_camp', {
    useNewUrlParser: true,
    useUnifiedTopology: true
});


//FOR POST RNCODE
app.use(bodyParser.urlencoded({extended: true}));
app.set('view engine', 'ejs');
app.use(express.static(__dirname + "/public"));

// RECREATING DATA
seedDB();

//PASSPORT CONFIG
app.use(require("express-session")({
    secret: "siapa yang bertahan dia yang akan tumbuh",
    resave: false,
    saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// Global scope for currentuser
app.use( function(req, res, next){
    res.locals.currentUser = req.user;
    next();
});

// HOMEPAGE
app.get('/', function (req,res) { 
    res.render('landing');
});

//CAMGROUND INDEX
app.get('/campgrounds', function (req,res) {
    // GET ALL CAMPGROUNDS FROM DB
    Campground.find({}, function (err, allCampgrounds) {
        if (err) {
            console.log(err);
        } else {
            res.render('campgrounds/index', {campgrounds:allCampgrounds});
        }
    });
});

app.post('/campgrounds', function(req,res) {
    let name = req.body.name;
    let image = req.body.image;
    let desc = req.body.description;
    let newCampground = {name: name, image:image, description:desc}

    Campground.create( newCampground, function(err, campground) {
        if (err) {
        console.log(err);
        } else {
            res.redirect("/campgrounds");
        }
    });

    // GET DATA FROM FORM AND ADD TO CAMGROUNDS ARRAY
    // REDIRECT BACK TO CAMPGROUNDS PAGE
});

app.get('/campgrounds/new', function (req,res) {
    res.render('campgrounds/new');
});

app.get("/campgrounds/:id", function(req, res) {
    //FIND CAMPGROUND WITH PROVIDED ID 
    Campground.findById(req.params.id).populate("comments").exec(function(err,foundCampground) {
        if (err) {
            console.log(err);
        } else {
            // SHOW THE CAMPGROUND INFO
            res.render('campgrounds/show', {campground: foundCampground});
        }
    });
});

//=================================
// COMMENT ROUTES
//=================================

app.get("/campgrounds/:id/comments/new", isLoggedin, function(req, res) {
    Campground.findById(req.params.id, function(err,campground) {
        if (err) {
            console.log(err);
        } else {
            // SHOW THE CAMPGROUND INFO
            res.render('comments/new', {campground: campground});
        }
    });
});

app.post("/campgrounds/:id/comments/", function(req, res) {
    // LOOK UP CAMPGROUND USING ID
    Campground.findById(req.params.id, function(err,campground) {
        if (err) {
            console.log(err);
            res.redirect("/campgrounds");
        } else {
            // CREATE NEW COMMEWNT
            Comment.create(req.body.comment,function(err,comment) {
                if (err) {
                    console.log(err);
                } else {
                    // CONNECT NEW COMMENT TO CAMPGROUND
                    campground.comments.push(comment);
                    campground.save();
                    // REDIRECT TO CAMPGROUND SHOW PAGE 
                    res.redirect("/campgrounds/"+ campground._id);
                }
            
            });
        }
    });
});


//=================================
// AUTH ROUTES
//=================================

// Show register form
app.get("/register", function(req,res){
    res.render("register");
});

// handle sign up logic
app.post("/register", function(req, res){
    let newUser = new User({username: req.body.username});
    User.register(newUser, req.body.password, function(err, user){
        if (err) {
            console.log(err);
            return res.render("register");
        }
        passport.authenticate("local")(req, res, function(){
            res.redirect("/campgrounds");
        })
    })
});

//Show login form
app.get("/login", function(req, res) {
    res.render("login");
});

// handle login logic
app.post("/login", 
    passport.authenticate("local", 
    {
        successRedirect: "/campgrounds",
        failureRedirect: "/login"
    }), 
    function(req, res) {

    }
);

// logout route
app.get("/logout", function(req, res){
    req.logout();
    res.redirect("/campgrounds");
});

//middleware for login required
function isLoggedin(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }
    res.redirect("/login");
}

app.listen(process.env.PORT || 3000, process.env.IP, function() {
    console.log('The YelpCamp Server has started');
});
