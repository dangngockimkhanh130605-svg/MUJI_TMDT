const router = require("express").Router();
const { createOrder, getMyOrders, getAllOrders, updateOrderStatus, getDashboardStats } = require("../controllers/orderController");
const auth = require("../middleware/auth");
const isAdmin = require("../middleware/isAdmin");

router.post("/", auth, createOrder);
router.get("/my-orders", auth, getMyOrders);
router.get("/admin/all", auth, isAdmin, getAllOrders);
router.put("/admin/:id/status", auth, isAdmin, updateOrderStatus);
router.get("/admin/dashboard", auth, isAdmin, getDashboardStats);

module.exports = router;