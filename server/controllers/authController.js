const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const validator = require("validator");
const sendEmail = require("../utils/sendEmail");

// ĐĂNG KÝ
exports.register = async (req, res) => {
  try {
    const { name, email, password, phone, dob, gender, newsletter } = req.body;

    // Validate bắt buộc
    if (!name || !email || !password || !phone || !dob) {
      return res.status(400).json({ msg: "Vui lòng điền đủ các trường bắt buộc" });
    }

    // Validate email
    if (!validator.isEmail(email)) {
      return res.status(400).json({ msg: "Email không hợp lệ" });
    }

    // Validate password
    if (password.length < 8) {
      return res.status(400).json({ msg: "Mật khẩu phải có ít nhất 8 ký tự" });
    }
    if (!/[A-Z]/.test(password)) {
      return res.status(400).json({ msg: "Mật khẩu phải có ít nhất 1 chữ hoa" });
    }
    if (!/[0-9]/.test(password)) {
      return res.status(400).json({ msg: "Mật khẩu phải có ít nhất 1 chữ số" });
    }

    // Validate phone
    if (!/^[0-9]{10,11}$/.test(phone)) {
      return res.status(400).json({ msg: "Số điện thoại không hợp lệ (10-11 số)" });
    }

    // Kiểm tra email đã tồn tại
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ msg: "Email đã được sử dụng" });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Tạo verify token
    const verifyToken = crypto.randomBytes(32).toString("hex");
    const verifyTokenExpire = Date.now() + 24 * 60 * 60 * 1000; // 24 giờ

    // Tạo user (chưa verified)
    const user = await User.create({
        name, email,
        password: hashedPassword,
        phone, dob, gender,
        newsletter: newsletter || false,
        isVerified: true,
        verifyToken: undefined,
        verifyTokenExpire: undefined,
    });

    // Gửi email xác nhận
    // const verifyUrl = `${process.env.CLIENT_URL}/verify-email?token=${verifyToken}`;
    // await sendEmail({
    //   to: email,
    //   subject: "Xác nhận tài khoản MUJI Online Store",
    //   html: `
    //     <div style="font-family: Helvetica, Arial, sans-serif; max-width: 500px; margin: auto; padding: 40px;">
    //       <h2 style="color: #80001C; letter-spacing: 2px;">MUJI</h2>
    //       <h3>Xác nhận tài khoản của bạn</h3>
    //       <p>Chào <strong>${name}</strong>,</p>
    //       <p>Cảm ơn bạn đã đăng ký tài khoản MUJI Online Store. Vui lòng bấm nút bên dưới để xác nhận email.</p>
    //       <a href="${verifyUrl}"
    //         style="display: inline-block; margin: 20px 0; padding: 12px 32px;
    //           background-color: #80001C; color: white; text-decoration: none;
    //           font-weight: bold; letter-spacing: 1px;">
    //         XÁC NHẬN TÀI KHOẢN
    //       </a>
    //       <p style="color: #999; font-size: 12px;">Link có hiệu lực trong 24 giờ. Nếu bạn không đăng ký, hãy bỏ qua email này.</p>
    //       <hr style="border: none; border-top: 1px solid #eee; margin: 30px 0;" />
    //       <p style="color: #999; font-size: 11px;">© RYOHIN KEIKAKU CO., LTD.</p>
    //     </div>
    //   `,
    // });

    res.json({ msg: "Đăng ký thành công! Bạn có thể đăng nhập ngay." });

  } catch (err) {
    console.log(err);
    res.status(500).json({ 
        msg: err.message,
        error: err
    });
}
};

// XÁC NHẬN EMAIL
exports.verifyEmail = async (req, res) => {
  try {
    const { token } = req.query;

    const user = await User.findOne({
      verifyToken: token,
      verifyTokenExpire: { $gt: Date.now() },
    });

    if (!user) {
      return res.status(400).json({ msg: "Link xác nhận không hợp lệ hoặc đã hết hạn" });
    }

    user.isVerified = true;
    user.verifyToken = undefined;
    user.verifyTokenExpire = undefined;
    await user.save();

    // Trả về JSON thay vì redirect
    res.json({ msg: "Xác nhận email thành công" });

  } catch (err) {
    res.status(500).json({ msg: "Lỗi server" });
  }
};

// ĐĂNG NHẬP
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ msg: "Email không tồn tại" });

    // Kiểm tra đã xác nhận email chưa
    if (!user.isVerified) {
      return res.status(400).json({ msg: "Vui lòng xác nhận email trước khi đăng nhập" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ msg: "Sai mật khẩu" });

    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.json({ token, user: { id: user._id, name: user.name, email: user.email, role: user.role } });

  } catch (err) {
    res.status(500).json({ msg: "Lỗi server" });
  }
};