const io = require( "socket.io" )();
const liveChat = require('./models/liveChatModel')

const socketapi = {
    io: io
};

// Add your socket.io logic here!
io.on('connection', (socket) => {
    socket.on('chat message', (msg) => {
      io.emit('chat message', msg);
      var nameArrayTempo = ['The Fat Dog', 'The Phoenix', 'Redbird', 'The Black Cat', 'The Thirsty Crow', 'The Fat Cow','Lucky Duck'];
      liveChat.updateOne({channel:'global'},{ $push: { messages: {author: nameArrayTempo[Math.floor(Math.random() * nameArrayTempo.length)],message:msg} } },(error,tag)=>{console.log(error,tag)});
    });
  });
// end of socket.io logic

module.exports = socketapi;