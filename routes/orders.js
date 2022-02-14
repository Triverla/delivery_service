const express = require("express");
const router = express.Router();
const OrderController = require("../api/Controllers/OrderController");
const {
  createOrderSchema,
  updateOrderSchema,
} = require("../api/Requests/NewOrderRequest");

router.post("/orders", createOrderSchema, function (req, res) {
  OrderController.placeOrder(req, res);
});
router.patch("/orders/:id", function (req, res) {
  OrderController.takeOrder(req, res);
});

router.get("/orders", function (req, res) {
    OrderController.getAllOrders(req, res);
  });

module.exports = router;
