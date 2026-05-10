import { useState, useEffect, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Search, ShoppingBag, User, Minus, Plus, Package, Star, ClipboardList, LogOut, Info } from "lucide-react";
import { getProductById, getProducts } from "@/services/productService";
import { useCart } from "@/context/CartContext";

export default function ProductDetail() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [product, setProduct] = useState(null);
    const [related, setRelated] = useState([]);
    const [quantity, setQuantity] = useState(1);
    const [selectedSize, setSelectedSize] = useState("");
    const [selectedImage, setSelectedImage] = useState(0);
    const [adding, setAdding] = useState(false);
    const [showDropdown, setShowDropdown] = useState(false);
    const [reviews, setReviews] = useState([]);
    const [rating, setRating] = useState(5);
    const [comment, setComment] = useState("");
    const [submitting, setSubmitting] = useState(false);
    const { addToCart } = useCart();
    const { cartCount } = useCart();
    const { refreshCart } = useCart();

    const userButtonRef = useRef(null);
    const userDropdownRef = useRef(null);

    useEffect(() => {
        getProductById(id).then(res => {
            setProduct(res.data);
            if (res.data.sizes?.length > 0) setSelectedSize(res.data.sizes[0]);
            getProducts({ category: res.data.category }).then(r => {
                setRelated(r.data.filter(p => p._id !== id).slice(0, 4));
            });
            const savedReviews = JSON.parse(localStorage.getItem(`reviews_${id}`) || "[]");
            setReviews(savedReviews);
        });
        setSelectedImage(0);
    }, [id]);

    // Fix: dùng useRef thay vì querySelector để tránh timing issue
    useEffect(() => {
        const handler = (e) => {
            if (
                userButtonRef.current &&
                userDropdownRef.current &&
                !userButtonRef.current.contains(e.target) &&
                !userDropdownRef.current.contains(e.target)
            ) {
                setShowDropdown(false);
            }
        };
        document.addEventListener("mousedown", handler);
        return () => document.removeEventListener("mousedown", handler);
    }, []);

    const handleAddToCart = async () => { 
        setAdding(true);
        try {
            await addToCart({ productId: id, quantity, size: selectedSize });
            refreshCart(); 

            setTimeout(() => {
                setAdding(false);
                alert("Thêm vào giỏ hàng thành công!");
            }, 500);

        } catch (error) {
            console.error("Lỗi khi thêm vào giỏ hàng:", error);
            setAdding(false);
            alert("Có lỗi xảy ra, vui lòng thử lại.");
        }
    };

    const handleSubmitReview = () => {
        if (!comment.trim()) {
            alert("Vui lòng viết bình luận!");
            return;
        }

        const user = JSON.parse(localStorage.getItem("user"));
        if (!user) {
            alert("Vui lòng đăng nhập để đánh giá!");
            navigate("/login");
            return;
        }

        setSubmitting(true);
        const newReview = {
            id: Date.now(),
            author: user.fullName || user.email,
            rating,
            comment,
            date: new Date().toLocaleDateString("vi-VN")
        };

        const updatedReviews = [newReview, ...reviews];
        setReviews(updatedReviews);
        localStorage.setItem(`reviews_${id}`, JSON.stringify(updatedReviews));

        setComment("");
        setRating(5);
        setSubmitting(false);
        alert("Cảm ơn đánh giá của bạn!");
    };

    if (!product) return (
        <div className="min-h-screen flex items-center justify-center text-gray-400 text-sm">Đang tải...</div>
    );

    const images = product.images?.length > 0 ? product.images : ["https://via.placeholder.com/600x500?text=No+Image"];
    const avgRating = reviews.length > 0 ? (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1) : 0;

    const dropdownItems = [
        { label: "Account Information", icon: <Info size={14} />, path: "/account" },
        { label: "My Orders", icon: <Package size={14} />, path: "/orders" },
        { label: "Order Status", icon: <ClipboardList size={14} />, path: "/orders/status" },
        { label: "My Reviews", icon: <Star size={14} />, path: "#reviews" },
    ];

    return (
        <div className="min-h-screen flex flex-col bg-white">
            {/* NAVBAR */}
            <header className="flex items-center justify-between px-8 py-4 border-b border-gray-200 bg-white sticky top-0 z-40">
                <span
                    onClick={() => navigate("/home")}
                    className="text-xl font-bold tracking-widest cursor-pointer"
                    style={{ color: "#80001C" }}
                >
                    MUJI
                </span>
                <nav className="hidden md:flex items-center gap-8 text-xs tracking-widest text-gray-600">
                    {["apparel", "household", "food", "furniture"].map(cat => (
                        <span
                            key={cat}
                            onClick={() => navigate(`/products?category=${cat}`)}
                            className="cursor-pointer hover:text-gray-900 uppercase"
                        >
                            {cat}
                        </span>
                    ))}
                </nav>
                <div className="flex items-center gap-4">
                    <button onClick={() => navigate("/products")}>
                        <Search size={20} style={{ color: "#80001C" }} strokeWidth={1.5} />
                    </button>
                    <button onClick={() => navigate("/cart")} className="relative">
                    <ShoppingBag size={20} style={{ color: "#80001C" }} strokeWidth={1.5} />
                        {cartCount > 0 && (
                            <span className="absolute -top-2 -right-2 w-4 h-4 rounded-full text-white text-xs flex items-center justify-center font-bold"
                            style={{ backgroundColor: "#80001C", fontSize: "10px" }}>
                            {cartCount > 9 ? "9+" : cartCount}
                            </span>
                        )}
                    </button>

                    {/* USER DROPDOWN */}
                    <div className="relative">
                        <button
                            ref={userButtonRef}
                            onClick={() => setShowDropdown(prev => !prev)}
                        >
                            <User size={20} style={{ color: "#80001C" }} strokeWidth={1.5} />
                        </button>

                        {showDropdown && (
                            <div
                                ref={userDropdownRef}
                                className="absolute right-0 top-9 bg-white shadow-xl w-52 z-50 border border-gray-100 rounded-sm overflow-hidden"
                            >
                                {dropdownItems.map(item => (
                                    <button
                                        key={item.label}
                                        onClick={() => {
                                            if (item.path === "#reviews") {
                                                document.getElementById("reviews-section")?.scrollIntoView({ behavior: "smooth" });
                                            } else {
                                                navigate(item.path);
                                            }
                                            setShowDropdown(false);
                                        }}
                                        className="w-full px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 text-left flex items-center gap-3 transition-colors"
                                    >
                                        <span style={{ color: "#80001C" }}>{item.icon}</span>
                                        {item.label}
                                    </button>
                                ))}

                                <div className="border-t border-gray-100">
                                    <button
                                        onClick={() => {
                                            localStorage.clear();
                                            navigate("/login");
                                        }}
                                        className="w-full px-4 py-3 text-sm text-gray-700 hover:bg-red-50 text-left flex items-center gap-3 transition-colors"
                                    >
                                        <LogOut size={14} style={{ color: "#80001C" }} />
                                        Logout
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </header>

            {/* BREADCRUMB */}
            <div className="px-8 py-3 text-xs text-gray-400 flex gap-2">
                <span onClick={() => navigate("/home")} className="cursor-pointer hover:underline">HOME</span>
                <span>›</span>
                <span onClick={() => navigate(`/products?category=${product.category}`)} className="cursor-pointer hover:underline uppercase">{product.category}</span>
                <span>›</span>
                <span className="text-gray-600 uppercase">{product.name}</span>
            </div>

            {/* MAIN */}
            <div className="px-8 py-6 max-w-5xl mx-auto w-full">
                <div className="grid grid-cols-2 gap-12">
                    {/* LEFT - Images */}
                    <div>
                        <img
                            src={images[selectedImage]}
                            alt={product.name}
                            className="w-full h-[480px] object-cover bg-gray-100 mb-3"
                        />
                        {images.length > 1 && (
                            <div className="flex gap-2">
                                {images.map((img, i) => (
                                    <img
                                        key={i}
                                        src={img}
                                        alt=""
                                        onClick={() => setSelectedImage(i)}
                                        className={`w-20 h-20 object-cover cursor-pointer border-2 transition ${selectedImage === i ? "border-gray-800" : "border-transparent hover:border-gray-300"}`}
                                    />
                                ))}
                            </div>
                        )}
                    </div>

                    {/* RIGHT - Info */}
                    <div>
                        <p className="text-xs font-semibold tracking-widest mb-2" style={{ color: "#80001C" }}>
                            {product.category?.toUpperCase()} / {product.subCategory?.toUpperCase()}
                        </p>
                        <h1 className="text-xl font-bold text-gray-800 mb-1">{product.name}</h1>
                        {product.itemNo && <p className="text-xs text-gray-400 mb-4">Item No. {product.itemNo}</p>}

                        {reviews.length > 0 && (
                            <div className="flex items-center gap-2 mb-4">
                                <span className="text-yellow-400">{"⭐".repeat(Math.round(avgRating))}</span>
                                <span className="text-sm text-gray-600">{avgRating} ({reviews.length} đánh giá)</span>
                            </div>
                        )}

                        <p className="text-2xl font-bold mb-4" style={{ color: "#80001C" }}>
                            {Number(product.price).toLocaleString("vi-VN")}đ
                        </p>
                        <p className="text-sm text-gray-500 leading-relaxed mb-6">{product.description}</p>

                        {product.sizes?.length > 0 && (
                            <div className="mb-6">
                                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">SIZE: {selectedSize}</p>
                                <div className="flex gap-2">
                                    {product.sizes.map(size => (
                                        <button
                                            key={size}
                                            onClick={() => setSelectedSize(size)}
                                            className={`px-4 py-2 text-xs border font-semibold transition ${selectedSize === size ? "border-gray-800 text-gray-800" : "border-gray-200 text-gray-400 hover:border-gray-400"}`}
                                        >
                                            {size}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}

                        <div className="mb-6">
                            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">QUANTITY</p>
                            <div className="flex items-center border border-gray-200 w-fit">
                                <button onClick={() => setQuantity(q => Math.max(1, q - 1))} className="px-4 py-2 hover:bg-gray-50"><Minus size={14} /></button>
                                <span className="text-sm font-semibold w-10 text-center">{quantity}</span>
                                <button onClick={() => setQuantity(q => Math.min(product.stock, q + 1))} className="px-4 py-2 hover:bg-gray-50"><Plus size={14} /></button>
                            </div>
                        </div>

                        <button
                            onClick={handleAddToCart}
                            disabled={adding || product.stock === 0}
                            className="w-full text-white text-sm font-semibold tracking-widest py-4 mb-3 hover:opacity-90 transition disabled:opacity-50"
                            style={{ backgroundColor: "#80001C" }}
                        >
                            {product.stock === 0 ? "HẾT HÀNG" : adding ? "ĐANG THÊM..." : "THÊM VÀO GIỎ HÀNG"}
                        </button>
                        <button className="w-full border border-gray-300 text-sm font-semibold tracking-widest py-4 hover:bg-gray-50 transition">
                            FIND IN STORE
                        </button>

                        <div className="mt-6 space-y-2 text-xs text-gray-500 border-t border-gray-100 pt-4">
                            <p>🚚 Standard delivery within 3-5 business days.</p>
                            <p>🔄 30-day return policy for unused items.</p>
                            {product.stock <= 10 && product.stock > 0 && (
                                <p className="text-red-500 font-semibold">⚠️ Chỉ còn {product.stock} sản phẩm!</p>
                            )}
                        </div>
                    </div>
                </div>

                {/* REVIEWS SECTION */}
                <div id="reviews-section" className="mt-12 border-t border-gray-200 pt-8">
                    <div className="flex justify-between items-center mb-6">
                        <p className="text-xs font-bold tracking-widest text-gray-700">CUSTOMER REVIEWS</p>
                        <p className="text-sm text-gray-600">{reviews.length} đánh giá</p>
                    </div>

                    <div className="bg-gray-50 p-6 rounded mb-8">
                        <h3 className="font-semibold mb-4">Viết đánh giá của bạn</h3>
                        <div className="space-y-4">
                            <div>
                                <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider block mb-2">Đánh giá</label>
                                <div className="flex gap-2">
                                    {[1, 2, 3, 4, 5].map(star => (
                                        <button
                                            key={star}
                                            onClick={() => setRating(star)}
                                            className={`text-2xl hover:scale-125 transition ${star <= rating ? "opacity-100" : "opacity-40"}`}
                                        >
                                            ⭐
                                        </button>
                                    ))}
                                </div>
                            </div>
                            <div>
                                <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider block mb-2">Bình luận</label>
                                <textarea
                                    value={comment}
                                    onChange={(e) => setComment(e.target.value)}
                                    placeholder="Chia sẻ trải nghiệm của bạn..."
                                    className="w-full border border-gray-300 rounded p-3 text-sm"
                                    rows="4"
                                />
                            </div>
                            <button
                                onClick={handleSubmitReview}
                                disabled={submitting}
                                style={{ backgroundColor: "#80001C" }}
                                className="text-white px-6 py-2 rounded hover:opacity-90 transition font-semibold text-sm disabled:opacity-50"
                            >
                                {submitting ? "ĐANG GỬI..." : "GỬI ĐÁNH GIÁ"}
                            </button>
                        </div>
                    </div>

                    <div className="space-y-4">
                        {reviews.length === 0 ? (
                            <p className="text-center text-gray-400 py-8">Chưa có đánh giá nào. Hãy là người đầu tiên!</p>
                        ) : (
                            reviews.map(review => (
                                <div key={review.id} className="border border-gray-200 p-4 rounded">
                                    <div className="flex items-center justify-between mb-2">
                                        <span className="font-semibold">{review.author}</span>
                                        <span className="text-yellow-400">{"⭐".repeat(review.rating)}</span>
                                    </div>
                                    <p className="text-xs text-gray-400 mb-2">{review.date}</p>
                                    <p className="text-sm text-gray-700">{review.comment}</p>
                                </div>
                            ))
                        )}
                    </div>
                </div>

                {/* PRODUCT DETAILS */}
                {product.material && (
                    <div className="mt-12 border-t border-gray-200 pt-8">
                        <p className="text-xs font-bold tracking-widest text-gray-700 mb-6">PRODUCT DETAILS</p>
                        <div className="grid grid-cols-2 gap-6">
                            <div className="bg-gray-50 p-6">
                                <p className="text-xs font-bold tracking-widest mb-4" style={{ color: "#80001C" }}>SPECIFICATIONS</p>
                                <div className="space-y-2 text-xs text-gray-600">
                                    {product.material && <div className="flex justify-between"><span>Material</span><span>{product.material}</span></div>}
                                    {product.stock && <div className="flex justify-between"><span>In Stock</span><span>{product.stock} units</span></div>}
                                    {product.itemNo && <div className="flex justify-between"><span>Item No.</span><span>{product.itemNo}</span></div>}
                                </div>
                            </div>
                            <div className="bg-gray-50 p-6">
                                <p className="text-xs font-bold tracking-widest mb-4" style={{ color: "#80001C" }}>FEATURES</p>
                                <p className="text-xs text-gray-600 leading-relaxed">{product.description}</p>
                            </div>
                        </div>
                    </div>
                )}

                {/* RELATED PRODUCTS */}
                {related.length > 0 && (
                    <div className="mt-12 border-t border-gray-200 pt-8">
                        <div className="flex justify-between items-center mb-6">
                            <p className="text-xs font-bold tracking-widest text-gray-700">RELATED PRODUCTS</p>
                            <span
                                onClick={() => navigate(`/products?category=${product.category}`)}
                                className="text-xs text-gray-400 cursor-pointer hover:underline tracking-widest"
                            >
                                VIEW ALL
                            </span>
                        </div>
                        <div className="grid grid-cols-4 gap-4">
                            {related.map(p => (
                                <div key={p._id} onClick={() => navigate(`/products/${p._id}`)} className="cursor-pointer group">
                                    <div className="relative overflow-hidden bg-gray-100">
                                        {p.isNewArrival && (
                                            <span className="absolute top-2 left-2 text-xs text-white px-2 py-1 z-10 tracking-wider" style={{ backgroundColor: "#80001C" }}>NEW</span>
                                        )}
                                        <img
                                            src={p.images?.[0] || "https://via.placeholder.com/300"}
                                            alt={p.name}
                                            className="w-full h-40 object-cover group-hover:scale-105 transition duration-300"
                                        />
                                    </div>
                                    <div className="pt-2">
                                        <p className="text-xs text-gray-400 uppercase tracking-wider mb-1">{p.subCategory}</p>
                                        <p className="text-sm font-medium text-gray-800">{p.name}</p>
                                        <p className="text-sm font-semibold mt-1" style={{ color: "#80001C" }}>
                                            {Number(p.price).toLocaleString("vi-VN")}đ
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>

            {/* FOOTER */}
            <footer className="bg-[#f5f0eb] py-6 text-center text-xs text-gray-400 space-x-6 border-t border-gray-200 mt-12">
                <span className="cursor-pointer hover:underline">STORE LOCATOR</span>
                <span className="cursor-pointer hover:underline">ABOUT MUJI</span>
                <span className="cursor-pointer hover:underline">SUSTAINABILITY</span>
                <span className="cursor-pointer hover:underline">CONTACT US</span>
                <span className="cursor-pointer hover:underline">PRIVACY POLICY</span>
                <div className="mt-2">© RYOHIN KEIKAKU CO., LTD.</div>
            </footer>
        </div>
    );
}