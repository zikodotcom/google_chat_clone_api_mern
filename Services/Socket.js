// socket.js
const { Server } = require("socket.io");
let io;

module.exports = {
  init: (server) => {
    io = new Server(server, {
      cors: {
        origin: process.env.FRONT_END_URL,
        methods: ["GET", "POST"],
        allowedHeaders: ["Content-Type"],
        credentials: true,
      },
    });
    return io;
  },
  getIO: () => {
    if (!io) {
      throw new Error("Socket.io not initialized!");
    }
    return io;
  },
};
