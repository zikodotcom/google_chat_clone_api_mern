const { Router } = require("express");
const route = Router();
const UserController = require("../Controllers/UserController");
const { requireAuth } = require("../Middleware/authMiddleware");

// ? user search
route.get("/user/:search", requireAuth, UserController.searchUser);
route.get(
  "/changeUserStatus/:id/:status",
  requireAuth,
  UserController.changeUserStatus
);

module.exports = route;
