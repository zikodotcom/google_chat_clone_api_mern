const mongoose = require("mongoose");
const { isEmail } = require("validator");
const bcrypt = require("bcrypt");

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Name is required"],
  },
  email: {
    type: String,
    required: [true, "Email is required"],
    validate: {
      validator: isEmail,
      message: "Please enter a valid email address",
    },
    unique: true,
    lowercase: true,
  },
  password: {
    type: String,
    required: [true, "Password is required"],
    minlength: [6, "Password must be at least 6 characters long"],
  },
  picture: {
    type: String,
    default:
      "https://images.pexels.com/photos/21567730/pexels-photo-21567730/free-photo-of-farmer-in-straw-hat-on-field.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
  },
  status: {
    type: String,
    default: "distrub",
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

userSchema.pre("save", async function (next) {
  const salt = await bcrypt.genSalt();
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

userSchema.statics.login = async function (email, password) {
  const user = await this.findOne({ email });
  if (user) {
    const pass = await bcrypt.compare(password, user.password);
    if (pass) {
      return user;
    }
    throw Error("Password or email is incorrect");
  }
  throw Error("Password or email is incorrect");
};

const User = mongoose.model("User", userSchema);

module.exports = User;
