const express = require('express');
const http = require('http');
const mongoose = require('mongoose');
const socketIo = require('socket.io');
const User = require('./models/User');
const Room = require('./models/Room');
const Message = require('./models/Message');
const apiRoutes = require('./routes/api');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

mongoose.connect('mongodb://localhost:27017/chat-app', {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

app.use(express.json());
app.use('/api', apiRoutes);
app.use(express.static('views'));

io.on('connection', (socket) => {
  console.log('New client connected');

  socket.on('joinRoom', async ({ userId, roomId }) => {
    const user = await User.findById(userId);
    const room = await Room.findById(roomId).populate('messages');
    socket.join(roomId);
    socket.emit('roomMessages', room.messages);
  });

  socket.on('sendMessage', async ({ userId, roomId, content }) => {
    const message = new Message({ sender: userId, room: roomId, content });
    await message.save();
    await Room.findByIdAndUpdate(roomId, { $push: { messages: message._id } });
    io.to(roomId).emit('newMessage', message);
  });

  socket.on('createRoom', async ({ userId, roomName }) => {
    const room = new Room({ name: roomName, users: [userId] });
    await room.save();
    await User.findByIdAndUpdate(userId, { $push: { rooms: room._id } });
    socket.emit('roomCreated', room);
  });

  socket.on('disconnect', () => {
    console.log('Client disconnected');
  });
});

server.listen(3000, '0.0.0.0', () => {
  console.log('Connected at 3000');
});
