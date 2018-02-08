const express = require("express");
const router = express.Router({mergeParams: true});

const Campground = require("../models/campground");
const Comment = require("../models/comment");

// COMMENTS NEW PAGE
// ======================================================
router.get("/new", isLoggedIn, function(req, res) {
    // find campground by ID
    Campground.findById(req.params.id, function(err, foundCampground) {
        if (err) {
            console.log(err);
        } else {
            res.render("comments/new", {campground: foundCampground});
        }
    });
});


// COMMENTS POST ACTION
// ======================================================
router.post("/", isLoggedIn, function(req, res) {
   // find campground by ID
   Campground.findById(req.params.id, function(err, foundCampground) {
       if (err) {
           console.log(err);
           res.redirect("/campgrounds");
       } else {
           // create new comment
           Comment.create(req.body.comment, function(err, newComment) {
               if (err) {
                   console.log(err);
                   res.redirect("/campgrounds");
               } else {
                   // connect new comment to campground
                   foundCampground.comments.push(newComment._id);
                   foundCampground.save();
                   // redirect to campground show page
                   res.redirect(`/campgrounds/${foundCampground._id}`)
               }
            });
       }
   });
});

// AUTHENTICATION - isLoggedIn MIDDLEWARE
// ======================================================
function isLoggedIn(req, res, next) {
    if(req.isAuthenticated()) {
        return next();
    }
    res.redirect("/login");
}; 


module.exports = router;