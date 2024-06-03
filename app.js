// const express = require('express');
// const http = require('http');
// const socketIo = require('socket.io');
// const mongoose = require('mongoose');
// const axios = require('axios');
// const dotenv = require('dotenv');
// const User = require('./models/User');
// const Room = require('./models/Room');
// const Message = require('./models/Message');

// // Load environment variables from .env file
// dotenv.config();

// const app = express();
// const server = http.createServer(app);
// const io = socketIo(server);

// mongoose.connect('mongodb://localhost:27017/chat-app', {
//   useNewUrlParser: true,
//   useUnifiedTopology: true
// }).then(() => {
//   console.log('MongoDB connected');
// }).catch(err => {
//   console.error('MongoDB connection error:', err);
// });

// let users = {};

// app.use(express.static('public'));

// app.get('/', (req, res) => {
//   res.sendFile(__dirname + '/public/index.html');
// });

// io.on('connection', async (socket) => {
//   console.log('a user connected:', socket.id);

//   socket.on('set_nickname', async (nickname) => {
//     if (!nickname || nickname.trim() === "") {
//       socket.emit('error_message', 'Nickname is required');
//       return;
//     }
//     try {
//       let user = await User.findOne({ nickname });
//       if (!user) {
//         user = new User({ nickname });
//         await user.save();
//       }
//       users[socket.id] = user;
//       socket.emit('nickname_set', user.nickname);
//     } catch (error) {
//       console.error('Error setting nickname:', error);
//       socket.emit('error_message', 'Error setting nickname');
//     }
//   });

//   socket.on('get_user_rooms', async () => {
//     try {
//       const user = users[socket.id];
//       if (!user) {
//         socket.emit('error_message', 'User not found');
//         return;
//       }
//       const rooms = await Room.find({ users: user._id });
//       socket.emit('room_list', rooms);
//     } catch (error) {
//       console.error('Error getting user rooms:', error);
//       socket.emit('error_message', 'Error getting user rooms');
//     }
//   });

//   socket.on('create_room', async (roomName) => {
//     if (typeof roomName !== 'string' || roomName.trim() === "") {
//       socket.emit('error_message', 'Room name is required and must be a string');
//       return;
//     }
//     try {
//       let room = await Room.findOne({ name: roomName });
//       if (!room) {
//         room = new Room({ name: roomName });
//         await room.save();
//       }
//       const user = users[socket.id];
//       if (!user) {
//         socket.emit('error_message', 'User not found');
//         return;
//       }
//       room.users.push(user._id);
//       await room.save();
//       const rooms = await Room.find({ users: user._id });
//       socket.emit('room_list', rooms);
//     } catch (error) {
//       console.error('Error creating room:', error);
//       socket.emit('error_message', 'Error creating room');
//     }
//   });

//   socket.on('req_join_room', async (roomName) => {
//     if (typeof roomName !== 'string' || roomName.trim() === "") {
//       socket.emit('error_message', 'Room name is required and must be a string');
//       return;
//     }
//     try {
//       let room = await Room.findOne({ name: roomName });
//       if (!room) {
//         room = new Room({ name: roomName });
//         await room.save();
//       }
//       const user = users[socket.id];
//       if (!user) {
//         socket.emit('error_message', 'User not found');
//         return;
//       }
//       if (!room.users.includes(user._id)) {
//         room.users.push(user._id);
//         await room.save();
//       }
//       socket.join(roomName);
//       const messages = await Message.find({ room: room._id }).populate('sender');
//       socket.emit('room_messages', messages.map(msg => ({ _id: msg._id, text: msg.text, sender: msg.sender.nickname })));
//       io.to(roomName).emit('noti_join_room', `${user.nickname} has joined the room.`);
//     } catch (error) {
//       console.error('Error joining room:', error);
//       socket.emit('error_message', 'Error joining room');
//     }
//   });

//   socket.on('leave_room', async (roomName) => {
//     console.log(`Request to leave room: ${roomName}`); // 디버그 메시지 추가
//     if (typeof roomName !== 'string' || roomName.trim() === "") {
//       console.error('Invalid room name:', roomName); // 추가된 디버그 메시지
//       roomName = String(roomName); // 숫자인 경우 문자열로 변환
//       if (roomName.trim() === "") {
//         socket.emit('error_message', 'Room name is required and must be a string');
//         return;
//       }
//     }
//     try {
//       let room = await Room.findOne({ name: roomName });
//       const user = users[socket.id];
//       if (!room || !user) {
//         socket.emit('error_message', 'Room or user not found');
//         return;
//       }
//       room.users.pull(user._id);
//       await room.save();
//       await Message.deleteMany({ room: room._id }); // 방의 메시지를 모두 삭제
//       socket.leave(roomName);
//       socket.emit('left_room', roomName);
//       io.to(roomName).emit('noti_leave_room', `${user.nickname} has left the room.`);
//     } catch (error) {
//       console.error('Error leaving room:', error);
//       socket.emit('error_message', 'Error leaving room');
//     }
//   });

