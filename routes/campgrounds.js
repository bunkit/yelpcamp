const express = require("express");
const router = express.Router();
const Campground = require("../models/campground");


//CAMPGROUND INDEX
router.get('/', function (req,res) {
    // GET ALL CAMPGROUNDS FROM DB
    Campground.find({}, function (err, allCampgrounds) {
        if (err) {
            console.log(err);
        } else {
            res.render('campgrounds/index', {campgrounds:allCampgrounds});
        }
    });
});

router.post('/', function(req,res) {
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

router.get('/new', function (req,res) {
    res.render('campgrounds/new');
});

router.get("/:id", function(req, res) {
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

module.exports = router;
