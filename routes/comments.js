const express = require("express");
const router = express.Router({mergeParams: true});

const Campground = require("../models/campground");
const Comment = require("../models/comment");
const middleware = require("../middleware");

// COMMENTS NEW PAGE
// ======================================================
router.get("/new", middleware.isLoggedIn, function(req, res) {
    // find campground by ID
    Campground.findById(req.params.id, function(err, foundCampground) {
        if (err) {
            req.flash("error", "Couldn't find that campground :/");
            res.redirect("back");
            console.log(err);
        } else {
            res.render("comments/new", {campground: foundCampground});
        }
    });
});


// COMMENTS POST ACTION
// ======================================================
router.post("/", middleware.isLoggedIn, function(req, res) {
   // find campground by ID
   Campground.findById(req.params.id, function(err, foundCampground) {
       if (err) {
            req.flash("error", "Couldn't find that campground :/");
            res.redirect("back");
            console.log(err);
       } else {
           // create new comment
           Comment.create(req.body.comment, function(err, newComment) {
               if (err) {
                    req.flash("error", "Couldn't create that comment :/");
                    res.redirect("back");
                    console.log(err);
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
                   req.flash("success", "New comment comin' in hot!");
                   res.redirect(`/campgrounds/${foundCampground._id}`);
               }
            });
       }
   });
});

// COMMENT EDIT PAGE
// ======================================================
router.get('/:comment_id/edit', middleware.checkCommentOwnership,function(req, res) {
    
    Comment.findById(req.params.comment_id, function(err, foundComment) {
       if (err) {
            req.flash("error", "Couldn't find that comment :/");
            res.redirect("back");
            console.log(err);
       } else {
           res.render("comments/edit", {campground_id: req.params.id, comment: foundComment});
       }
    });
});

// COMMENT UPDATE ACTION
// ======================================================
router.put("/:comment_id", middleware.checkCommentOwnership,function(req, res) {
    Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment, function(err, updatedComment) {
        if (err) {
            req.flash("error", "Couldn't update that comment :/");
            res.redirect("back");
            console.log(err);
        } else {
            req.flash("success", "Newly updated comment comin' in hot!");
            res.redirect(`/campgrounds/${req.params.id}`);
        }
    });
});

// COMMENT DESTROY ACTION
// ======================================================
router.delete("/:comment_id", middleware.checkCommentOwnership, function(req, res) {
    // res.send("bout to delete dat comment boi")
    Comment.findByIdAndRemove(req.params.comment_id, function(err) {
        if (err) {
            req.flash("error", "Couldn't delete that comment :/");
            res.redirect("back");
            console.log(err);
        } else {
            req.flash("success", "So long comment, nice knowin' ya!");
            res.redirect(`/campgrounds/${req.params.id}`);
        }
    });
});




module.exports = router;