//import mongoose
const mongoose = require('mongoose')

// import the model we just created
// BlogPost represents the BlogPosts collection in the database
const Video = require('./models/videoModel')

// if my_database doesn't exist, it will be created for us
mongoose.connect('mongodb://localhost/videodatabase', {useNewUrlParser: true});

// to create a new BlogPost doc in our database, we will use 
// a function in our model called create

Video.create({CID: 'QmdUkfAMwiyPnRGNoaGjuK1JEP4W8C4raoskkdTikUAsc4',title:'12h Animal',author:{username:'nghia',emailaddress:'n@b.c'}}, (error, video) =>{
    console.log(error,video)
})

// var id = "5cb436980b33147489eadfbb";

// BlogPost.findByIdAndDelete(id, (error, blogspot) =>{
//     console.log(error,blogspot)
// })
