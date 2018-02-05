// REQUIRE AND DEPENDENCIES
// ======================================================
const express = require('express');
const app = express();
const bodyParser = require("body-parser");

// APP.SET
// ======================================================
app.set('view engine', 'ejs');

// APP.USE
// ======================================================
app.use(bodyParser.urlencoded({extended: true}));

// LANDING PAGE
// ======================================================
app.get("/", function(req, res) {
    res.render('landing');
});


// CAMPGROUNDS PAGE
// ======================================================

 const campgrounds = [
            {name: "Salmon Creek", image: "https://farm4.staticflickr.com/3273/2602356334_20fbb23543.jpg"},
            {name: "Bear Claw", image: "https://farm8.staticflickr.com/7042/7121867321_65b5f46ef1.jpg"},
            {name: "Grassy Knoll", image: "https://farm9.staticflickr.com/8673/15989950903_8185ed97c3.jpg"},
            {name: "Tumbleweed Village", image: "https://farm6.staticflickr.com/5628/21180664999_5bf7726851.jpg"},
            {name: "Woodsy Palace", image: "https://farm4.staticflickr.com/3686/9702289969_e54a47d7a8.jpg"},
            {name: "Hidden Treasures", image: "https://farm9.staticflickr.com/8459/7930007382_40143bbeb1.jpg"}
        ]
        
app.get("/campgrounds", function(req, res) {
    res.render("campgrounds", {campgrounds: campgrounds});
});

app.post("/campgrounds", function(req, res) {
    // get data from the form and add to campgrounds array
    const name = req.body.name;
    const image = req.body.image;
    const newCampground = {name: name, image: image};
    
    campgrounds.push(newCampground);
    //redirect back to the campgrounds page
    res.redirect("/campgrounds");
});

// CAMGROUNDS NEW PAGE
// ======================================================
app.get("/campgrounds/new", function(req, res) {
    res.render("new")
});












// APP.LISTEN (START THE SERVER)
// ======================================================
app.listen(process.env.PORT, process.env.IP, function() {
    console.log(" Server is Up and Cookin!");
});