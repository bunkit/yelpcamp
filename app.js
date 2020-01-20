const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const Campground = require("./models/campground");
const Comment = require("./models/comment");
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

app.get("/campgrounds/:id/comments/new", function(req, res) {
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

app.listen(process.env.PORT || 3000, process.env.IP, function() {
    console.log('The YelpCamp Server has started');
});
