const express = require("express");
const mongoController = require("./user.controller");
const controller = require("./user.controller2");
const auth = require("../auth/auth.service");

const router = express.Router();

// get user
// router.get("/", auth.hasRole("user"), mongoController.show);
router.get("/:id?", auth.hasRole("user"), controller.show);

// @route POST api/users/register
// @desc Register user
// @access Public
// router.post("/register", mongoController.registerUser);
router.post("/register", controller.registerUser);

// @route POST api/users/login
// @desc Login user and return JWT token
// @access Public
// router.post("/login", mongoController.loginUser);
router.post("/login", controller.loginUser);

module.exports = router;
