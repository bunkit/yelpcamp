const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const Schema = mongoose.Schema;
const ObjectId = Schema.ObjectId;

// conecting to DB
mongoose.connect('mongodb://localhost/yelp_camp', {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

//SCHEMA SETUP
const campgroundSchema = new mongoose.Schema({
    name: String,
    image: String,
    description: String
})


const Campground = mongoose.model('Campground', campgroundSchema);

//for post rncode
app.use(bodyParser.urlencoded({extended: true}));

app.set('view engine', 'ejs');

app.get('/', function (req,res) { 
    res.render('landing');
});


//  Campground.create(
//    {
//      name: "Leda Station",
//      image:
//        "https://images.unsplash.com/photo-1510312305653-8ed496efae75?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=400&q=60",
//      description:
//        "You can't override the driver without compressing the optical XML system!"
//    },
//    function(err, campground) {
//      if (err) {
//        console.log(err);
//      } else {
//        console.log(campground); 
//     }
//    }
//  );

app.get('/campgrounds', function (req,res) { 
    // Get all campgrounds from db
    Campground.find({}, function (err, allCampgrounds) {
        if (err) {
            console.log(err);
        } else {
            res.render('index', {campgrounds:allCampgrounds});
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

    // get data from form and add to camgrounds array
    // redirect back to campgrounds page
});

app.get('/campgrounds/new', function (req,res) {
    res.render('new');
});

app.get("/campgrounds/:id", function(req, res) {
    //find campground with provided id 
    Campground.findById(req.params.id, function(err,foundCampground) {
        if (err) {
            console.log(err);
        } else {
            // show the campgroun info
            res.render('show', {campground: foundCampground});
        }
    });
});

app.listen(process.env.PORT || 3000, process.env.IP, function() {
    console.log('The YelpCamp Server has started');
});
