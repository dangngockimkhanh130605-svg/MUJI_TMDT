const router = require("express").Router();
const auth = require("../middleware/auth");
const {
  getAllOrders,
  updateOrderStatus,
  createOrder,
  getMyOrders,
  getOrderById
} = require("../controllers/orderController");
const isAdmin = require("../middleware/isAdmin");

router.post("/", auth, createOrder);

// ADMIN ROUTES PHẢI ĐẶT TRƯỚC
router.get("/admin/all", auth, isAdmin, getAllOrders);
router.put("/admin/:id/status", auth, isAdmin, updateOrderStatus);

// USER ROUTES
router.get("/", auth, getMyOrders);
router.get("/:id", auth, getOrderById);

module.exports = router;