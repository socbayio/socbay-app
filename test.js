//import mongoose
const mongoose = require('mongoose')

// import the model we just created
// BlogPost represents the BlogPosts collection in the database
const video = require('./models/videoModel')

// if my_database doesn't exist, it will be created for us
mongoose.connect("mongodb://localhost:27017/crustlive", {
    "auth": { "authSource": "admin" },
    "user": "ntn",
    "pass": "wv%nzw=VY$fMwV4",
    "useNewUrlParser": true
});
// to create a new BlogPost doc in our database, we will use 
// a function in our model called create

video.findByIdAndUpdate('607559a599b02423a46ca432',{$inc : {'view' : 1}},(error,video)=>{

    console.log(error,video);
})

// var id = "5cb436980b33147489eadfbb";

// BlogPost.findByIdAndDelete(id, (error, blogspot) =>{
//     console.log(error,blogspot)
// })
