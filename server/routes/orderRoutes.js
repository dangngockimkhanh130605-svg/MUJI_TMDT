const router = require("express").Router();
const { createOrder, getMyOrders, getOrderById } = require("../controllers/orderController");
const auth = require("../middleware/auth");

router.post("/", auth, createOrder);
router.get("/", auth, getMyOrders);
router.get("/:id", auth, getOrderById);

module.exports = router;