const { Router } = require("express");
const router = Router();
const messageController = require("../Controllers/MessageController");
const { requireAuth } = require("../Middleware/authMiddleware");

router.post("/sendMessage", requireAuth, messageController.sendMessage);
router.get("/getMessages/:id", requireAuth, messageController.getMessages);
router.get("/getFriends", requireAuth, messageController.getFriends);

module.exports = router;
