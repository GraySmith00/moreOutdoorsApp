const express = require("express");
const router = express.Router();

const passport = require("passport");
const User = require("../models/user");

// LANDING PAGE
// ======================================================
router.get("/", function(req, res) {
    res.render('pages/landing');
});

// AUTHENTICATION - REGISTRATIONS NEW PAGE
// ======================================================
router.get("/register", function(req, res) {
    res.render("registrations/register");
});

// AUTHENTICATION - REGISTRATIONS CREATE ACTION
// ======================================================
router.post("/register", function(req, res) {
    const newUser = new User({username: req.body.username});
    
    User.register(newUser, req.body.password, function(err, user) {
        if (err) {
            console.log(err);
            req.flash("error", err.message);
            return res.render("registrations/register");
        }
        passport.authenticate("local")(req, res, function() {
            req.flash("success", `Welcome aboard partner ${user.username}`);
            res.redirect("/");
        });
    });
});

// AUTHENTICATION - SESSION NEW FORM (LOGIN)
// ======================================================
router.get("/login", function(req, res) {
    res.render("sessions/login");
})

// AUTHENTICATION - SESSIONS POST ACTION
// ======================================================
router.post("/login", passport.authenticate("local", {
        successRedirect: "/",
        failureRedirect: "/login"
    }), function(req, res) {
    //using authenticate() middleware instead of populating this function
});

// AUTHENTICATION - SESSIONS DESTROY ACTION (LOGOUT)
// ======================================================
router.get("/logout", function(req, res) {
    req.logout();
    req.flash("success", "Later Gater!")
    res.redirect("/");
})




module.exports = router;