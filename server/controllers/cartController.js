const Cart = require("../models/Cart");
const Product = require("../models/Product");

// Lấy giỏ hàng
exports.getCart = async (req, res) => {
  try {
    const cart = await Cart.findOne({ user: req.user.id }).populate("items.product");
    res.json(cart || { items: [] });
  } catch (err) {
    res.status(500).json({ msg: "Lỗi server" });
  }
};

// Thêm vào giỏ hàng
exports.addToCart = async (req, res) => {
  try {
    const { productId, quantity, size } = req.body;
    const product = await Product.findById(productId);
    if (!product) return res.status(404).json({ msg: "Sản phẩm không tồn tại" });

    let cart = await Cart.findOne({ user: req.user.id });
    if (!cart) cart = new Cart({ user: req.user.id, items: [] });

    const existing = cart.items.find(
      item => item.product.toString() === productId && item.size === size
    );

    if (existing) {
      existing.quantity += quantity;
    } else {
      cart.items.push({
        product: productId,
        name: product.name,
        image: product.images?.[0] || "",
        price: product.price,
        quantity,
        size,
      });
    }

    await cart.save();
    res.json(cart);
  } catch (err) {
    res.status(500).json({ msg: "Lỗi server" });
  }
};

// Cập nhật số lượng
exports.updateCartItem = async (req, res) => {
  try {
    const { itemId, quantity } = req.body;
    const cart = await Cart.findOne({ user: req.user.id });
    if (!cart) return res.status(404).json({ msg: "Giỏ hàng trống" });

    const item = cart.items.id(itemId);
    if (!item) return res.status(404).json({ msg: "Không tìm thấy sản phẩm" });

    if (quantity <= 0) {
      cart.items.pull(itemId);
    } else {
      item.quantity = quantity;
    }

    await cart.save();
    res.json(cart);
  } catch (err) {
    res.status(500).json({ msg: "Lỗi server" });
  }
};

// Xóa khỏi giỏ hàng
exports.removeFromCart = async (req, res) => {
  try {
    const cart = await Cart.findOne({ user: req.user.id });
    if (!cart) return res.status(404).json({ msg: "Giỏ hàng trống" });

    cart.items.pull(req.params.itemId);
    await cart.save();
    res.json(cart);
  } catch (err) {
    res.status(500).json({ msg: "Lỗi server" });
  }
};

// Xóa toàn bộ giỏ hàng
exports.clearCart = async (req, res) => {
  try {
    await Cart.findOneAndDelete({ user: req.user.id });
    res.json({ msg: "Đã xóa giỏ hàng" });
  } catch (err) {
    res.status(500).json({ msg: "Lỗi server" });
  }
};