const Order = require("../models/Order");

exports.createOrder = async (req, res) => {
  const orderNumber = "MUJI-" + Math.floor(Math.random() * 90000 + 10000);
  const order = await Order.create({ ...req.body, user: req.user.id, orderNumber });
  res.json(order);
};

exports.getMyOrders = async (req, res) => {
  const orders = await Order.find({ user: req.user.id }).sort({ createdAt: -1 });
  res.json(orders);
};

// Admin
exports.getAllOrders = async (req, res) => {
  const orders = await Order.find().populate("user", "name email").sort({ createdAt: -1 });
  res.json(orders);
};

exports.updateOrderStatus = async (req, res) => {
  const order = await Order.findByIdAndUpdate(req.params.id, { status: req.body.status }, { new: true });
  res.json(order);
};

exports.getDashboardStats = async (req, res) => {
  const totalRevenue = await Order.aggregate([
    { $match: { status: { $ne: "cancelled" } } },
    { $group: { _id: null, total: { $sum: "$total" } } }
  ]);
  const activeOrders = await Order.countDocuments({ status: { $in: ["pending", "processing", "in_transit"] } });
  const recentOrders = await Order.find().populate("user", "name").sort({ createdAt: -1 }).limit(10);
  
  res.json({ totalRevenue: totalRevenue[0]?.total || 0, activeOrders, recentOrders });
};