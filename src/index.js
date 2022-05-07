const path = require("path");
const http = require("http");
const express = require("express");
const socketio = require("socket.io");
const Filter = require("bad-words");
const { generateMessage, generateLocation } = require("./utils/messages");
const {
  addUsers,
  removeUser,
  getUser,
  getUserInRoom,
} = require("./utils/users");
require("dotenv/config");

const app = express();
const server = http.createServer(app);

const io = socketio(server);

const port = process.env.PORT || 3000;

app.use(express.static(path.join(__dirname, "../public")));

io.on("connection", (socket) => {
  console.log("New WebSocket Connection");

  socket.on("join", (options, callback) => {
    const { error, user } = addUsers({ id: socket.id, ...options });

    if (error) {
      return callback(error);
    }
    socket.join(user.room);

    socket.emit("message", generateMessage("Welcome", "Admin"));
    socket.broadcast
      .to(user.room)
      .emit("message", generateMessage(`${user.username} has joined`, "Admin"));
    callback();

    io.to(user.room).emit("roomData", {
      room: user.room,
      users: getUserInRoom(user.room),
    });
  });

  socket.on("sentMessage", (message, callback) => {
    const filter = new Filter();
    const user = getUser(socket.id);

    if (filter.isProfane(message)) {
      return callback("Profine words are not allowed in this platform");
    }
    io.to(user.room).emit("message", generateMessage(message, user.username));
    callback();
  });
  socket.on("sendLocation", (coords, callback) => {
    const user = getUser(socket.id);

    io.to(user.room).emit(
      "locationMessage",
      generateLocation(
        `https://google.com/maps?q=${coords.latitude},${coords.longitude}`,
        user.username
      )
    );
    callback();
  });

  socket.on("disconnect", () => {
    const user = removeUser(socket.id);

    if (user) {
      io.to(user.room).emit(
        "message",
        generateMessage(`${user.username} has left`)
      );
    }
  });
});

server.listen(port, () => {
  console.log(`Server is up on port: ${port}`);
});
