const User = require("../Models/User");
const socket = require("../Services/Socket");

// ? User search

exports.searchUser = async (req, res) => {
  const { search } = req.params;
  try {
    const data = await User.find({
      $or: [
        {
          name: {
            $regex: search,
            $options: "i",
          },
        },
        {
          email: {
            $regex: search,
            $options: "i",
          },
        },
      ],
    });
    res.json(data);
  } catch (error) {
    console.log(error);
    res.status(400).json(error);
  }
};

// ? change user status
exports.changeUserStatus = (req, res) => {
  const { id, status } = req.params;
  const io = socket.getIO();
  User.updateOne({ _id: id }, { status: status })
    .then((result) => {
      io.emit("changeStatus", { id, status });
      res.status(200);
    })
    .catch((err) => {
      console.log(err);
      res.status(400);
    });
};
