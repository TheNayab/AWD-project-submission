// const express = require("express");
// const cors = require("cors");
// const cookieParser = require("cookie-parser");
// const helmet = require('helmet');
// const db = require("./DB/db.js");
// const router = require("./routes/routes.js");
// const admin_router = require("./routes/admin_routes.js");
// const chats_router = require("./routes/chats_routes.js");
// const company_router = require("./routes/company_routes.js");

// // const conn = require("./conn/conn");
// require("dotenv").config();

// const app = express();

// app.get("/", (req, res) => {
//   res.send("Hello, world!");
// });

// app.use(cors());
// app.use(express.json());
// app.use(cookieParser());
// app.use(helmet())

// app.use(express.json());
// app.use(express.urlencoded({ extended: true }));

// const port = process.env.PORT || 6000;

// app.use("/api/v1", router);
// app.use("/api/v1/admin", admin_router);
// app.use("/api/v1/company", company_router);
// app.use("/api/v1/chats", chats_router);

// app.listen(port, () => {
//   console.log(`App is listening on port ${port}!`);
// });

const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const helmet = require("helmet");
const http = require("http");
const socketIo = require("socket.io");
const db = require("./DB/db.js");
const router = require("./routes/routes.js");
const admin_router = require("./routes/admin_routes.js");
const chats_router = require("./routes/chats_routes.js");
const company_router = require("./routes/company_routes.js");
const employee_router = require("./routes/employee_routes.js");
const whatsapp_router = require("./routes/whatsapp_chats_routes.js");
const fb_messenger_router = require("./routes/fb_messenger_chat_routes.js");
const sms_router = require("./routes/sms_routes.js");
const { Server } = require("https");

require("dotenv").config();

const app = express();

app.get("/", (req, res) => {
  res.send("Hello, world!");
});

app.use(cors());
app.use(express.json());
app.use(cookieParser());
app.use(helmet());

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const port = process.env.PORT || 7000;

const server = http.createServer(app);

const io = socketIo(server, {
  // Use socketIo with the http server
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
    credentials: true,
  },
});

app.use((req, res, next) => {
  req.io = io;
  next();
});

// io.on("connection", (socket) => {
//   console.log(`User connected: ${socket.id}`);

//     // Join a room when a user connects
//     // socket.on('joinRoom', (roomName) => {
//     //   socket.join(roomName);
//     //   console.log(`User ${socket.id} joined room: ${roomName}`);
//     // });
//   // Emit the 'contactsUpdated' event to all connected clients
//   socket.on("updateContacts", () => {
//     io.emit("contactsUpdated");
//   });

//   socket.on("chatMessage", (data) => {
//     console.log("Received message:", JSON.stringify(data));
//     // io.to(socket.id).emit("chatMessage", data);
//       // Emit the chat message to all users in the same room
//       io.to(data.receiver_id).emit('chatMessage', data);
//       // io.to(data.sender_id).emit('chatMessage', data);

//     console.log(data)
//     // console.log(socket)

//   });

//   socket.on("disconnect", () => {
//     console.log("A user disconnected");
//   });
// });

// Initialize a map to store socket IDs associated with user IDs
const userSocketMap = new Map();

io.on("connection", (socket) => {
  // console.log(`User connected: ${socket.id}`);

  // Store the user's socket ID along with their user ID
  socket.on("storeUserId", (userId) => {
    userSocketMap.set(userId, socket.id);
    // console.log(`User ${userId} is associated with socket ID ${socket.id}`);
  });

  // Handle disconnection
  socket.on("disconnect", () => {
    // Remove the user's socket ID from the mapping
    userSocketMap.forEach((value, key) => {
      if (value === socket.id) {
        userSocketMap.delete(key);
        // console.log(`User ${key} disconnected and removed from mapping`);
      }
    });
    // console.log("A user disconnected");
  });

  // Handle logout event
  //  socket.on("logout", (data) => {
  //   console.log(`User with ID ${data.userId} logged out`);
  //   io.emit("logout", data); // Emit logout event to all connected clients except the current one
  // });
  // Handle logout event
  //  socket.on("employee-logout", (data) => {
  //   console.log(`User with ID ${data.userId} logged out`);
  //   io.emit("employee-logout", data); // Emit logout event to all connected clients except the current one
  // });

  // Handle sending chat messages
  socket.on("chatMessage", (data) => {
    try {
      // console.log("Received message:", data);

      // Retrieve the receiver's socket ID from the mapping
      const receiverSocketId = userSocketMap.get(data.receiver_id);
      const senderSocketId = userSocketMap.get(data.sender_id);

      if (receiverSocketId) {
        // Emit the chat message directly to the receiver's socket
        io.to(receiverSocketId).emit("chatMessage", data);
        console.log("Message sent to receiver:", data.receiver_id);
      } else {
        console.log("Receiver not found or offline:", data.receiver_id);
        // Handle the case where the receiver is not found or offline
        // You can emit an error message back to the sender, for example
      }

      // Emit the chat message directly to the sender's socket
      if (senderSocketId) {
        io.to(senderSocketId).emit("chatMessage", data);
        console.log("Message sent to sender:", data.sender_id);
      } else {
        console.log("Sender not found or offline:", data.sender_id);
        // Handle the case where the sender is not found or offline
      }
    } catch (error) {
      console.error("Error handling chatMessage:", error);
    }
  });
});

app.use("/api/v1", router);
app.use("/api/v1/admin", admin_router);
app.use("/api/v1/company", company_router);
app.use("/api/v1/employee", employee_router);
app.use("/api/v1/chats", chats_router);
app.use("/api/v1/whatsapp", whatsapp_router);
app.use("/api/v1/sms", sms_router);
app.use("/api/v1/fb-messenger", fb_messenger_router);

server.listen(port, () => {
  console.log(`App is listening on port ${port}!`);
});
