const express = require("express");
const router = express.Router();

const Campground = require("../models/campground");
const middleware = require("../middleware");

// CAMPGROUNDS PAGE
// ======================================================
router.get("/", function(req, res) {
    // Get all campgrounds from the DB
    Campground.find({}, function(err, allCampgrounds) {
        if (err) {
            console.log(err);
        } else {
            res.render("campgrounds/index", {campgrounds: allCampgrounds});
        }
    });
    
});

// CAMGROUNDS NEW PAGE
// ======================================================
router.get("/new", middleware.isLoggedIn,function(req, res) {
    res.render("campgrounds/new");
});


// CAMGROUNDS CREATE ACTION
// ======================================================
router.post("/", middleware.isLoggedIn,function(req, res) {
    // get data from the form and add to campgrounds array
    const name = req.body.name;
    const image = req.body.image;
    const desc = req.body.description;
    const author = {
        id: req.user._id,
        username: req.user.username
    };
    const newCampground = {name: name, image: image, description: desc, author: author};
    
    // Create a new campground and save to database
    Campground.create(newCampground, function(err, newlyCreated) {
        if (err) {
            console.log(err);
        } else {
            console.log(newlyCreated);
            res.redirect("/campgrounds");
        }
    });
});

// CAMGROUNDS SHOW PAGE
// ======================================================
router.get("/:id", function(req, res) {
    // Find the campground with the provided ID
    Campground.findById(req.params.id).populate("comments").exec(function(err, foundCampground) {
        if(err) {
            console.log(err);
        } else {
            console.log(foundCampground);
            // render show template for that campground
            res.render("campgrounds/show", {campground: foundCampground});
        }
    });
});

// CAMGROUNDS EDIT PAGE
// ======================================================
router.get("/:id/edit", middleware.checkCampgroundOwnership, function(req, res) {
    // find campground by ID
    Campground.findById(req.params.id, function(err, foundCampground) {
        if (err) {
            console.log(err);
            res.redirect("back");
        } else {
            // pass data and render the edit page
            res.render("campgrounds/edit", {campground: foundCampground}); 
            console.log(foundCampground);
        }
    });
    
});

// CAMGROUNDS UPDATE ACTION
// ======================================================
router.put("/:id", middleware.checkCampgroundOwnership,function(req, res) {
    // find and update the correct campground
    Campground.findByIdAndUpdate(req.params.id, req.body.campground, function(err, updatedCampground) {
        if (err) {
            console.log(err);
            res.redirect("/campgrounds");
        } else {
            res.redirect(`/campgrounds/${req.params.id}`);
        }
    });
});

// CAMGROUNDS DESTROY ACTION
// ======================================================
router.delete("/:id", middleware.checkCampgroundOwnership, function(req, res) {
    // destroy campground
    Campground.findByIdAndRemove(req.params.id, function(err) {
        if (err) {
            console.log(err);
        } else {
            res.redirect("/campgrounds");
        }
    });
});











module.exports = router;

