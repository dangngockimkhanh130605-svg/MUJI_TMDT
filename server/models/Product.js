const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: String,
  price: { type: Number, required: true },
  category: { type: String, enum: ["apparel", "household", "food", "furniture"] },
  subCategory: String,
  images: [String],
  stock: { type: Number, default: 0 },
  material: String,
  sizes: [String],
  itemNo: String,
  isBestSeller: { type: Boolean, default: false },
  isNewArrival: { type: Boolean, default: false },
  ratings: { type: Number, default: 0 },
  numReviews: { type: Number, default: 0 },
}, { timestamps: true });

module.exports = mongoose.model("Product", productSchema);