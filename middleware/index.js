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
                console.log(err);
                res.redirect("back");
            } else {
                // does the user own the campground?
                if(foundCampground.author.id.equals(req.user._id)) {
                    // congratulations you have passed the test
                    next();
                } else {
                    res.redirect("back");
                }
                
            }
        });        
    } else {
        res.send("You need to be logged in to do that dawg!");
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
               console.log(err);
           } else {
               // is the user authorized for this comment?
               if (foundComment.author.id.equals(req.user.id)) {
                   next();
               } else {
                   res.send("u can't be messin w other people comments my dawg");
               }
           }
        });
    } else {
        res.send("you gotta be logged in to do that my dawg");
    }
};


// AUTHENTICATION - isLoggedIn MIDDLEWARE
// ======================================================
middlewareObj.isLoggedIn = function (req, res, next) {
    if(req.isAuthenticated()) {
        return next();
    }
    res.redirect("/login");
}


module.exports = middlewareObj;