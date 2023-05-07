const express = require("express");
const mongoController = require("./order.controller");
const controller = require("./order.controller2");
const auth = require("../auth/auth.service");

const router = express.Router();

// router.get("/", auth.hasRole("user"), mongoController.index);
// router.get("/restaurant", auth.hasRole("manager"), mongoController.restaurant_index);
// router.get("/:id", auth.hasRole("user"), mongoController.show);
// router.post("/", auth.hasRole("user"), mongoController.create);
// router.put("/:id", auth.hasRole("user"), mongoController.update);
// router.patch("/:id", auth.hasRole("user"), mongoController.update);
// router.delete("/:id", auth.hasRole("user"), mongoController.destroy);

router.get("/", auth.hasRole("user"), controller.index);
router.get("/restaurant/:id?", controller.restaurant_index);
router.get("/:id", auth.hasRole("user"), controller.show);
router.post("/", auth.hasRole("user"), controller.create);
router.put("/:id", auth.hasRole("user"), controller.update);
router.patch("/:id", auth.hasRole("user"), controller.update);
router.delete("/:id", auth.hasRole("user"), controller.destroy);

module.exports = router;
