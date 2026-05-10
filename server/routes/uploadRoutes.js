const router = require("express").Router();
const multer = require("multer");
const path = require("path");
const auth = require("../middleware/auth");
const isAdmin = require("../middleware/isAdmin");

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "uploads/"),
  filename: (req, file, cb) => {
    const unique = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, unique + path.extname(file.originalname));
  },
});

const upload = multer({ storage });

router.post("/", auth, isAdmin, upload.single("image"), (req, res) => {
    res.json({
        url: `${process.env.BASE_URL}/uploads/${req.file.filename}`
    });
});

module.exports = router;