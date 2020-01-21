const express = require("express");
const router = express.Router({mergeParams:true});
const Campground = require("../models/campground");
const Comment = require("../models/comment");


router.get("/new", isLoggedin, function(req, res) {
    Campground.findById(req.params.id, function(err,campground) {
        if (err) {
            console.log(err);
        } else {
            // SHOW THE CAMPGROUND INFO
            res.render('comments/new', {campground: campground});
        }
    });
});

router.post("/", function(req, res) {
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

//middleware for login required
function isLoggedin(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }
    res.redirect("/login");
}


module.exports = router;
