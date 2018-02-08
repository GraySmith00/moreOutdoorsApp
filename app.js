// REQUIRE AND DEPENDENCIES
// ======================================================
const express = require('express');
const app = express();
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const methodOverride = require("method-override");

// MONGOOSE SCHEMA CONFIG
// ======================================================
const Campground = require('./models/campground');
const Comment = require('./models/comment');
const User = require('./models/user');

// ROUTE REQUIREMENTS
// ======================================================
const indexRoutes = require("./routes/index");
const campgroundRoutes = require("./routes/campgrounds");
const commentRoutes = require("./routes/comments");

// MONGOOSE CONNECTION TO DATABASE
// ======================================================
mongoose.connect("mongodb://localhost/more_outdoors_app");

// APP.SET
// ======================================================
app.set('view engine', 'ejs');

// APP.USE
// ======================================================
// body parser
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static(__dirname + "/public"));

// method override
app.use(methodOverride("_method"));

// POPULATING DATA FROM THE SEED FILE
// ======================================================
const seedDB = require("./seeds");
// seedDB();

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

// routes
app.use(indexRoutes);
app.use("/campgrounds", campgroundRoutes);
app.use("/campgrounds/:id/comments", commentRoutes);



// APP.LISTEN (START THE SERVER)
// ======================================================
app.listen(process.env.PORT, process.env.IP, function() {
    console.log(" Server is Up and Cookin!");
});