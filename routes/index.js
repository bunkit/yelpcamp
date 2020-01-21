const express = require("express");
const router = express.Router();
const User = require("../models/user");
const passport = require("passport");

// HOMEPAGE
router.get('/', function (req,res) { 
    res.render('landing');
});

// Show register form
router.get("/register", function(req,res){
    res.render("register");
});

// handle sign up logic
router.post("/register", function(req, res){
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
router.get("/login", function(req, res) {
    res.render("login");
});

// handle login logic
router.post("/login", 
    passport.authenticate("local", 
    {
        successRedirect: "/campgrounds",
        failureRedirect: "/login"
    }), 
    function(req, res) {

    }
);

// logout route
router.get("/logout", function(req, res){
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

module.exports = router;
