const mongoose = require('mongoose');
const Campground = require("./models/campground");

const Comment = require("./models/comment");

const data = [
    {
        name: "Salmon Creek",
        image: "https://farm4.staticflickr.com/3273/2602356334_20fbb23543.jpg",
        price: "39.95",
        author: {
            id: "5a7b6de18a25ef4ec8f3ce52", 
            username: 'Jimbone' 
        },
        description: "Pug lomo semiotics flexitarian portland street art. Selvage squid copper mug leggings, flannel twee roof party taxidermy man braid flexitarian +1 plaid four loko. PBR&B butcher iceland, direct trade put a bird on it crucifix af kogi."
    },
    {
        name: "Bear Claw",
        image: "https://farm8.staticflickr.com/7042/7121867321_65b5f46ef1.jpg",
        price: "39.95",
        author: {
            id: "5a7b6de18a25ef4ec8f3ce52", 
            username: 'Jimbone' 
        },
        description: "Bushwick taiyaki pour-over, salvia hoodie microdosing mlkshk yuccie knausgaard forage artisan vegan fam. Heirloom fanny pack beard succulents, YOLO salvia mustache vegan church-key coloring book meditation vape listicle godard 3 wolf moon."
    },
    {
        name: "Grassy Knoll",
        image: "https://farm9.staticflickr.com/8673/15989950903_8185ed97c3.jpg",
        price: "39.95",
        author: {
            id: "5a7b6de18a25ef4ec8f3ce52", 
            username: 'Jimbone' 
        },
        description: "Quinoa DIY snackwave, tousled heirloom tofu kickstarter austin. Unicorn next level vape, gluten-free farm-to-table single-origin coffee gastropub glossier bitters everyday carry. Cray vinyl readymade kickstarter pork belly yr green juice 90's raw denim godard farm-to-table kale chips beard distillery. "
    },
    {
        name: "Tumbleweed Village",
        image: "https://farm6.staticflickr.com/5628/21180664999_5bf7726851.jpg",
        price: "39.95",
        author: {
            id: "5a7b6de18a25ef4ec8f3ce52", 
            username: 'Jimbone' 
        },
        description: "Gluten-free affogato helvetica, palo santo swag bushwick lo-fi wayfarers etsy. Banjo vinyl gluten-free etsy, before they sold out pickled blog vice vegan austin. Chicharrones tbh hexagon, hammock jean shorts quinoa pinterest. Church-key ethical crucifix, activated charcoal adaptogen tacos palo santo."
    },
    {
        name: "Camp Cluster",
        image: "https://images.unsplash.com/photo-1518062304627-5532ae8c3ff2?ixlib=rb-0.3.5&ixid=eyJhcHBfaWQiOjEyMDd9&s=a3acc6e76323327d75c0eb9d3d623d1d&auto=format&fit=crop&w=1336&q=80",
        price: "39.95",
        author: {
            id: "5a7b6de18a25ef4ec8f3ce52", 
            username: 'Jimbone' 
        },
        description: "Lorem ipsum dolor amet lyft umami cold-pressed iPhone. Franzen flannel authentic, tousled banjo yuccie chillwave. Deep v forage taxidermy ugh YOLO. Stumptown semiotics pop-up cold-pressed, single-origin coffee hammock +1 wolf banjo slow-carb activated charcoal chambray enamel pin gastropub direct trade."
    },
        {
        name: "Hip Tents for Hipsters",
        image: "https://images.unsplash.com/photo-1468956398224-6d6f66e22c35?ixlib=rb-0.3.5&ixid=eyJhcHBfaWQiOjEyMDd9&s=5d2e4d45d037053be722233b79bd0510&auto=format&fit=crop&w=1955&q=80",
        price: "39.95",
        author: {
            id: "5a7b6de18a25ef4ec8f3ce52", 
            username: 'Jimbone' 
        },
        description: "Ennui affogato jianbing, banh mi glossier tofu cornhole you probably haven't heard of them. Art party portland actually, stumptown distillery salvia polaroid paleo everyday carry pork belly cardigan chicharrones. Ethical marfa single-origin coffee, tofu put a bird on it aesthetic celiac echo park polaroid man bun intelligentsia 8-bit. Fashion axe gluten-free hella ethical, iPhone everyday carry DIY +1."
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
            data.forEach(function(seed) {
                Campground.create(seed, function(err, campground){
                    if (err) {
                        console.log(err);
                    } else {
                        console.log("added a campground");
                        // add some comments
                        Comment.create(
                            {
                                text: "This place is great but I wish there was internet",
                                author: {
                                    id: "5a7b6de18a25ef4ec8f3ce52", 
                                    username: 'Jimbone' 
                                }
                            }, function(err, comment) {
                                if (err) {
                                    console.log(err);
                                } else {
                                    campground.comments.push(comment._id);
                                    campground.save();
                                    console.log("New Comment Created!");
                                }
                        });
                    }
                });
            });            
        }
    });
    
    
    

}

module.exports = seedDB;