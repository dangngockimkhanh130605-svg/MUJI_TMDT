const Order = require("../models/Order");
const Cart = require("../models/Cart");

exports.createOrder = async (req, res) => {
  try {
    const cart = await Cart.findOne({ user: req.user.id });
    if (!cart || cart.items.length === 0)
      return res.status(400).json({ msg: "Giỏ hàng trống" });

    const subtotal = cart.items.reduce((sum, i) => sum + i.price * i.quantity, 0);
    const shippingFee = subtotal >= 500000 ? 0 : 30000;
    const vat = Math.round(subtotal * 0.1);
    const total = subtotal + shippingFee + vat;

    const order = await Order.create({
      user: req.user.id,
      orderNumber: "MUJI-" + Date.now(),
      items: cart.items.map(i => ({
        product: i.product,
        name: i.name,
        image: i.image,
        price: i.price,
        quantity: i.quantity,
        size: i.size,
      })),
      shippingAddress: req.body.shippingAddress,
      paymentMethod: req.body.paymentMethod,
      subtotal,
      shippingFee,
      vat,
      total,
      status: "pending",
    });

    // Xóa giỏ hàng sau khi đặt hàng
    await Cart.findOneAndDelete({ user: req.user.id });

    res.json(order);
  } catch (err) {
    console.log(err);
    res.status(500).json({ msg: "Lỗi server" });
  }
};

exports.getMyOrders = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user.id }).sort({ createdAt: -1 });
    res.json(orders);
  } catch (err) {
    res.status(500).json({ msg: "Lỗi server" });
  }
};

exports.getOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ msg: "Không tìm thấy đơn hàng" });
    res.json(order);
  } catch (err) {
    res.status(500).json({ msg: "Lỗi server" });
  }
};