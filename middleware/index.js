// REQUIRE MODELS
// ======================================================
const Campground = require("../models/campground");
const Comment = require("../models/comment");

// ALL THE MIDDLEWARE GOES HERE
// ======================================================
const middlewareObj = {};


// CHECK CAMPGROUND OWNERSHIP
// ======================================================
middlewareObj.checkCampgroundOwnership = function checkCampgroundOwnership (req, res, next) {
    // is the user logged in?
    if (req.isAuthenticated()) {
        // find the campground by ID
        Campground.findById(req.params.id, function(err, foundCampground) {
            if (err) {
                req.flash("error", "Couldn't find that campground :/");
                res.redirect("back");
                console.log(err);
            } else {
                // does the user own the campground?
                if(foundCampground.author.id.equals(req.user._id)) {
                    // congratulations you have passed the test
                    next();
                } else {
                    req.flash("error", "You can only edit your own campgrounds dawg.");
                    res.redirect("back");
                }
                
            }
        });        
    } else {
        req.flash("error", "Gotta to be logged in to do that dawg.");
        res.redirect("/login");
    }
};


// CHECK COMMENT OWNERSHIP
// ======================================================
middlewareObj.checkCommentOwnership = function (req, res, next) {
    // is the user logged in?
    if (req.isAuthenticated()) {
        // find the comment
        Comment.findById(req.params.comment_id, function(err, foundComment) {
           if (err) {
               req.flash("error", "Couldn't find that comment :/");
               res.redirect("back");
               console.log(err);
           } else {
               // is the user authorized for this comment?
               if (foundComment.author.id.equals(req.user.id)) {
                   next();
               } else {
                    req.flash("error", "You can only edit your own comments dawg.");
                    res.redirect("back");
               }
           }
        });
    } else {
        req.flash("error", "Gotta to be logged in to do that dawg.");
        res.redirect("/login");
    }
};


// AUTHENTICATION - isLoggedIn MIDDLEWARE
// ======================================================
middlewareObj.isLoggedIn = function (req, res, next) {
    if(req.isAuthenticated()) {
        return next();
    }
    req.flash("error", "Gotta be logged in to do that dawg.");
    res.redirect("/login");
};


module.exports = middlewareObj;