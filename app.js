// REQUIRE AND DEPENDENCIES
// ======================================================
const express = require('express');
const app = express();
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const passport = require("passport");
const LocalStrategy = require("passport-local");


mongoose.connect("mongodb://localhost/more_outdoors_app");

// MONGOOSE SCHEMA CONFIG
// ======================================================
const Campground = require('./models/campground');
const Comment = require('./models/comment');
const User = require('./models/user');

// APP.SET
// ======================================================
app.set('view engine', 'ejs');

// PASSPORT AUTHENTICATION CONFIG
// ======================================================
app.use(require("express-session")({
    secret: "Winnie wins cutest dog!",
    resave: false,
    saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(function(req, res, next) {
   res.locals.currentUser = req.user;
   next();
});

// APP.USE
// ======================================================
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static(__dirname + "/public"));

// POPULATING DATA FROM THE SEED FILE
// ======================================================
const seedDB = require("./seeds");
// seedDB();

// LANDING PAGE
// ======================================================
app.get("/", function(req, res) {
    res.render('pages/landing');
});

// CAMPGROUNDS PAGE
// ======================================================
app.get("/campgrounds", function(req, res) {
    // Get all campgrounds from the DB
    Campground.find({}, function(err, allCampgrounds) {
        if (err) {
            console.log(err)
        } else {
            res.render("campgrounds/index", {campgrounds: allCampgrounds});
        }
    })
    
});

// CAMGROUNDS NEW PAGE
// ======================================================
app.get("/campgrounds/new", function(req, res) {
    res.render("campgrounds/new")
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
            res.render("campgrounds/show", {campground: foundCampground});
        }
    });
});

// COMMENTS NEW PAGE
// ======================================================
app.get("/campgrounds/:id/comments/new", isLoggedIn, function(req, res) {
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
app.post("/campgrounds/:id/comments", isLoggedIn, function(req, res) {
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

// AUTHENTICATION - REGISTRATIONS NEW PAGE
// ======================================================
app.get("/register", function(req, res) {
    res.render("registrations/register");
});

// AUTHENTICATION - REGISTRATIONS CREATE ACTION
// ======================================================
app.post("/register", function(req, res) {
    const newUser = new User({username: req.body.username});
    
    User.register(newUser, req.body.password, function(err, user) {
        if (err) {
            console.log(err);
            return res.render("registrations/register");
        }
        passport.authenticate("local")(req, res, function() {
            res.redirect("/campgrounds");
        });
    });
});

// AUTHENTICATION - SESSION NEW FORM (LOGIN)
// ======================================================
app.get("/login", function(req, res) {
    res.render("sessions/login");
})

// AUTHENTICATION - SESSIONS POST ACTION
// ======================================================
app.post("/login", passport.authenticate("local", {
        successRedirect: "/campgrounds",
        failureRedirect: "/login"
    }), function(req, res) {
    //using authenticate() middleware instead of populating this function
});

// AUTHENTICATION - SESSIONS DESTROY ACTION (LOGOUT)
// ======================================================
app.get("/logout", function(req, res) {
    req.logout();
    res.redirect("/campgrounds");
})









// AUTHENTICATION - isLoggedIn MIDDLEWARE
// ======================================================
function isLoggedIn(req, res, next) {
    if(req.isAuthenticated()) {
        return next();
    }
    res.redirect("/login");
}   



// APP.LISTEN (START THE SERVER)
// ======================================================
app.listen(process.env.PORT, process.env.IP, function() {
    console.log(" Server is Up and Cookin!");
});