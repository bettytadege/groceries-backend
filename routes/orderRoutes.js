const express = require("express");

const orderController = require("../controllers/orderController");
const router = express.Router();

router
  .route("/")
  .get(orderController.getAllOrder)
  .post(orderController.createOrder);
router
  .route("/:id")
  .get(orderController.getOrderById)
  .delete(orderController.cancelOrder)
  .put(orderController.UpdateProduct);

module.exports = router;
