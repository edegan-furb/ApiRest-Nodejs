const express = require("express");
const router = express.Router();
const login = require("../middleware/login");

const OrdersController = require("../controllers/orders");

router.get("/", OrdersController.getOrders);
router.post("/", login.mandatory, OrdersController.postOrder);
router.get("/:id_order", OrdersController.getOrderById);
router.patch("/", login.mandatory, OrdersController.patchOrder);
router.delete("/:id_order", login.mandatory, OrdersController.deleteOrder);

module.exports = router;
