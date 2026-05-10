const User = require("./models/User"); 
const bcrypt = require("bcryptjs");
const mongoose = require("mongoose");
const Product = require("./models/Product");
require("dotenv").config();

const products = [
    // ===== APPAREL (10) =====
    { name: "Organic Cotton Crew Neck T-Shirt", description: "Áo thun cổ tròn cotton hữu cơ, thoáng mát và thân thiện môi trường.", price: 299000, category: "apparel", subCategory: "Tops", material: "Cotton", stock: 100, itemNo: "4550182240001", isBestSeller: true, isNewArrival: false, images: ["https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=500"] },
    { name: "French Linen Washed Shirt", description: "Áo sơ mi linen wash nhẹ nhàng, phong cách tự nhiên.", price: 590000, category: "apparel", subCategory: "Shirts", material: "Linen", stock: 60, itemNo: "4550182240002", isBestSeller: false, isNewArrival: true, images: ["https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?w=500"] },
    { name: "Stretch Denim Slim Fit Pants", description: "Quần denim co giãn ôm dáng, thoải mái khi vận động.", price: 790000, category: "apparel", subCategory: "Bottoms", material: "Denim", stock: 45, itemNo: "4550182240003", isBestSeller: false, isNewArrival: true, images: ["https://images.unsplash.com/photo-1542272604-787c3835535d?w=500"] },
    { name: "Terry Hooded Zip-up Parka", description: "Áo hoodie zip chất liệu terry ấm áp.", price: 890000, category: "apparel", subCategory: "Outerwear", material: "Cotton Terry", stock: 30, itemNo: "4550182240004", isBestSeller: false, isNewArrival: false, images: ["https://images.unsplash.com/photo-1614495980486-4c7de6b43bbe?w=500"] },
    { name: "Yak Wool Mix V-Neck Sweater", description: "Áo len cổ V pha sợi len yak mềm mịn và ấm áp.", price: 1290000, category: "apparel", subCategory: "Knitwear", material: "Wool", stock: 25, itemNo: "4550182240005", isBestSeller: true, isNewArrival: false, images: ["https://images.unsplash.com/photo-1434389677669-e08b4cac3105?w=500"] },
    { name: "Water Repellent Sneakers", description: "Giày sneaker chống nước, đế êm và bền bỉ.", price: 1490000, category: "apparel", subCategory: "Footwear", material: "Synthetic", stock: 40, itemNo: "4550182240006", isBestSeller: false, isNewArrival: true, images: ["https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=500"] },
    { name: "Cotton Wide Leg Trousers", description: "Quần ống rộng cotton thoải mái, phù hợp mọi dáng người.", price: 690000, category: "apparel", subCategory: "Bottoms", material: "Cotton", stock: 55, itemNo: "4550182240007", isBestSeller: false, isNewArrival: true, images: ["https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=500"] },
    { name: "Merino Wool Turtleneck", description: "Áo len cổ lọ merino wool cao cấp, giữ ấm tốt.", price: 1590000, category: "apparel", subCategory: "Knitwear", material: "Merino Wool", stock: 20, itemNo: "4550182240008", isBestSeller: true, isNewArrival: false, images: ["https://images.unsplash.com/photo-1576566588028-4147f3842f27?w=500"] },
    { name: "Ribbed Tank Top", description: "Áo ba lỗ ribbed cotton mềm mại, cơ bản và dễ phối đồ.", price: 199000, category: "apparel", subCategory: "Tops", material: "Cotton", stock: 150, itemNo: "4550182240009", isBestSeller: false, isNewArrival: false, images: ["https://images.unsplash.com/photo-1503341504253-dff4815485f1?w=500"] },
    { name: "Linen Casual Jacket", description: "Áo khoác linen nhẹ, thanh lịch và thoáng khí.", price: 1190000, category: "apparel", subCategory: "Outerwear", material: "Linen", stock: 35, itemNo: "4550182240010", isBestSeller: false, isNewArrival: true, images: ["https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=500"] },

    // ===== HOUSEHOLD (10) =====
    { name: "Ultrasonic Aroma Diffuser", description: "Máy khuếch tán tinh dầu siêu âm, 2 mức đèn LED.", price: 1250000, category: "household", subCategory: "Aroma", material: "PP Plastic", stock: 50, itemNo: "4550182240011", isBestSeller: true, isNewArrival: false, images: ["https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?w=500"] },
    { name: "Standard Kitchenware Set", description: "Bộ dụng cụ nhà bếp tiêu chuẩn gồm nồi, chảo và phụ kiện.", price: 2500000, category: "household", subCategory: "Kitchen", material: "Stainless Steel", stock: 20, itemNo: "4550182240012", isBestSeller: false, isNewArrival: true, images: ["https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=500"] },
    { name: "Beige Porcelain Mug", description: "Cốc sứ màu be tự nhiên, dung tích 350ml.", price: 120000, category: "household", subCategory: "Kitchen", material: "Porcelain", stock: 200, itemNo: "4550182240013", isBestSeller: false, isNewArrival: false, images: ["https://images.unsplash.com/photo-1514228742587-6b1558fcca3d?w=500"] },
    { name: "PP Stackable Storage Box (L)", description: "Hộp lưu trữ PP xếp chồng size L, trong suốt và chắc chắn.", price: 189000, category: "household", subCategory: "Storage", material: "Polypropylene", stock: 150, itemNo: "4550182240014", isBestSeller: false, isNewArrival: false, images: ["https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=500"] },
    { name: "Organic Cotton Face Towel", description: "Khăn mặt cotton hữu cơ mềm mại, thấm hút tốt.", price: 95000, category: "household", subCategory: "Bathroom", material: "Cotton", stock: 300, itemNo: "4550182240015", isBestSeller: false, isNewArrival: false, images: ["https://images.unsplash.com/photo-1563453392212-326f5e854473?w=500"] },
    { name: "Aluminum Hanger Set (5pcs)", description: "Bộ 5 móc treo quần áo bằng nhôm nhẹ và bền.", price: 150000, category: "household", subCategory: "Storage", material: "Aluminum", stock: 100, itemNo: "4550182240016", isBestSeller: false, isNewArrival: false, images: ["https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?w=500"] },
    { name: "Ceramic Dinner Plate Set", description: "Bộ đĩa sứ tối giản, phù hợp cho bàn ăn hiện đại.", price: 350000, category: "household", subCategory: "Kitchen", material: "Ceramic", stock: 80, itemNo: "4550182240017", isBestSeller: false, isNewArrival: true, images: ["https://images.unsplash.com/photo-1603199506016-5a4a6fe99022?w=500"] },
    { name: "Bamboo Cutting Board", description: "Thớt tre tự nhiên kháng khuẩn, bền đẹp.", price: 220000, category: "household", subCategory: "Kitchen", material: "Bamboo", stock: 120, itemNo: "4550182240018", isBestSeller: false, isNewArrival: false, images: ["https://images.unsplash.com/photo-1585771724684-38269d6639fd?w=500"] },
    { name: "Glass Storage Jar Set", description: "Bộ hũ thủy tinh đựng thực phẩm, nắp inox chắc chắn.", price: 280000, category: "household", subCategory: "Storage", material: "Glass", stock: 90, itemNo: "4550182240019", isBestSeller: true, isNewArrival: false, images: ["https://images.unsplash.com/photo-1574943320219-553eb213f72d?w=500"] },
    { name: "Cotton Bath Towel", description: "Khăn tắm cotton dày dặn, thấm hút nhanh.", price: 180000, category: "household", subCategory: "Bathroom", material: "Cotton", stock: 200, itemNo: "4550182240020", isBestSeller: false, isNewArrival: true, images: ["https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=500"] },

    // ===== FOOD (10) =====
    { name: "Assorted Baumkuchen Cake", description: "Bánh Baumkuchen truyền thống Nhật Bản, vị matcha và vị nguyên bản.", price: 65000, category: "food", subCategory: "Bakery", stock: 500, itemNo: "4550182240021", isBestSeller: true, isNewArrival: false, images: ["https://images.unsplash.com/photo-1558961363-fa8fdf82db35?w=500"] },
    { name: "Lavender Essential Oil", description: "Tinh dầu oải hương thiên nhiên 100%.", price: 390000, category: "food", subCategory: "Aroma", stock: 80, itemNo: "4550182240022", isBestSeller: false, isNewArrival: true, images: ["https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?w=500"] },
    { name: "Matcha Green Tea Powder", description: "Bột matcha Nhật Bản nguyên chất, thích hợp pha trà và làm bánh.", price: 180000, category: "food", subCategory: "Beverages", stock: 200, itemNo: "4550182240023", isBestSeller: false, isNewArrival: false, images: ["https://images.unsplash.com/photo-1536935338788-846bb9981813?w=500"] },
    { name: "Mixed Nuts & Dried Fruits", description: "Hỗn hợp hạt và trái cây sấy khô, giàu dinh dưỡng.", price: 120000, category: "food", subCategory: "Snacks", stock: 300, itemNo: "4550182240024", isBestSeller: false, isNewArrival: false, images: ["https://images.unsplash.com/photo-1599599810769-bcde5a160d32?w=500"] },
    { name: "Japanese Rice Crackers", description: "Bánh gạo Nhật Bản giòn tan, vị truyền thống.", price: 55000, category: "food", subCategory: "Snacks", stock: 400, itemNo: "4550182240025", isBestSeller: true, isNewArrival: false, images: ["https://images.unsplash.com/photo-1558961363-fa8fdf82db35?w=500"] },
    { name: "Hojicha Roasted Tea", description: "Trà hojicha rang thơm, vị đậm đà và ít caffeine.", price: 150000, category: "food", subCategory: "Beverages", stock: 150, itemNo: "4550182240026", isBestSeller: false, isNewArrival: true, images: ["https://images.unsplash.com/photo-1556679343-c7306c1976bc?w=500"] },
    { name: "Sesame Dressing", description: "Sốt mè rang thơm ngon, phù hợp với salad và mì.", price: 85000, category: "food", subCategory: "Condiments", stock: 250, itemNo: "4550182240027", isBestSeller: false, isNewArrival: false, images: ["https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?w=500"] },
    { name: "Chocolate Wafer Sticks", description: "Bánh que socola giòn, vị ngọt nhẹ kiểu Nhật.", price: 45000, category: "food", subCategory: "Bakery", stock: 500, itemNo: "4550182240028", isBestSeller: false, isNewArrival: false, images: ["https://images.unsplash.com/photo-1481391243133-f96216dcb5d2?w=500"] },
    { name: "Miso Soup Pack (10pcs)", description: "Túi súp miso instant tiện lợi, hương vị truyền thống.", price: 95000, category: "food", subCategory: "Instant Food", stock: 300, itemNo: "4550182240029", isBestSeller: false, isNewArrival: true, images: ["https://images.unsplash.com/photo-1547592166-23ac45744acd?w=500"] },
    { name: "Yuzu Honey Drink", description: "Nước uống mật ong yuzu, thanh mát và tốt cho sức khoẻ.", price: 110000, category: "food", subCategory: "Beverages", stock: 180, itemNo: "4550182240030", isBestSeller: true, isNewArrival: false, images: ["https://images.unsplash.com/photo-1556679343-c7306c1976bc?w=500"] },

    // ===== FURNITURE (10) =====
    { name: "Oak Stackable Shelf Unit", description: "Kệ sách gỗ sồi có thể xếp chồng, phong cách tối giản.", price: 3500000, category: "furniture", subCategory: "Shelving", material: "Oak Wood", stock: 15, itemNo: "4550182240031", isBestSeller: false, isNewArrival: true, images: ["https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=500"] },
    { name: "Linen Bedding Set (Queen)", description: "Bộ chăn ga gối linen tự nhiên, thoáng khí và mềm mại.", price: 3450000, category: "furniture", subCategory: "Bedding", material: "Linen", stock: 20, itemNo: "4550182240032", isBestSeller: true, isNewArrival: false, images: ["https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?w=500"] },
    { name: "PP Sofa (2-Seater)", description: "Sofa 2 chỗ ngồi khung gỗ, đệm polyester êm ái.", price: 8900000, category: "furniture", subCategory: "Sofa", material: "Wood + Polyester", stock: 8, itemNo: "4550182240033", isBestSeller: false, isNewArrival: false, images: ["https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=500"] },
    { name: "Beads Sofa Set", description: "Ghế sofa hạt nhựa linh hoạt, có thể thay đổi hình dạng.", price: 2450000, category: "furniture", subCategory: "Sofa", material: "EPS Beads", stock: 12, itemNo: "4550182240034", isBestSeller: false, isNewArrival: false, images: ["https://images.unsplash.com/photo-1567538096630-e0c55bd6374c?w=500"] },
    { name: "Cotton Linen Cushion Cover", description: "Vỏ gối trang trí cotton linen màu tự nhiên.", price: 199000, category: "furniture", subCategory: "Bedding", material: "Cotton Linen", stock: 100, itemNo: "4550182240035", isBestSeller: false, isNewArrival: true, images: ["https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=500"] },
    { name: "Walnut Side Table", description: "Bàn phụ gỗ óc chó nhỏ gọn, phù hợp đặt cạnh sofa hoặc giường.", price: 2800000, category: "furniture", subCategory: "Tables", material: "Walnut Wood", stock: 10, itemNo: "4550182240036", isBestSeller: false, isNewArrival: true, images: ["https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=500"] },
    { name: "Steel Mesh Office Chair", description: "Ghế văn phòng lưới thoáng khí, điều chỉnh độ cao linh hoạt.", price: 4200000, category: "furniture", subCategory: "Chairs", material: "Steel + Mesh", stock: 12, itemNo: "4550182240037", isBestSeller: true, isNewArrival: false, images: ["https://images.unsplash.com/photo-1505843513577-22bb7d21e455?w=500"] },
    { name: "Acrylic Desk Organizer", description: "Khay đựng đồ dùng bàn làm việc bằng acrylic trong suốt.", price: 350000, category: "furniture", subCategory: "Storage", material: "Acrylic", stock: 80, itemNo: "4550182240038", isBestSeller: false, isNewArrival: false, images: ["https://images.unsplash.com/photo-1518455027359-f3f8164ba6bd?w=500"] },
    { name: "Floor Lamp with Shade", description: "Đèn sàn chụp vải, ánh sáng ấm áp phù hợp phòng khách.", price: 1800000, category: "furniture", subCategory: "Lighting", material: "Steel + Fabric", stock: 18, itemNo: "4550182240039", isBestSeller: false, isNewArrival: true, images: ["https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=500"] },
    { name: "Hinoki Wood Bath Mat", description: "Thảm tắm gỗ hinoki Nhật Bản, kháng khuẩn và thơm tự nhiên.", price: 650000, category: "furniture", subCategory: "Bathroom", material: "Hinoki Wood", stock: 40, itemNo: "4550182240040", isBestSeller: false, isNewArrival: false, images: ["https://images.unsplash.com/photo-1552321554-5fefe8c9ef14?w=500"] },
];

mongoose.connect(process.env.MONGO_URI).then(async () => {
    // Xóa dữ liệu cũ
    await Product.deleteMany({});
    await User.deleteMany({ email: "admin@muji.vn" });

    // Seed products
    await Product.insertMany(products);

    // Tạo admin mặc định
    const hashedPassword = await bcrypt.hash("Admin@123", 10);

    await User.create({
        name: "Administrator",
        email: "admin@muji.vn",
        password: hashedPassword,
        role: "admin",
        isVerified: true,
    });

    console.log(`✅ Seed thành công ${products.length} sản phẩm!`);
    console.log("✅ Admin created:");
    console.log("Email: admin@muji.vn");
    console.log("Password: Admin@123");

    process.exit();
}).catch(err => {
    console.log("❌ Lỗi:", err);
    process.exit(1);
});