//   socket.on('req_room_message', async (msg) => {
//     if (typeof msg !== 'string' || msg.trim() === "") {
//       socket.emit('error_message', 'Message text is required and must be a string');
//       return;
//     }
//     try {
//       const user = users[socket.id];
//       if (!user) {
//         socket.emit('error_message', 'User not found');
//         return;
//       }
//       const userCurrentRoom = getUserCurrentRoom(socket);
//       if (!userCurrentRoom) {
//         socket.emit('error_message', 'You must join a room first');
//         return;
//       }
//       const room = await Room.findOne({ name: userCurrentRoom });
//       if (room) {
//         const message = new Message({ text: msg, sender: user, room });
//         await message.save();
//         io.to(userCurrentRoom).emit('noti_room_message', { _id: message._id, text: msg, sender: user.nickname });
//       }
//     } catch (error) {
//       console.error('Error sending room message:', error);
//       socket.emit('error_message', 'Error sending room message');
//     }
//   });

//   socket.on('req_summary_selected', async (selectedMessages) => {
//     try {
//       const chatContent = selectedMessages.map(msg => `${msg.sender}: ${msg.text}`).join('\n');
//       const summary = await getSummary(chatContent);
//       socket.emit('summary_result', summary);
//     } catch (error) {
//       console.error('Error generating summary:', error);
//       socket.emit('error_message', 'Error generating summary');
//     }
//   });

//   socket.on('disconnect', () => {
//     console.log('user disconnected:', socket.id);
//     delete users[socket.id];
//   });
// });

// function getUserCurrentRoom(socket) {
//   const socketRooms = Object.keys(socket.rooms);
//   for (const room of socketRooms) {
//     if (room !== socket.id) {
//       return room;
//     }
//   }
//   return null;
// }

// async function getSummary(text) {
//   try {
//     const apiKey = process.env.OPENAI_API_KEY; // .env 파일에서 API 키를 가져옴
//     const response = await axios.post('https://api.openai.com/v1/chat/completions', {
//       model: "gpt-3.5-turbo",
//       messages: [
//         { role: "system", content: "Summarize the following chat conversation in Korean." }, // 시스템 역할 지정
//         { role: "user", content: text } // 유저의 메시지를 전달
//       ],
//       max_tokens: 150, // 최대 토큰 수
//       temperature: 0.5 // 생성 온도 설정
//     }, {
//       headers: {
//         'Authorization': `Bearer ${apiKey}`, // OpenAI API 키
//         'Content-Type': 'application/json'
//       }
//     });

//     return response.data.choices[0].message.content.trim();
//   } catch (error) {
//     console.error('Error getting summary:', error);
//     throw new Error('Error getting summary');
//   }
// }

// server.listen(3000, () => {
//   console.log('Connected at 3000');
// });

const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const mongoose = require('mongoose');
const axios = require('axios');
const dotenv = require('dotenv');
const User = require('./models/User');
const Room = require('./models/Room');
const Message = require('./models/Message');

// Load environment variables from .env file
dotenv.config();

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

mongoose.connect('mongodb://localhost:27017/chat-app', {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => {
  console.log('MongoDB connected');
}).catch(err => {
  console.error('MongoDB connection error:', err);
});

let users = {};

app.use(express.static('public'));

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/public/index.html');
});

