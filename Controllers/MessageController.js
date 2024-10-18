const Message = require("../Models/Message");
const Friend = require("../Models/Friend");
const User = require("../Models/User");
// ? Send message
exports.sendMessage = async (req, res) => {
  try {
    let message = await Message.addAndCheckMessage(req.body, req.user);
    res.status(201).json(message);
  } catch (error) {
    console.log(error);
    res.status(400).json(error);
  }
};

// ? Get messages
exports.getMessages = async (req, res) => {
  try {
    const messages = await Message.find({
      $or: [
        { receiver: req.params.id, sender: req.user },
        { receiver: req.user, sender: req.params.id },
      ],
    })
      .populate({
        path: "sender",
        select: "name email",
      })
      .populate({
        path: "receiver",
        select: "name email",
      });

    const friend = await User.findOne({ _id: req.params.id });
    res.json({
      messages,
      friend,
      user: req.user,
    });
  } catch (error) {
    res.status(400).json(error);
  }
};

// ? Get friend

exports.getFriends = (req, res) => {
  Friend.getFriendWithLastMessage(req.user)
    .then(async (result) => {
      let data = await Promise.all(
        result.map(async (el) => {
          let friend = {};
          if (el.friendOne["_id"] == req.user) {
            friend = el.friendTwo;
          }
          if (el.friendTwo["_id"] == req.user) {
            friend = el.friendOne;
          }
          return {
            friend,
            message: el.message,
          };
        })
      );
      res.status(201).json(data);
    })
    .catch((err) => console.log(err));
};

// ? Get lastMessage
async function getLastMessage(friend) {
  const lastMessage = await Message.findOne({
    $or: [
      { receiver: friend.friendOne, sender: friend.friendTwo },
      { receiver: friend.friendTwo, sender: friend.friendOne },
    ],
  })
    .sort({ createdAt: -1 })
    .limit(1);
  return lastMessage;
}
