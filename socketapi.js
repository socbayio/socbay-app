const io = require('socket.io')();
const liveChat = require('./models/liveChatModel');

const socketapi = {
    io,
};

const msgHandle = async (msg, lang) => {
    io.emit(lang, msg);
    const nameArrayTempo = [
        'Fat Dog',
        'Phoenix',
        'Redbird',
        'Black Cat',
        'Thirsty Crow',
        'Fat Cow',
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
