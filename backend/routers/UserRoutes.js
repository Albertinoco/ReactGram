const express = require("express");
const router = express.Router();

// controllers
const {
  register,
  login,
  getCurrentUser,
  update,
  getUserById,
} = require("../controllers/UserController");
// middlewares
const validate = require("../middleware/handleValidations");
const {
  userCreateValidation,
  loginValidation,
  userUpdateValidation,
} = require("../middleware/userValidation");
const authGuard = require("../middleware/authGuard");
const imageUpload = require("../middleware/imageUpload");
// routes
router.post("/register", userCreateValidation(), validate, register);
router.post("/login", loginValidation(), validate, login);
router.put(
  "/",
  authGuard,
  userUpdateValidation(),
  validate,
  imageUpload.single("profileImage"),
  update,
);
router.get("/profile", authGuard, getCurrentUser);

router.get("/:id", getUserById);

module.exports = router;
