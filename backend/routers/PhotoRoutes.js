const express = require("express");
const router = express.Router();

const {
  insertPhoto,
  deletePhoto,
  getAllPhotos,
  getUserPhotos,
  updatePhoto,
  likePhoto,
  commentPhoto,
  searchPhotos,
} = require("../controllers/PhotoController");
const authGuard = require("../middleware/authGuard");
const imageUpload = require("../middleware/imageUpload");
const validate = require("../middleware/handleValidations");
const { photoCreateValidation } = require("../middleware/photoValidation");
router.post(
  "/",
  authGuard,
  imageUpload.single("image"),
  photoCreateValidation(),
  validate,
  insertPhoto,
);

router.delete("/:id", authGuard, deletePhoto);
router.get("/", authGuard, getAllPhotos);
router.get("/user/:id", authGuard, getUserPhotos);
router.put("/:id", authGuard, updatePhoto);
router.put("/like/:id", authGuard, likePhoto);
router.put("/comment/:id", authGuard, commentPhoto);
router.get("/search/", authGuard, searchPhotos);

module.exports = router;