io.on('connection', async (socket) => {
  console.log('a user connected:', socket.id);

  socket.on('set_nickname', async (nickname) => {
    if (!nickname || nickname.trim() === "") {
      socket.emit('error_message', 'Nickname is required');
      return;
    }
    try {
      let user = await User.findOne({ nickname });
      if (!user) {
        user = new User({ nickname });
        await user.save();
      }
      users[socket.id] = user;
      socket.emit('nickname_set', user.nickname);
    } catch (error) {
      console.error('Error setting nickname:', error);
      socket.emit('error_message', 'Error setting nickname');
    }
  });

  socket.on('get_user_rooms', async () => {
    try {
      const user = users[socket.id];
      if (!user) {
        socket.emit('error_message', 'User not found');
        return;
      }
      const rooms = await Room.find({ users: user._id });
      socket.emit('room_list', rooms);
    } catch (error) {
      console.error('Error getting user rooms:', error);
      socket.emit('error_message', 'Error getting user rooms');
    }
  });

  socket.on('create_room', async (roomName) => {
    if (typeof roomName !== 'string' || roomName.trim() === "") {
      socket.emit('error_message', 'Room name is required and must be a string');
      return;
    }
    try {
      let room = await Room.findOne({ name: roomName });
      if (!room) {
        room = new Room({ name: roomName });
        await room.save();
      }
      const user = users[socket.id];
      if (!user) {
        socket.emit('error_message', 'User not found');
        return;
      }
      room.users.push(user._id);
      await room.save();
      const rooms = await Room.find({ users: user._id });
      socket.emit('room_list', rooms);
    } catch (error) {
      console.error('Error creating room:', error);
      socket.emit('error_message', 'Error creating room');
    }
  });

  socket.on('req_join_room', async (roomName) => {
    if (typeof roomName !== 'string' || roomName.trim() === "") {
      socket.emit('error_message', 'Room name is required and must be a string');
      return;
    }
    try {
      let room = await Room.findOne({ name: roomName });
      if (!room) {
        room = new Room({ name: roomName });
        await room.save();
      }
      const user = users[socket.id];
      if (!user) {
        socket.emit('error_message', 'User not found');
        return;
      }
      if (!room.users.includes(user._id)) {
        room.users.push(user._id);
        await room.save();
      }
      socket.join(roomName);
      const messages = await Message.find({ room: room._id }).populate('sender');
      socket.emit('room_messages', messages.map(msg => ({ _id: msg._id, text: msg.text, sender: msg.sender.nickname, timestamp: msg.createdAt })));
      io.to(roomName).emit('noti_join_room', `${user.nickname} has joined the room.`);
    } catch (error) {
      console.error('Error joining room:', error);
      socket.emit('error_message', 'Error joining room');
    }
  });

  socket.on('leave_room', async (roomName) => {
    console.log(`Request to leave room: ${roomName}`); // 디버그 메시지 추가
    if (typeof roomName !== 'string' || roomName.trim() === "") {
      console.error('Invalid room name:', roomName); // 추가된 디버그 메시지
      roomName = String(roomName); // 숫자인 경우 문자열로 변환
      if (roomName.trim() === "") {
        socket.emit('error_message', 'Room name is required and must be a string');
        return;
      }
    }
    try {
      let room = await Room.findOne({ name: roomName });
      const user = users[socket.id];
      if (!room || !user) {
        socket.emit('error_message', 'Room or user not found');
        return;
      }
      room.users.pull(user._id);
      await room.save();
      await Message.deleteMany({ room: room._id }); // 방의 메시지를 모두 삭제
      socket.leave(roomName);
      socket.emit('left_room', roomName);
      io.to(roomName).emit('noti_leave_room', `${user.nickname} has left the room.`);
    } catch (error) {
      console.error('Error leaving room:', error);
      socket.emit('error_message', 'Error leaving room');
    }
  });

  socket.on('req_room_message', async (msg) => {
    if (typeof msg.text !== 'string' || msg.text.trim() === "") {
      socket.emit('error_message', 'Message text is required and must be a string');
      return;
    }
    try {
      const user = users[socket.id];
      if (!user) {
        socket.emit('error_message', 'User not found');
        return;
      }
      const userCurrentRoom = getUserCurrentRoom(socket);
      if (!userCurrentRoom) {
        socket.emit('error_message', 'You must join a room first');
        return;
      }
      const room = await Room.findOne({ name: userCurrentRoom });
      if (room) {
        const message = new Message({ text: msg.text, sender: user, room, createdAt: msg.timestamp });
        await message.save();
        io.to(userCurrentRoom).emit('noti_room_message', { _id: message._id, text: msg.text, sender: user.nickname, timestamp: message.createdAt });
      }
    } catch (error) {
      console.error('Error sending room message:', error);
      socket.emit('error_message', 'Error sending room message');
    }
  });

  socket.on('req_summary_selected', async (selectedMessages) => {
    try {
      const chatContent = selectedMessages.map(msg => msg).join('\n');
      const summary = await getSummary(chatContent);
      socket.emit('summary_result', summary);
    } catch (error) {
      console.error('Error generating summary:', error);
      socket.emit('error_message', 'Error generating summary');
    }
  });

  socket.on('disconnect', () => {
    console.log('user disconnected:', socket.id);
    delete users[socket.id];
  });
});

function getUserCurrentRoom(socket) {
  const socketRooms = Object.keys(socket.rooms);
  for (const room of socketRooms) {
    if (room !== socket.id) {
      return room;
    }
  }
  return null;
}

async function getSummary(text) {
  try {
    const apiKey = process.env.OPENAI_API_KEY; // .env 파일에서 API 키를 가져옴
    const response = await axios.post('https://api.openai.com/v1/chat/completions', {
      model: "gpt-3.5-turbo",
      messages: [
        { role: "system", content: "Summarize the following chat conversation in Korean." }, // 시스템 역할 지정
        { role: "user", content: text } // 유저의 메시지를 전달
      ],
      max_tokens: 150, // 최대 토큰 수
      temperature: 0.5 // 생성 온도 설정
    }, {
      headers: {
        'Authorization': `Bearer ${apiKey}`, // OpenAI API 키
        'Content-Type': 'application/json'
      }
    });

    return response.data.choices[0].message.content.trim();
  } catch (error) {
    console.error('Error getting summary:', error);
    throw new Error('Error getting summary');
  }
}

server.listen(3000, () => {
  console.log('Connected at 3000');
});
