const express = require("express");
const router = express.Router();

const Campground = require("../models/campground");

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
router.get("/new", isLoggedIn,function(req, res) {
    res.render("campgrounds/new");
});


// CAMGROUNDS CREATE ACTION
// ======================================================
router.post("/", isLoggedIn,function(req, res) {
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
router.get("/:id/edit", checkCampgroundOwnership, function(req, res) {
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
router.put("/:id", checkCampgroundOwnership,function(req, res) {
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
router.delete("/:id", checkCampgroundOwnership, function(req, res) {
    // destroy campground
    Campground.findByIdAndRemove(req.params.id, function(err) {
        if (err) {
            console.log(err);
        } else {
            res.redirect("/campgrounds");
        }
    })
})

// AUTHENTICATION - isLoggedIn MIDDLEWARE
// ======================================================
function isLoggedIn(req, res, next) {
    if(req.isAuthenticated()) {
        return next();
    }
    res.redirect("/login");
}


module.exports = router;

function checkCampgroundOwnership (req, res, next) {
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
}