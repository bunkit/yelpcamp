const express = require('express');
const app = express();



app.set('view engine', 'ejs');

app.get('/', function (req,res) { 
    res.render('landing');
});

app.get('/campgrounds', function (req,res) { 
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
    res.render('campgrounds', {campgrounds:campgrounds});
});

app.post('/campgrounds', function(req,res) {
    res.send('post hitted');
    // get data from form and add to camgrounds array
    // redirect back to campgrounds page

});

app.listen(process.env.PORT || 3000, process.env.IP, function() {
    console.log('The YelpCamp Server has started');
});
