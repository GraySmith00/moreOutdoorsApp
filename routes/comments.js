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
                   // add username and id to comment
                   newComment.author.id = req.user._id;
                   newComment.author.username = req.user.username;
                   // save comment
                   newComment.save();
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

// COMMENT EDIT PAGE
// ======================================================
router.get('/:comment_id/edit', function(req, res) {
    
    // find the campground by id
    Campground.findById(req.params.id, function(err, foundCampground) {
        if (err) {
            console.log(err);
        } else {
            // find comment by ID
            Comment.findById(req.params.comment_id, function(err, foundComment) {
                if (err) {
                    console.log(err);
                } else {
                    
                    //res.render("comments/edit", {campground: foundCampground, comment: foundComment});
                    // does the user own the comment?
                    if (req.isAuthenticated()) {
                        if (foundComment.author.id.equals(req.user.id)) {
                            res.render("comments/edit", {campground: foundCampground, comment: foundComment});
                        } else {
                            res.send("bro u cant edit other peoples comments, what u thinkin");
                        }
                    } else {
                        res.send("u gotta be logged in for that one homie");
                    }
                }
            });
        }
    });
});

// COMMENT UPDATE ACTION
// ======================================================
router.put("/:comment_id", function(req, res) {
    Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment, function(err, updatedComment) {
        if (err) {
            console.log(err);
            res.redirect("campgrounds");
        } else {
            res.redirect(`/campgrounds/${req.params.id}`);
        }
    });
});

// COMMENT DESTROY ACTION
// ======================================================


// CHECK COMMENT OWNERSHIP
// ======================================================
// function checkCommentOwnership (req, res, next) {
//     // is the user logged in?
//     if (req.isAuthenticated()) {
//         // find the campground by ID
//         Campground.findById(req.params.id, function(err, foundCampground) {
//             if (err) {
//                 console.log(err);
//                 res.redirect("back");
//             } else {
//                 // does the user own the campground?
//                 if(foundCampground.author.id.equals(req.user._id)) {
//                     // congratulations you have passed the test
//                     next();
//                 } else {
//                     res.redirect("back");
//                 }
                
//             }
//         });        
//     } else {
//         res.send("You need to be logged in to do that dawg!");
//     }
// }

// AUTHENTICATION - isLoggedIn MIDDLEWARE
// ======================================================
function isLoggedIn(req, res, next) {
    if(req.isAuthenticated()) {
        return next();
    }
    res.redirect("/login");
}; 


module.exports = router;