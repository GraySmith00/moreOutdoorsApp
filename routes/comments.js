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
                   res.redirect(`/campgrounds/${foundCampground._id}`);
               }
            });
       }
   });
});

// COMMENT EDIT PAGE
// ======================================================
router.get('/:comment_id/edit', checkCommentOwnership,function(req, res) {
    
    Comment.findById(req.params.comment_id, function(err, foundComment) {
       if (err) {
           console.log(err);
       } else {
           res.render("comments/edit", {campground_id: req.params.id, comment: foundComment});
       }
    });
});

// COMMENT UPDATE ACTION
// ======================================================
router.put("/:comment_id", checkCommentOwnership,function(req, res) {
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
router.delete("/:comment_id", checkCommentOwnership, function(req, res) {
    // res.send("bout to delete dat comment boi")
    Comment.findByIdAndRemove(req.params.comment_id, function(err) {
        if (err) {
            console.log(err);
        } else {
            res.redirect(`/campgrounds/${req.params.id}`);
        }
    });
});

// CHECK COMMENT OWNERSHIP
// ======================================================
function checkCommentOwnership (req, res, next) {
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
}

// AUTHENTICATION - isLoggedIn MIDDLEWARE
// ======================================================
function isLoggedIn(req, res, next) {
    if(req.isAuthenticated()) {
        return next();
    }
    res.redirect("/login");
} 


module.exports = router;