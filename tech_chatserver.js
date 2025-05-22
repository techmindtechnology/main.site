const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const mongoose = require('mongoose');

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: "http://yourwebsite.com", // Replace with your frontend URL
    methods: ["GET", "POST"],
    credentials: true
  }
});

// MongoDB Connection
mongoose.connect('mongodb://localhost:27017/youngmindtech', {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log('MongoDB connected for chat'))
.catch(err => console.log(err));

// Chat Message Schema
const MessageSchema = new mongoose.Schema({
  user: { type: String, required: true },
  text: { type: String, required: true },
  timestamp: { type: Date, default: Date.now },
  isSupport: { type: Boolean, default: false }
});

const Message = mongoose.model('Message', MessageSchema);

// Stores active support connections
const activeSupport = new Set();
const activeUsers = new Map(); // userId -> socket.id

io.on('connection', (socket) => {
  console.log('New client connected');
  
  // User joining chat
  socket.on('userJoin', (userId) => {
    activeUsers.set(userId, socket.id);
    
    // Load previous messages for this user
    Message.find({ user: userId })
      .sort({ timestamp: 1 })
      .limit(50)
      .then(messages => {
        socket.emit('previousMessages', messages);
      });
      
    // Send notification to support team if available
    if (activeSupport.size > 0) {
      io.to([...activeSupport][0]).emit('newUserNotification', { userId });
    }
  });
  
  // Support agent joining
  socket.on('supportJoin', (agentId) => {
    socket.join('support');
    activeSupport.add(socket.id);
    console.log('Support agent connected:', agentId);
  });
  
  // User sending a message
  socket.on('userMessage', async ({ userId, message }) => {
    // Save message to database
    const newMessage = new Message({
      user: userId,
      text: message,
      isSupport: false
    });
    
    await newMessage.save();
    
    // If support is online, route to them
    if (activeSupport.size > 0) {
      io.to([...activeSupport][0]).emit('newMessage', {
        userId,
        message,
        timestamp: new Date()
      });
    } else {
      // Auto-response if no support available
      setTimeout(async () => {
        let response;
        
        if (message.toLowerCase().includes('pricing')) {
          response = "Our pricing depends on your specific project requirements. Would you like to schedule a free consultation?";
        } else if (message.toLowerCase().includes('contact')) {
          response = "You can reach our team at youngmindtech@gmail.com or call us at +233(0) 533 980 571.";
        } else {
          response = "Thank you for your message! Our support team is currently offline. We'll get back to you as soon as possible.";
        }
        
        // Save auto-response to database
        const autoResponse = new Message({
          user: userId,
          text: response,
          isSupport: true
        });
        
        await autoResponse.save();
        
        // Send back to user
        if (activeUsers.has(userId)) {
          io.to(activeUsers.get(userId)).emit('supportMessage', {
            message: response,
            timestamp: new Date(),
            isAutomatic: true
          });
        }
      }, 1000);
    }
  });
  
  // Support sending a message
  socket.on('supportMessage', async ({ userId, message, agentId }) => {
    // Save message to database
    const newMessage = new Message({
      user: userId,
      text: message,
      isSupport: true
    });
    
    await newMessage.save();
    
    // Send to user if online
    if (activeUsers.has(userId)) {
      io.to(activeUsers.get(userId)).emit('supportMessage', {
        message,
        timestamp: new Date(),
        agentId
      });
    }
  });
  
  // Disconnect handling
  socket.on('disconnect', () => {
    console.log('Client disconnected');
    
    // Remove from active support if applicable
    if (activeSupport.has(socket.id)) {
      activeSupport.delete(socket.id);
    }
    
    // Remove from active users
    for (const [userId, socketId] of activeUsers.entries()) {
      if (socketId === socket.id) {
        activeUsers.delete(userId);
        break;
      }
    }
  });
});

const PORT = process.env.PORT || 5001;
server.listen(PORT, () => console.log(`Chat server running on port ${PORT}`));