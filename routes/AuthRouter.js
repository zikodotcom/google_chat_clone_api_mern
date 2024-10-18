const { Router } = require("express");
const router = Router();
const authController = require("../Controllers/AuthController");
const { requireAuth } = require("../Middleware/authMiddleware");

router.post("/signUp", authController.signUp);
router.post("/login", authController.login);
router.post("/logout", authController.logout);
router.get("/", requireAuth,  (req, res) => {
  res.send("goood");
});

module.exports = router;
