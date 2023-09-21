const express = require("express");
const router = express.Router();
const multer = require("multer");
const login = require("../middleware/login");

const ProductController = require("../controllers/products");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./uploads/");
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

router.get("/", ProductController.getProduct);
router.get("/:id_product", ProductController.getProductById);
router.delete("/:id_product", login.mandatory, ProductController.deleteProduct);
router.patch(
  "/:id_product",
  login.mandatory,
  upload.single("image_product"),
  ProductController.patchProduct
);
router.post(
  "/",
  login.mandatory,
  upload.single("image_product"),
  ProductController.postProduct
);

module.exports = router;
