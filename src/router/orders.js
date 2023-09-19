const express = require("express");
const router = express.Router();

const OrdersController = require("../controllers/orders");

router.get("/", OrdersController.getOrders);
router.post("/", OrdersController.postOrder);
router.get("/:id_order", OrdersController.getOrderById);
router.patch("/", OrdersController.patchOrder);
router.delete("/", OrdersController.deleteOrder);

module.exports = router;
