const router = require("express").Router();
const { getCart, addToCart, updateCartItem, removeFromCart, clearCart } = require("../controllers/cartController");
const auth = require("../middleware/auth");

router.get("/", auth, getCart);
router.post("/", auth, addToCart);
router.put("/", auth, updateCartItem);
router.delete("/clear", auth, clearCart);
router.delete("/:itemId", auth, removeFromCart);

module.exports = router;