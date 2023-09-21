const express = require("express");
const router = express.Router();
const login = require("../middleware/login");

const CategoriesController = require("../controllers/categories");

router.get("/", CategoriesController.getCategories);
router.post("/", login.mandatory, CategoriesController.postCategory);
router.get("/:id_categories", CategoriesController.getCategoryById);
router.patch(
  "/:id_categories",
  login.mandatory,
  CategoriesController.patchCategory
);
router.delete(
  "/:id_categories",
  login.mandatory,
  CategoriesController.deleteCategory
);

module.exports = router;
