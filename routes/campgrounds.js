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
    const price = req.body.price;
    const desc = req.body.description;
    const author = {
        id: req.user._id,
        username: req.user.username
    };
    const newCampground = {name: name, image: image, price: price, description: desc, author: author};
    
    // Create a new campground and save to database
    Campground.create(newCampground, function(err, newlyCreated) {
        if (err) {
            req.flash("error", "Couldn't create the campground :/");
            res.redirect("back");
            console.log(err);
        } else {
            console.log(newlyCreated);
            req.flash("success", "Aye new campground comin atcha!!!");
            res.redirect(`/campgrounds/${newlyCreated.id}`);
        }
    });
});

// CAMGROUNDS SHOW PAGE
// ======================================================
router.get("/:id", function(req, res) {
    // Find the campground with the provided ID
    Campground.findById(req.params.id).populate("comments").exec(function(err, foundCampground) {
        if(err) {
            req.flash("error", "Couldn't find that campground :/");
            res.redirect("back");
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
            req.flash("error", "Couldn't find that campground :/");
            res.redirect("back");
            console.log(err);
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
            req.flash("error", "Couldn't find that campground :/");
            res.redirect("back");
            console.log(err);
        } else {
            req.flash("success", "Campground Updated!");
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
            req.flash("error", "Couldn't find that campground :/");
            res.redirect("back");
            console.log(err);
        } else {
            req.flash("success", "That campground is a goner!");
            res.redirect("/campgrounds");
        }
    });
});











module.exports = router;

