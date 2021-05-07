const io = require('socket.io')();
const liveChat = require('./models/liveChatModel');

const socketapi = {
    io: io,
};

// Add your socket.io logic here!
io.on('connection', (socket) => {
    socket.on('chat message', async (msg) => {
        io.emit('chat message', msg);
        var nameArrayTempo = [
            'The Fat Dog',
            'The Phoenix',
            'Redbird',
            'The Black Cat',
            'The Thirsty Crow',
            'The Fat Cow',
            'Lucky Duck',
        ];
        const liveChatFound = await liveChat.findOneAndUpdate(
            { channel: 'global' },
            {
                $push: {
                    messages: {
                        author:
                            nameArrayTempo[
                                Math.floor(
                                    Math.random() * nameArrayTempo.length
                                )
                            ],
                        message: msg,
                    },
                },
            }
        );
        if (!liveChatFound) {
            liveChat.create({
                channel: 'global',
                messages: [
                    {
                        author:
                            nameArrayTempo[
                                Math.floor(
                                    Math.random() * nameArrayTempo.length
                                )
                            ],
                        message: msg,
                    },
                ],
            });
        }
    });
});
// end of socket.io logic

module.exports = socketapi;
