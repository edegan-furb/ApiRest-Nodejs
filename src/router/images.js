const express = require("express");
const router = express.Router();
const multer = require("multer");
const login = require("../middleware/login");

const ImageController = require("../controllers/images");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "src/uploads");
  },
  filename: function (req, file, cb) {
    let data = new Date().toISOString().replace(/:/g, "-") + "-";
    cb(null, data + file.originalname);
  },
});

const fileFilter = (req, file, cb) => {
  if (file.mimetype === "image/jpeg" || file.mimetype === "image/png") {
    cb(null, true);
  } else {
    cb(null, false);
  }
};

const upload = multer({
  storage: storage,
  limits: {
    fieldSize: 1024 * 1024 * 5,
  },
  fileFilter: fileFilter,
});

router.post(
  "/:id_product",
  login.mandatory,
  upload.single("image_product"),
  ImageController.postImage
);
router.get("/:id_product", ImageController.getImage)
router.delete("/:id_image", login.mandatory, ImageController.deleteImage)

module.exports = router;
