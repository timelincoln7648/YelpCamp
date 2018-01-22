var mongoose = require("mongoose");
var Campground = require("./models/campground");
var Comment = require("./models/comment");

//data
var testCampgrounds = [
            {name: "Big Bend", image: "https://farm4.staticflickr.com/3829/18870258055_393a564936.jpg", description: "Hammock before they sold out hexagon shoreditch glossier. Whatever butcher marfa four loko prism, pour-over cardigan +1 bitters hammock truffaut hexagon kitsch fam. Vexillologist taiyaki unicorn hell of DIY vape, kinfolk shaman VHS chillwave woke butcher. Coloring book tilde vaporware edison bulb enamel pin, art party tofu celiac truffaut vegan put a bird on it 90's flexitarian fashion axe. Thundercats wayfarers beard neutra. Whatever normcore echo park af narwhal cred fam locavore cloud bread tousled swag. Taxidermy cliche tacos, paleo photo booth listicle farm-to-table williamsburg tilde kogi."},
            {name: "National Seashore", image: "https://farm4.staticflickr.com/3212/2696101077_d8d628e1b8.jpg", description: "Tacos pickled salvia hell of, beard selvage cloud bread franzen. Kogi knausgaard lomo succulents migas pug raw denim. Flannel mixtape selfies scenester, deep v raclette health goth venmo 3 wolf moon succulents 90's. Photo booth gentrify echo park artisan occupy. Truffaut subway tile artisan enamel pin authentic ennui synth taiyaki cliche shoreditch poke succulents food truck. Intelligentsia cronut trust fund williamsburg street art."},
            {name: "Pikes Peaks", image: "https://farm5.staticflickr.com/4154/4964298263_7b6aba2094.jpg", description: "Umami portland single-origin coffee whatever iPhone keffiyeh 8-bit af pabst keytar salvia meggings. Fam affogato actually poutine seitan lo-fi disrupt jianbing etsy ramps occupy everyday carry knausgaard. Meggings mlkshk pitchfork, plaid letterpress hammock kombucha cronut tacos leggings. Vegan bitters butcher mixtape meggings irony four dollar toast, jean shorts put a bird on it mumblecore bespoke selfies hot chicken retro."}
       ];

function seedDB(){
  //clear out the database
  Campground.remove({}, function(err){
    if(err) {
      console.log("error clearing database: "+err);
    } else {
      //add in campgrounds
      testCampgrounds.forEach(function(item){
        Campground.create(item, function(err, data){
          if(err){
            console.log("there was an error creating seed data in the DB\n"+err);
          } else {
            Comment.create({text: "This place is great but there's no internet :/", author: "Leonardo Da Vinci"}, function(err, comment){
              if(err){console.log("error: "+err);}
              else {
                data.comments.push(comment._id);
                data.save()
              }
            });
          }
        });
      });
    }
  });
}

//send the function out so you can execute it in app.js
module.exports = seedDB;

