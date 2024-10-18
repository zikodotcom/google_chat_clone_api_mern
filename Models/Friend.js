const mongoose = require("mongoose");

const FriendSchema = new mongoose.Schema({
  friendOne: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  friendTwo: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  message: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Message",
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

// ? Static method to get list friends with last message
FriendSchema.statics.getFriendWithLastMessage = async function (currentId) {
  const friendList = await this.find({
    $or: [{ friendOne: currentId }, { friendTwo: currentId }],
  })
    .populate("friendOne")
    .populate("friendTwo")
    .populate({
      path: "message",
    })
    .sort({ updateAt: -1 });
  return friendList;
};
FriendSchema.pre("updateOne", function (next) {
  this.set({ updateAt: Date.now() });
  // console.log("update at = ", this.updateAt);
  next();
});
const Friend = mongoose.model("Friend", FriendSchema);

module.exports = Friend;
