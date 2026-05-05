const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  orderNumber: String,
  items: [{
    product: { type: mongoose.Schema.Types.ObjectId, ref: "Product" },
    name: String,
    image: String,
    price: Number,
    quantity: Number,
    size: String,
    color: String,
  }],
  shippingInfo: {
    firstName: String,
    lastName: String,
    email: String,
    phone: String,
    address: String,
    city: String,
    province: String,
    postalCode: String,
  },
  paymentMethod: { type: String, enum: ["credit_card", "momo", "cod"] },
  subtotal: Number,
  shippingFee: Number,
  vat: Number,
  total: Number,
  status: {
    type: String,
    enum: ["pending", "processing", "in_transit", "delivered", "cancelled"],
    default: "pending"
  },
}, { timestamps: true });

module.exports = mongoose.model("Order", orderSchema);