//import mongoose
const mongoose = require('mongoose')

// import the model we just created
// BlogPost represents the BlogPosts collection in the database
const newVideo = require('./models/newVideosModel')

// if my_database doesn't exist, it will be created for us
mongoose.connect("mongodb://localhost:27017/opennetwork", {
    "auth": { "authSource": "admin" },
    "user": "ntnadmin",
    "pass": "zxcvbnm1@",
    "useNewUrlParser": true
});
// to create a new BlogPost doc in our database, we will use 
// a function in our model called create

newVideo.create({videoId: 'QmdUkfAMwiyPnRGNoaGjuK1JEP4W8C4raoskkdTikUAsc6'}, (error, newVideo) =>{
    console.log(error,newVideo)
})

// var id = "5cb436980b33147489eadfbb";

// BlogPost.findByIdAndDelete(id, (error, blogspot) =>{
//     console.log(error,blogspot)
// })
