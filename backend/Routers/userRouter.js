const express = require("express");
const userController = require("./../Controllers/userController");
const authController = require("./../Controllers/authController");

const router = express.Router();

//Routes to use requests received from the client side
router.post("/signup", authController.signup);
router.post("/login", authController.login);
router.get("/logout", authController.logout);
router.post("/forgotPassword", authController.forgotPassword);
router.patch("/resetPassword/:token", authController.resetPassword);

router.get("/me", userController.getuserbyId);

router.get("/getAllUsers/:page", authController.protect, authController.restrictTo("admin"), userController.getAllUsers);

module.exports = router;
