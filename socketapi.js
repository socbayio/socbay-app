const io = require('socket.io')();
const liveChat = require('./models/liveChatModel');

const socketapi = {
    io,
};

const msgHandle = async (msg, lang) => {
    io.emit(lang, msg);
    const nameArrayTempo = [
        'The Fat Dog',
        'The Phoenix',
        'Redbird',
        'The Black Cat',
        'The Thirsty Crow',
        'The Fat Cow',
        'Lucky Duck',
    ];
    await liveChat.findOneAndUpdate(
        { channel: lang },
        {
            $push: {
                messages: {
                    author: nameArrayTempo[
                        Math.floor(Math.random() * nameArrayTempo.length)
                    ],
                    message: msg,
                },
            },
        }
    );
};

io.on('connection', (socket) => {
    // socket.on('chat message', msgHandle);
    socket.on('en', msgHandle);
    socket.on('vi', msgHandle);
    socket.on('zh', msgHandle);
});

module.exports = socketapi;
