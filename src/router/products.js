const express = require("express");
const router = express.Router();
const multer = require("multer");
const login = require("../middleware/login");

const ProductController = require("../controllers/products");

router.get("/", ProductController.getProduct);
router.get("/:id_product", ProductController.getProductById);
router.delete("/:id_product", login.mandatory, ProductController.deleteProduct);
router.patch(
  "/:id_product",
  login.mandatory,
  ProductController.patchProduct
);
router.post(
  "/",
  login.mandatory,
  ProductController.postProduct
);

module.exports = router;
