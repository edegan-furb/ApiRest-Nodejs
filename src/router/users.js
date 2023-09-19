const express = require("express");
const router = express.Router();

const UsersController = require("../controllers/users");

router.post("/sign-in", UsersController.signIn);
router.post("/login", UsersController.login);

module.exports = router;
