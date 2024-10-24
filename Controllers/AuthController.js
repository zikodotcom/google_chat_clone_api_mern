const User = require("../Models/User");
const ValidationError = require("../Services/ValidationErrors");
const jwt = require("jsonwebtoken");
const maxAge = 1 * 60 * 60 * 24;
// ? Create cookie
function createCookie(id) {
  return jwt.sign({ id }, process.env.ACCESS_TOKEN_SECRET, {
    expiresIn: maxAge,
  });
}
// ? Regiter function
exports.signUp = (req, res) => {
  User.create(req.body)
    .then((result) => {
      res.json(result);
    })
    .catch((err) => {
      console.log(ValidationError.handleError(err));
      res.status(400).json({ message: err.message });
    });
};

// ? Login function

exports.login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.login(email, password);
    const cookie = createCookie(user._id);
    res.cookie("jwt", cookie, {
      httpOnly: true,
      maxAge,
    });
    res.status(201).json(user);
  } catch (error) {
    console.log(error);
    res.status(400).json({ message: error.message });
  }
};

// ? logout function

exports.logout = (req, res) => {
  res.cookie("jwt", "", {
    maxAge: 1,
  });
  res.status(200).json("Logout");
};

// ? Check if use logged it

exports.checkLogIn = (req, res) => {
  const token = req.cookies?.jwt;

  // ? Check if token exists and verified
  if (token) {
    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, decodedToken) => {
      if (!err) {
        res.status(200).json({ message: "User logged it" });
      }
    });
  }
};
