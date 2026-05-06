# 🛍️ MUJI TMDT — Website Thương Mại Điện Tử

Dự án website thương mại điện tử lấy cảm hứng từ MUJI, xây dựng với stack **React + Node.js + MongoDB**, hỗ trợ triển khai bằng Docker.

---

## 📋 Mục lục

- [Tổng quan](#tổng-quan)
- [Công nghệ sử dụng](#công-nghệ-sử-dụng)
- [Cấu trúc dự án](#cấu-trúc-dự-án)
- [Tính năng](#tính-năng)
- [Cài đặt & Chạy dự án](#cài-đặt--chạy-dự-án)
  - [Chạy bằng Docker (khuyến nghị)](#chạy-bằng-docker-khuyến-nghị)
  - [Chạy thủ công](#chạy-thủ-công)
- [Biến môi trường](#biến-môi-trường)
- [API Endpoints](#api-endpoints)
- [Dữ liệu mẫu (Seed)](#dữ-liệu-mẫu-seed)

---

## Tổng quan

MUJI TMDT là một ứng dụng web bán hàng trực tuyến với giao diện tối giản, cho phép người dùng duyệt sản phẩm, quản lý giỏ hàng, đặt hàng và nhận email xác nhận. Hệ thống có phân quyền người dùng và trang quản trị dành cho admin.

---

## Công nghệ sử dụng

### Frontend (`/client`)
| Công nghệ | Vai trò |
|---|---|
| React 19 | UI Framework |
| Vite 8 | Build tool & Dev server |
| React Router DOM 7 | Điều hướng |
| Tailwind CSS 3 | Styling |
| Axios | Gọi API |
| Recharts | Biểu đồ thống kê (Admin) |
| Lucide React / React Icons | Icons |

### Backend (`/server`)
| Công nghệ | Vai trò |
|---|---|
| Node.js + Express 5 | REST API Server |
| MongoDB + Mongoose 9 | Cơ sở dữ liệu |
| JWT + bcryptjs | Xác thực & Bảo mật |
| Multer | Upload ảnh sản phẩm |
| Cloudinary | Lưu trữ ảnh trên cloud |
| Nodemailer | Gửi email xác thực |
| Passport + Google OAuth2 | Đăng nhập Google |

### Hạ tầng
| Công nghệ | Vai trò |
|---|---|
| Docker + Docker Compose | Containerization |
| MongoDB 6 | Database container |

---

## Cấu trúc dự án

```
MUJI_TMDT/
├── docker-compose.yml          # Cấu hình Docker cho toàn bộ hệ thống
├── package.json                # Root dependencies (axios)
│
├── client/                     # Frontend React
│   ├── Dockerfile
│   ├── index.html
│   ├── vite.config.js
│   ├── tailwind.config.js
│   └── src/
│       ├── App.jsx
│       ├── main.jsx
│       └── context/            # React Context (state management)
│
└── server/                     # Backend Node.js
    ├── Dockerfile
    ├── server.js               # Entry point
    ├── seed.js                 # Script tạo dữ liệu mẫu
    ├── .env                    # Biến môi trường
    ├── models/
    │   ├── User.js             # Schema người dùng
    │   ├── Product.js          # Schema sản phẩm
    │   ├── Cart.js             # Schema giỏ hàng
    │   ├── Order.js            # Schema đơn hàng
    │   └── Review.js           # Schema đánh giá
    ├── controllers/
    │   ├── authController.js   # Xử lý đăng ký, đăng nhập, xác thực email
    │   ├── productController.js
    │   ├── cartController.js
    │   ├── orderController.js
    │   └── dashboardController.js  # Thống kê Admin
    ├── routes/
    │   ├── authRoutes.js
    │   ├── productRoutes.js
    │   ├── cartRoutes.js
    │   ├── orderRoutes.js
    │   ├── uploadRoutes.js
    │   └── adminRoutes.js
    ├── middleware/
    │   ├── auth.js             # Xác thực JWT
    │   └── isAdmin.js          # Kiểm tra quyền Admin
    └── utils/
        └── sendEmail.js        # Gửi email qua Nodemailer
```

---

## Tính năng

### Người dùng
- Đăng ký tài khoản với xác thực qua email
- Đăng nhập bằng email/password hoặc Google OAuth
- Duyệt sản phẩm theo danh mục: `apparel`, `household`, `food`, `furniture`
- Lọc sản phẩm Best Seller, New Arrival
- Thêm/cập nhật/xóa sản phẩm trong giỏ hàng
- Đặt hàng với thông tin giao hàng và thanh toán COD
- Xem lịch sử đơn hàng và trạng thái

### Admin
- Quản lý sản phẩm (CRUD)
- Upload ảnh sản phẩm (local hoặc Cloudinary)
- Xem thống kê dashboard: doanh thu, đơn hàng, người dùng
- Xem báo cáo chi tiết

---

## Cài đặt & Chạy dự án

### Yêu cầu hệ thống
- Node.js >= 20
- MongoDB (hoặc Docker)
- Docker & Docker Compose (nếu dùng Docker)

---

### Chạy bằng Docker (khuyến nghị)

```bash
# Clone dự án
git clone <repository-url>
cd MUJI_TMDT

# Khởi động toàn bộ hệ thống (MongoDB + Server + Client)
docker compose up --build
```

Sau khi khởi động:
- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:5001
- **MongoDB**: localhost:27017

---

### Chạy thủ công

#### 1. Khởi động Backend

```bash
cd server

# Tạo file .env (xem mục Biến môi trường bên dưới)
cp .env.example .env

# Cài đặt dependencies
npm install

# Chạy development
npx nodemon server.js

# Hoặc chạy production
node server.js
```

#### 2. Khởi động Frontend

```bash
cd client

# Cài đặt dependencies
npm install

# Chạy development
npm run dev

# Build production
npm run build
```

---

## Biến môi trường

Tạo file `server/.env` với nội dung sau:

```env
# Database
MONGO_URI=mongodb://localhost:27017/muji_shop

# Authentication
JWT_SECRET=your_jwt_secret_key

# Server
PORT=5001
CLIENT_URL=http://localhost:5173

# Email (Nodemailer)
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_app_password

# Cloudinary (tuỳ chọn — nếu dùng lưu ảnh trên cloud)
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# Google OAuth (tuỳ chọn)
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
```

> ⚠️ **Lưu ý bảo mật**: Không commit file `.env` lên Git. File này đã được thêm vào `.gitignore`.

---

## API Endpoints

### Auth — `/api/auth`
| Method | Endpoint | Mô tả | Auth |
|---|---|---|---|
| POST | `/register` | Đăng ký tài khoản | ❌ |
| POST | `/login` | Đăng nhập | ❌ |
| GET | `/verify-email` | Xác thực email | ❌ |

### Products — `/api/products`
| Method | Endpoint | Mô tả | Auth |
|---|---|---|---|
| GET | `/` | Lấy danh sách sản phẩm | ❌ |
| GET | `/:id` | Lấy chi tiết sản phẩm | ❌ |
| POST | `/` | Tạo sản phẩm mới | Admin |
| PUT | `/:id` | Cập nhật sản phẩm | Admin |
| DELETE | `/:id` | Xóa sản phẩm | Admin |

### Cart — `/api/cart`
| Method | Endpoint | Mô tả | Auth |
|---|---|---|---|
| GET | `/` | Xem giỏ hàng | ✅ |
| POST | `/` | Thêm vào giỏ hàng | ✅ |
| PUT | `/` | Cập nhật số lượng | ✅ |
| DELETE | `/clear` | Xóa toàn bộ giỏ | ✅ |
| DELETE | `/:itemId` | Xóa một sản phẩm | ✅ |

### Orders — `/api/orders`
| Method | Endpoint | Mô tả | Auth |
|---|---|---|---|
| POST | `/` | Đặt hàng | ✅ |
| GET | `/` | Lấy đơn hàng của tôi | ✅ |
| GET | `/:id` | Chi tiết đơn hàng | ✅ |

### Upload — `/api/upload`
| Method | Endpoint | Mô tả | Auth |
|---|---|---|---|
| POST | `/` | Upload ảnh sản phẩm | Admin |

### Admin — `/api/admin`
| Method | Endpoint | Mô tả | Auth |
|---|---|---|---|
| GET | `/dashboard` | Thống kê tổng quan | Admin |
| GET | `/reports` | Báo cáo chi tiết | Admin |

---

## Dữ liệu mẫu (Seed)

Để tạo dữ liệu mẫu cho database, chạy lệnh sau sau khi server đã kết nối MongoDB:

```bash
cd server
node seed.js
```

Script này sẽ tạo các sản phẩm mẫu thuộc các danh mục: `apparel`, `household`, `food`, `furniture`.

---

## Trạng thái đơn hàng

```
pending → processing → shipped → delivered
                              ↘ cancelled
```

---

## Đóng góp

1. Fork dự án
2. Tạo branch mới: `git checkout -b feature/ten-tinh-nang`
3. Commit thay đổi: `git commit -m 'feat: thêm tính năng X'`
4. Push lên branch: `git push origin feature/ten-tinh-nang`
5. Tạo Pull Request

---

## Giấy phép

ISC License
