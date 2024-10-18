const mongoose = require("mongoose");
const Friend = require("./Friend");
const socket = require("../Services/Socket");
const messageSchema = new mongoose.Schema({
  text: {
    type: String,
    required: true,
  },
  sender: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  receiver: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  createdAt: {
    type: Date,
    default: () => Date.now(),
    immutable: true,
  },
  updateAt: {
    type: Date,
    default: () => Date.now(),
  },
});
let i = 0;
messageSchema.statics.addAndCheckMessage = async function (body, user) {
  try {
    const message = await this.create({
      text: body.text,
      sender: user,
      receiver: body.receiver,
    });
    // TODO Update friend last message
    Friend.updateOne(
      {
        $or: [
          { friendOne: user, friendTwo: body.receiver },
          { friendOne: body.receiver, friendTwo: user },
        ],
      },
      {
        $set: {
          message: message["_id"],
        },
      }
    )
      .then((res) => {
        console.log(res);
      })
      .catch((err) => console.log(err));
    //TODO Send message via socket io
    const io = socket.getIO();
    Friend.find({
      $or: [
        { friendOne: user, friendTwo: body.receiver },
        { friendOne: body.receiver, friendTwo: user },
      ],
    })
      .countDocuments()
      .then((res) => {
        if (res == 0) {
          Friend.create({
            friendOne: user,
            friendTwo: body.receiver,
            message: message["_id"],
          }).then(async (result) => {
            const newFriend = await Friend.findById(result["_id"])
              .populate("friendOne")
              .populate("friendTwo")
              .populate("message");
            io.in(body.receiver).emit("addNewFriend", newFriend);
            io.in(user).emit("addNewFriend", newFriend);
          });
        } else {
          io.in(body.receiver).emit("SendMessage", message);
        }
      });
    return message;
  } catch (err) {
    throw new Error(err);
  }
};

const Message = mongoose.model("Message", messageSchema);

module.exports = Message;
