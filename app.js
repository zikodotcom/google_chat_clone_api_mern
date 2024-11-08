const express = require("express");
const mongoose = require("mongoose");
const cookieParser = require("cookie-parser");
const app = express();
const dotenv = require("dotenv").config();
const cors = require("cors");
const port = 3001;
const AuthRouter = require("./routes/AuthRouter.js");
const MessageRouter = require("./routes/MessageRouter.js");
const UserRouter = require("./routes/UserRouter.js");
// ? Socket io config
const http = require("http");
const server = http.createServer(app);
const socket = require("./Services/Socket.js");
const io = socket.init(server);
const cookie = require("cookie");
const jsonwebtoken = require("jsonwebtoken");
const User = require("./Models/User.js");
// Move CORS middleware before your routes
app.use(
  cors({
    origin: process.env.FRONT_END_URL,
    credentials: true,
  })
);
// TODO Connect to mongodb
mongoose.connect("mongodb://localhost:27017/chatApp");
// ? Middlewares
app.use(cookieParser());
app.use(express.json());
app.use("/api", AuthRouter);
app.use("/api", MessageRouter);
app.use("/api", UserRouter);

// TODO Share io to use it in other file
io.on("connection", (socket) => {
  socket.on("join-room", (id) => {
    // TODO Retrive cookie
    const tokenHeader = socket.handshake.headers.cookie;
    console.log("token - ", tokenHeader);
    if (tokenHeader) {
      const { jwt } = cookie.parse(tokenHeader);
      jsonwebtoken.verify(
        jwt,
        process.env.ACCESS_TOKEN_SECRET,
        (err, decodedToken) => {
          console.log("err - ", err);
          if (!err) {
            socket.room = decodedToken.id;
            socket.join(decodedToken.id);
            console.log("room joined to ", decodedToken.id);
            // TODO Change status if user set status auto
            changeStatus(decodedToken.id, true);
          }
        }
      );
    } else if (id) {
      socket.room = id;
      socket.join(id);
      console.log("room joined to ", id);
      // TODO Change status if user set status auto
      changeStatus(id, true);
    }
  });
  socket.on("disconnect", async () => {
    console.log("Id room in disconnect", socket.room);
    // TODO Change status if user set status auto
    if (socket.room) {
      changeStatus(socket.room, false);
    }
  });
});
// TODO Change status if user set status auto
function changeStatus(id, isConnect) {
  User.findById(id).then((res) => {
    if (isConnect) {
      res.status = "automatic";
      res.save();
      io.emit("changeStatus", { id, status: res.status });
    } else if (!isConnect) {
      res.status = "away";
      res.save();
      io.emit("changeStatus", { id, status: res.status });
    }
  });
}
// TODO LISTEN FUNCTION
server.listen(port, () => {
  console.log(`Listen to port ${port}`);
});
