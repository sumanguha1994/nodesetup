const express = require("express");
const router = express.Router();

// initialize middleware
const authorize = require("../app/middleware/authorize");

// initialize controllers
const AdminAuthController = require("../app/controllers/auth/AdminAuthController");
const LoginController = require("../app/controllers/auth/LoginController");

router.post("/admin/login", AdminAuthController.login);
router.post(
  "/admin/getaccount",
  authorize.checkAuth,
  authorize.checkRole(["superadmin"]),
  AdminAuthController.getAccountDetails
);
router.post("/admin/forgot-password", AdminAuthController.forgot_password);
router.post(
  "/admin/forgot-password/:userId/:token",
  AdminAuthController.new_password
);

// members login
router.post("/login/submit", LoginController.submit);

module.exports = router;
