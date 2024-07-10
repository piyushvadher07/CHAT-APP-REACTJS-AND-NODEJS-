const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const cors = require('cors');

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
    cors: {
        origin: '*',
        methods: ['GET', 'POST']
    }
});

app.use(cors());

const PORT = process.env.PORT || 4000;


io.on('connection', (socket) => {
    console.log('New client connected');

    socket.on('joinRoom', ({ name, room }) => {
        socket.join(room);
        io.to(room).emit('message', { sender: 'System', text: `${name} has joined the room!` });

        socket.on('sendMessage', (message) => {
            io.to(room).emit('message', { sender: name, text: message });
        });

        socket.on('disconnect', () => {
            io.to(room).emit('message', { sender: 'System', text: `${name} has left the room.` });
        });
    });

    socket.on('disconnect', () => {
        console.log('Client disconnected');
    });
});

server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
