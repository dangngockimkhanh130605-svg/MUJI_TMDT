const router = require("express").Router();
const { getProducts, getProductById, createProduct, updateProduct, deleteProduct } = require("../controllers/productController");
const auth = require("../middleware/auth");
const isAdmin = require("../middleware/isAdmin");

router.get("/", getProducts);
router.get("/:id", getProductById);
router.post("/", auth, isAdmin, createProduct);
router.put("/:id", auth, isAdmin, updateProduct);
router.delete("/:id", auth, isAdmin, deleteProduct);

module.exports = router;