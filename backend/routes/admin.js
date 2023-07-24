const express = require("express");
const router = express.Router();
const { body } = require("express-validator");

// Initialize controllers
const AdminController = require("../app/controllers/admin/AdminController");
const MembersController = require("../app/controllers/admin/MembersController");
const User = require("../app/models/User");

router.post("/profile/update", AdminController.updateProfile);

router.post("/members/add", MembersController.add);
router.post("/members/view", MembersController.view);
router.post("/members/edit", MembersController.edit);
router.post("/members/change-status", MembersController.changeStatus);

module.exports = router;
