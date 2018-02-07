// REQUIRE AND DEPENDENCIES
// ======================================================
const express = require('express');
const app = express();
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const seedDB = require("./seeds");

mongoose.connect("mongodb://localhost/more_outdoors_app");

// MONGOOSE SCHEMA CONFIG
// ======================================================
const Campground = require('./models/campground')

// APP.SET
// ======================================================
app.set('view engine', 'ejs');

// APP.USE
// ======================================================
app.use(bodyParser.urlencoded({extended: true}));

// POPULATING DATA FROM THE SEED FILE
// ======================================================
seedDB();

// LANDING PAGE
// ======================================================
app.get("/", function(req, res) {
    res.render('landing');
});

// CAMPGROUNDS PAGE
// ======================================================
app.get("/campgrounds", function(req, res) {
    // Get all campgrounds from the DB
    Campground.find({}, function(err, allCampgrounds) {
        if (err) {
            console.log(err)
        } else {
            res.render("index", {campgrounds: allCampgrounds});
        }
    })
    
});

// CAMGROUNDS NEW PAGE
// ======================================================
app.get("/campgrounds/new", function(req, res) {
    res.render("new")
});


// CAMGROUNDS CREATE ACTION
// ======================================================
app.post("/campgrounds", function(req, res) {
    // get data from the form and add to campgrounds array
    const name = req.body.name;
    const image = req.body.image;
    const desc = req.body.description;
    const newCampground = {name: name, image: image, description: desc};
    
    // Create a new campground and save to database
    Campground.create(newCampground, function(err, newlyCreated) {
        if (err) {
            console.log(err);
        } else {
            res.redirect("/campgrounds");
        }
    })
});

// CAMGROUNDS SHOW PAGE
// ======================================================
app.get("/campgrounds/:id", function(req, res) {
    // Find the campground with the provided ID
    Campground.findById(req.params.id).populate("comments").exec(function(err, foundCampground) {
        if(err) {
            console.log(err);
        } else {
            console.log(foundCampground);
            // render show template for that campground
            res.render("show", {campground: foundCampground});
        }
    })
    
})



















// APP.LISTEN (START THE SERVER)
// ======================================================
app.listen(process.env.PORT, process.env.IP, function() {
    console.log(" Server is Up and Cookin!");
});