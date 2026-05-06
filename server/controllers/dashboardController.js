const Order = require("../models/Order");
const Product = require("../models/Product");
const User = require("../models/User");

exports.getDashboardStats = async (req, res) => {
  try {
    // Tổng doanh thu
    const revenueData = await Order.aggregate([
      { $match: { status: { $ne: "cancelled" } } },
      { $group: { _id: null, total: { $sum: "$total" } } }
    ]);
    const totalRevenue = revenueData[0]?.total || 0;

    // Đơn hàng active
    const activeOrders = await Order.countDocuments({
      status: { $in: ["pending", "processing", "in_transit"] }
    });

    // Pending shipment
    const pendingShipment = await Order.countDocuments({ status: "processing" });

    // Tổng khách hàng (store visitors)
    const totalUsers = await User.countDocuments({ role: "user" });

    // Sản phẩm tồn kho thấp
    const lowStock = await Product.find({ stock: { $lt: 20 } })
      .select("name stock")
      .sort({ stock: 1 })
      .limit(5);

    // Giao dịch gần đây
    const recentOrders = await Order.find()
      .populate("user", "name")
      .sort({ createdAt: -1 })
      .limit(10);

    // Revenue 7 ngày gần nhất
    const days = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"];
    const last7Days = await Order.aggregate([
      {
        $match: {
          createdAt: { $gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) },
          status: { $ne: "cancelled" }
        }
      },
      {
        $group: {
          _id: { $dayOfWeek: "$createdAt" },
          revenue: { $sum: "$total" }
        }
      }
    ]);

    const revenueChart = days.map((day, i) => {
      const found = last7Days.find(d => d._id === i + 1);
      return { day, revenue: found?.revenue || 0 };
    });

    res.json({
      totalRevenue,
      activeOrders,
      pendingShipment,
      totalUsers,
      lowStock,
      recentOrders,
      revenueChart,
    });
  } catch (err) {
    res.status(500).json({ msg: "Lỗi server" });
  }
};

exports.getReportStats = async (req, res) => {
  try {
    // Tổng doanh thu theo tháng
    const monthlyRevenue = await Order.aggregate([
      { $match: { status: { $ne: "cancelled" } } },
      {
        $group: {
          _id: { month: { $month: "$createdAt" }, year: { $year: "$createdAt" } },
          revenue: { $sum: "$total" },
          orders: { $sum: 1 }
        }
      },
      { $sort: { "_id.year": 1, "_id.month": 1 } },
      { $limit: 6 }
    ]);

    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const monthlyData = monthlyRevenue.map(m => ({
      month: months[m._id.month - 1],
      revenue: m.revenue,
      orders: m.orders,
    }));

    // Tổng YTD
    const year = new Date().getFullYear();
    const ytdData = await Order.aggregate([
      {
        $match: {
          status: { $ne: "cancelled" },
          createdAt: { $gte: new Date(`${year}-01-01`) }
        }
      },
      {
        $group: {
          _id: null,
          totalRevenue: { $sum: "$total" },
          totalOrders: { $sum: 1 },
          avgOrderValue: { $avg: "$total" }
        }
      }
    ]);

    // Doanh thu theo danh mục
    const categoryRevenue = await Order.aggregate([
      { $match: { status: { $ne: "cancelled" } } },
      { $unwind: "$items" },
      {
        $group: {
          _id: "$items.category",
          revenue: { $sum: { $multiply: ["$items.price", "$items.quantity"] } }
        }
      }
    ]);

    res.json({
      monthlyData,
      ytd: ytdData[0] || { totalRevenue: 0, totalOrders: 0, avgOrderValue: 0 },
      categoryRevenue,
    });
  } catch (err) {
    res.status(500).json({ msg: "Lỗi server" });
  }
};