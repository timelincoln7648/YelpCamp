var express = require("express"),
  app = express(),
  bodyParser = require("body-parser"),  
  mongoose = require("mongoose"),
  passport = require("passport"),
  LocalStrategy = require("passport-local"),
  Campground = require("./models/campground"),
  Comment = require("./models/comment"),
  User = require("./models/user"),
  seedDB = require("./seeds")





//general setup
mongoose.connect("mongodb://localhost/yelp_camp");
app.set("view engine", "ejs");
app.use(express.static(__dirname+"/public"));
app.use(bodyParser.urlencoded({extended: true}));
seedDB();


//PASSPORT config
app.use(require("express-session")({
  secret: "cheese puffs",
  resave: false,
  saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


//MIDDLEWARES

//this will run as middleware on every single route

app.use(function(req, res, next){
  res.locals.currentUser = req.user;
  next();
});


//
//ROUTES
//


//root
app.get("/", function(req, res){
   res.render("landing"); 
});

//INDEX
app.get("/campgrounds", function(req, res){
  Campground.find({}, function(err, campgrounds){
    if(err){
      console.log("error finding campgrounds: "+err);
    } else {
      res.render("campgrounds/index", {data: campgrounds});
    }
  });
});

//CREATE
app.post("/campgrounds", function(req, res){
   //get data from form and add to DB
   var newCampground = {name: req.body.nameInputText, 
                        image: req.body.imageURLInputText, 
                        description: req.body.descriptionInputText
                       };
  
  Campground.create(newCampground, function(err, newlyCreated){
    if(err){
      console.log("There was an error creating the new campground :/");
      console.log(err);
    } else {
      res.redirect("/campgrounds");
    }
  });
});

//NEW
app.get("/campgrounds/new", function(req, res) {
    //show the form to submit a new campground
    res.render("campgrounds/new");
})

//SHOW - shows more info about a particular campground
app.get("/campgrounds/:id", function(req, res){
  //find campground with given id
  //render show template for that campground
  
  Campground.findById(req.params.id).populate("comments").exec( function(err, foundCampground){
    if(err){
      console.log("There was an error finding the campground :/");
      console.log(err);
    } else {
      res.render("campgrounds/show", {campground: foundCampground});
    }
  });
});



//
//COMMENTS ROUTES
//

//Show new comment form
app.get("/campgrounds/:id/comments/new", isLoggedIn, function(req, res){
  //find campground by id
  Campground.findById(req.params.id, function(err, campground){
    if(err) {console.log(err);}
    else {
      res.render("comments/new", {campground: campground});
    }
  });
});

//POST new comment
app.post("/campgrounds/:id/comments", isLoggedIn, function(req, res){
  //lookup campground using id
  Campground.findById(req.params.id, function(err, campground){
    if(err){console.log(err); res.redirect("/campgrounds");}
    else{
      //create new comment
      Comment.create(req.body.comment, function(err, comment){
        if(err){console.log(err);}
        else {
          //connect new comment to campground
          campground.comments.push(comment);
          campground.save();
          //redirect back to campground SHOW page
          res.redirect("/campgrounds/"+campground._id);
        }
      })
    }
  });
});


//AUTH routes

//show the registration form
app.get("/register", function(req, res){
  res.render("register");
});

//register the user
app.post("/register", function(req, res){
  var newUser = new User({username: req.body.username});
  //signup the user 
  User.register(newUser, req.body.password, function(err, user){
    if(err){
      console.log("Error registering user: "+err);
      return res.render("register");
    }
    //login the user and redirect 
    passport.authenticate("local")(req, res, function(){
      res.redirect("/campgrounds");
    });
  });
});

//LOGIN 
//show login form
app.get("/login", function(req, res){
  res.render("login");
})

//handle login
app.post("/login", passport.authenticate("local", 
  {
    successRedirect: "/campgrounds", 
    failureRedirect: "/login"
  }), function(req, res){
  
});

//LOGOUT
app.get("/logout", function(req, res){
  req.logout();
  res.redirect("/campgrounds");
});


//isLoggedIn

function isLoggedIn(req, res, next){
  if(req.isAuthenticated()){
    return next();
  }
  res.redirect("/login");
}


//start server
app.listen(3000, function() {
  console.log('Server listening on port 3000');
});





//TEST
// Campground.create(
//   {
//     name: "National Seashore", 
//     image: "https://farm4.staticflickr.com/3212/2696101077_d8d628e1b8.jpg",
//     description: "This is a very, very long beach. There is so much sand. Beautiful!"
//   }, function(err, campground){
//     if(err){
//       console.log("oops Error!: "+err);
//     } else {
//       console.log("Yay we created this campground: "+campground);
//     }
//   });