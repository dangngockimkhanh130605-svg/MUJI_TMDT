const router = require("express").Router();
const auth = require("../middleware/auth");
const { getAllOrders, updateOrderStatus, createOrder, getMyOrders, getOrderById } = require("../controllers/orderController");
const isAdmin = require("../middleware/isAdmin");

router.post("/", auth, createOrder);
router.get("/", auth, getMyOrders);
router.get("/:id", auth, getOrderById);
router.get("/admin/all", auth, isAdmin, getAllOrders);
router.put("/admin/:id/status", auth, isAdmin, updateOrderStatus);

module.exports = router;