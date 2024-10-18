const { Router } = require("express");
const route = Router();
const UserController = require("../Controllers/UserController");

// ? user search
route.get("/user/:search", UserController.searchUser);

module.exports = route;
