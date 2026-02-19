const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors");

const app = express();
app.use(cors({
  origin:
"https://kalakshepa-2.onrender.com",
  methods: ["GET", "POST"],
  credentials:true
}));

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "https://kalakshepa-2.onrender.com",
    methods: ["GET", "POST"],
  }
});

io.on("connection", (socket) => {
  console.log("User Connected:", socket.id);

  // 👇 JOIN ROOM
  socket.on("join_room", (room) => {
    socket.join(room);
    console.log("User joined room:", room);
  });

  // 👇 SEND MESSAGE
  socket.on("send_message", (data) => {
    socket.to(data.room).emit("receive_message", data);
  });

  socket.on("disconnect", () => {
    console.log("user disconnected:", socket.id);
  });
  });

  app.get("/", (req, res) => {
    res.send("kalakshepa backend is running");
  });

 const PORT = process.env.PORT || 5000;

server.listen(PORT, "0.0.0.0", () => {
  console.log("Server running on port " + PORT);
});

