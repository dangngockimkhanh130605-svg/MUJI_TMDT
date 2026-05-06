const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  items: [{
    product: { type: mongoose.Schema.Types.ObjectId, ref: "Product" },
    name: String,
    image: String,
    price: Number,
    quantity: Number,
    size: String,
  }],
  shippingAddress: {
    fullName: String,
    phone: String,
    address: String,
    city: String,
  },
  paymentMethod: { type: String, default: "cod" },
  subtotal: Number,
  shippingFee: Number,
  vat: Number,
  total: Number,
  status: { type: String, default: "pending", enum: ["pending", "processing", "shipped", "delivered", "cancelled"] },
}, { timestamps: true });

module.exports = mongoose.model("Order", orderSchema);