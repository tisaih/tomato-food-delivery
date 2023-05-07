const express = require("express");
const mongoController = require("./meal.controller");
const controller = require("./meal.controller2");
const auth = require("../auth/auth.service");

const router = express.Router();

// router.get("/", auth.hasRole("user"), mongoController.index);
// router.get("/:id", auth.hasRole("user"), mongoController.show);
// router.post("/", auth.hasRole("manager"), mongoController.create);
// router.put("/:id", auth.hasRole("manager"), mongoController.update);
// router.patch("/:id", auth.hasRole("manager"), mongoController.update);
// router.delete("/:id", auth.hasRole("manager"), mongoController.destroy);

router.get("/", auth.hasRole("user"), controller.index);
router.get("/:id", auth.hasRole("user"), controller.show);
router.post("/", auth.hasRole("manager"), controller.create);
router.put("/:id", auth.hasRole("manager"), controller.update);
router.patch("/:id", auth.hasRole("manager"), controller.update);
router.delete("/:id", auth.hasRole("manager"), controller.destroy);

module.exports = router;
