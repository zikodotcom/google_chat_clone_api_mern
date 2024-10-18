const User = require("../Models/User");

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
