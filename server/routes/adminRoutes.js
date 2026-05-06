const router = require("express").Router();
const { getDashboardStats, getReportStats } = require("../controllers/dashboardController");
const auth = require("../middleware/auth");
const isAdmin = require("../middleware/isAdmin");

router.get("/dashboard", auth, isAdmin, getDashboardStats);
router.get("/reports", auth, isAdmin, getReportStats);

module.exports = router;