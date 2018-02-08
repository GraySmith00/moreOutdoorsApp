const mongoose = require('mongoose');
const Campground = require("./models/campground");

const Comment = require("./models/comment");

const data = [
    {
        name: "Salmon Creek",
        image: "https://farm4.staticflickr.com/3273/2602356334_20fbb23543.jpg",
        description: "Pug lomo semiotics flexitarian portland street art. Selvage squid copper mug leggings, flannel twee roof party taxidermy man braid flexitarian +1 plaid four loko. PBR&B butcher iceland, direct trade put a bird on it crucifix af kogi."
    },
    {
        name: "Bear Claw",
        image: "https://farm8.staticflickr.com/7042/7121867321_65b5f46ef1.jpg",
        description: "Bushwick taiyaki pour-over, salvia hoodie microdosing mlkshk yuccie knausgaard forage artisan vegan fam. Heirloom fanny pack beard succulents, YOLO salvia mustache vegan church-key coloring book meditation vape listicle godard 3 wolf moon."
    },
    {
        name: "Grassy Knoll",
        image: "https://farm9.staticflickr.com/8673/15989950903_8185ed97c3.jpg",
        description: "Quinoa DIY snackwave, tousled heirloom tofu kickstarter austin. Unicorn next level vape, gluten-free farm-to-table single-origin coffee gastropub glossier bitters everyday carry. Cray vinyl readymade kickstarter pork belly yr green juice 90's raw denim godard farm-to-table kale chips beard distillery. "
    },
    {
        name: "Tumbleweed Village",
        image: "https://farm6.staticflickr.com/5628/21180664999_5bf7726851.jpg",
        description: "Gluten-free affogato helvetica, palo santo swag bushwick lo-fi wayfarers etsy. Banjo vinyl gluten-free etsy, before they sold out pickled blog vice vegan austin. Chicharrones tbh hexagon, hammock jean shorts quinoa pinterest. Church-key ethical crucifix, activated charcoal adaptogen tacos palo santo."
    }
]

function seedDB() {
    
    // Remove all campgrounds
    Campground.remove({}, function(err) {
        if(err) {
            console.log(err);
        } else {
            console.log("removed campgrounds");
            // remove comments
            Comment.remove({}, function(err) {
                if (err) {
                    console.log(err);
                } else {
                    console.log("removed Comments!");
                }
            });
            // add some campgrounds
            // data.forEach(function(seed) {
            //     Campground.create(seed, function(err, campground){
            //         if (err) {
            //             console.log(err);
            //         } else {
            //             console.log("added a campground");
            //             // add some comments
            //             Comment.create(
            //                 {
            //                     text: "This place is great but I wish there was internet",
            //                     author: "Homer"
            //                 }, function(err, comment) {
            //                     if (err) {
            //                         console.log(err);
            //                     } else {
            //                         campground.comments.push(comment._id);
            //                         campground.save();
            //                         console.log("New Comment Created!");
            //                     }
            //             });
            //         }
            //     });
            // });            
        }
    });
    
    
    

}

module.exports = seedDB;