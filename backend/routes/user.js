const express = require("express");
const router = express.Router();

// Initialize controllers
const UserController = require("../app/controllers/user/UserController");

router.post("/edit", UserController.edit);

module.exports = router;
