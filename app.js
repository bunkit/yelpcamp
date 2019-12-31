const express = require('express');
const app = express();
const bodyParser = require('body-parser');

 let campgrounds = [
        {
            name: "Thelma Fort",
            image: "http://lorempixel.com/500/250/city/1"
        },
        {
            name: "Hamill Estate",
            image: "http://lorempixel.com/500/250/city/2"
        },
        {
            name: "Anderson Ville",
            image: "http://lorempixel.com/500/250/city/3"
        },
        {
            name: "Reichert Ferry",
            image: "http://lorempixel.com/500/250/city/4"
        },
        {
            name: "Larkin Trafficway",
            image: "http://lorempixel.com/500/250/city/5"
        },
        {
            name: "Oberbrunner Haven",
            image: "http://lorempixel.com/500/250/city/6"
        },
        {
            name: "Gilberto Course",
            image: "http://lorempixel.com/500/250/city/7"
        },
        {
            name: "Reynolds Knolls",
            image: "http://lorempixel.com/500/250/city/8"
        },
        {
            name: "Gutkowski Terrace",
            image: "http://lorempixel.com/500/250/city/9"
        },
        {
            name: "Chadd Points",
            image: "http://lorempixel.com/500/250/city/10"
        }
    ];
//for post rncode
app.use(bodyParser.urlencoded({extended: true}));

app.set('view engine', 'ejs');

app.get('/', function (req,res) { 
    res.render('landing');
});

app.get('/campgrounds', function (req,res) { 
    res.render('campgrounds', {campgrounds:campgrounds});
});

app.post('/campgrounds', function(req,res) {
    let name = req.body.name;
    let image = req.body.image;
    let newCampground = {name: name, image:image}
    campgrounds.push(newCampground);

    res.redirect('/campgrounds');
    // get data from form and add to camgrounds array
    // redirect back to campgrounds page
});

app.get('/campgrounds/new', function (req,res) {
    res.render('new');
})

app.listen(process.env.PORT || 3000, process.env.IP, function() {
    console.log('The YelpCamp Server has started');
});
