const { Router } = require("express");
const router = Router();
const authController = require("../Controllers/AuthController");
const { requireAuth } = require("../Middleware/authMiddleware");

router.post("/signUp", authController.signUp);
router.post("/login", authController.login);
router.get("/logout", requireAuth, authController.logout);
router.get("/isLogged", authController.checkLogIn);
module.exports = router;
