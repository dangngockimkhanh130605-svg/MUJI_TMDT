const Product = require("../models/Product");

// Lấy tất cả sản phẩm (có filter & search)
exports.getProducts = async (req, res) => {
  const { category, material, minPrice, maxPrice, search, sort } = req.query;
  let filter = {};

  if (category) filter.category = category;
  if (material) filter.material = { $regex: material, $options: "i" };
  if (minPrice || maxPrice) filter.price = { $gte: minPrice || 0, $lte: maxPrice || 999999999 };
  if (search) filter.name = { $regex: search, $options: "i" };

  let sortOption = {};
  if (sort === "price_asc") sortOption.price = 1;
  else if (sort === "price_desc") sortOption.price = -1;
  else sortOption.createdAt = -1; // New arrivals default

  const products = await Product.find(filter).sort(sortOption);
  res.json(products);
};

exports.getProductById = async (req, res) => {
  const product = await Product.findById(req.params.id);
  if (!product) return res.status(404).json("Product not found");
  res.json(product);
};

// Admin CRUD
exports.createProduct = async (req, res) => {
  const product = await Product.create(req.body);
  res.json(product);
};

exports.updateProduct = async (req, res) => {
  const product = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true });
  res.json(product);
};

exports.deleteProduct = async (req, res) => {
  await Product.findByIdAndDelete(req.params.id);
  res.json({ msg: "Deleted" });
};