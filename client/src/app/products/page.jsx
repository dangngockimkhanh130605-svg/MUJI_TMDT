import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Search, ShoppingBag, User } from "lucide-react";
import { getProducts } from "@/services/productService";
import { useCart } from "@/context/CartContext";

const CATEGORIES = {
    apparel: ["Tops", "Shirts", "Bottoms", "Outerwear", "Knitwear", "Footwear"],
    household: ["Kitchen", "Storage", "Bathroom", "Aroma"],
    food: ["Bakery", "Beverages", "Snacks", "Condiments", "Instant Food", "Aroma"],
    furniture: ["Shelving", "Bedding", "Sofa", "Tables", "Chairs", "Storage", "Lighting", "Bathroom"],
};

export default function ProductList() {
    const [products, setProducts] = useState([]);
    const [allProducts, setAllProducts] = useState([]);
    const [category, setCategory] = useState("");
    const [subCategory, setSubCategory] = useState("");
    const [sort, setSort] = useState("newest");
    const [minPrice, setMinPrice] = useState(0);
    const [maxPrice, setMaxPrice] = useState(5000000);
    const [showDropdown, setShowDropdown] = useState(false);
    const [search, setSearch] = useState("");
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const { cartCount } = useCart();

    useEffect(() => {
        const cat = searchParams.get("category") || "";
        setCategory(cat);
        setSubCategory("");
    }, []);

    useEffect(() => {
        const handler = () => setShowDropdown(false);
        document.addEventListener("click", handler);
        return () => document.removeEventListener("click", handler);
    }, []);

    // Fetch filtered products (có subCategory)
    useEffect(() => {
        getProducts({ category, sort, minPrice, maxPrice, search, subCategory })
            .then(res => setProducts(res.data));
    }, [category, sort, minPrice, maxPrice, search, subCategory]);

    // Fetch all products của category để đếm count đúng
    useEffect(() => {
        getProducts({ category, minPrice, maxPrice, search })
            .then(res => setAllProducts(res.data));
    }, [category, minPrice, maxPrice, search]);

    return (
        <div className="min-h-screen flex flex-col bg-white">
            {/* NAVBAR */}
            <header className="flex items-center justify-between px-8 py-4 border-b border-gray-200 bg-white sticky top-0 z-40">
                <span onClick={() => navigate("/home")} className="text-xl font-bold tracking-widest cursor-pointer" style={{ color: "#80001C" }}>
                    MUJI
                </span>
                <nav className="hidden md:flex items-center gap-8 text-xs tracking-widest">
                    {["apparel", "household", "food", "furniture"].map(cat => (
                        <span
                            key={cat}
                            onClick={() => { setCategory(cat === category ? "" : cat); setSubCategory(""); }}
                            className={`cursor-pointer pb-1 uppercase transition ${category === cat
                                ? "font-bold border-b-2 text-gray-900"
                                : "text-gray-500 hover:text-gray-900"}`}
                            style={category === cat ? { borderColor: "#80001C" } : {}}
                        >
                            {cat}
                        </span>
                    ))}
                </nav>
                <div className="flex items-center gap-4">
                    <button><Search size={20} style={{ color: "#80001C" }} strokeWidth={1.5} /></button>
                    <button onClick={() => navigate("/cart")} className="relative">
                    <ShoppingBag size={20} style={{ color: "#80001C" }} strokeWidth={1.5} />
                        {cartCount > 0 && (
                            <span className="absolute -top-2 -right-2 w-4 h-4 rounded-full text-white text-xs flex items-center justify-center font-bold"
                            style={{ backgroundColor: "#80001C", fontSize: "10px" }}>
                            {cartCount > 9 ? "9+" : cartCount}
                            </span>
                        )}
                    </button>
                    <div className="relative">
                        <button onClick={(e) => { e.stopPropagation(); setShowDropdown(!showDropdown); }}>
                            <User size={20} style={{ color: "#80001C" }} strokeWidth={1.5} />
                        </button>
                        {showDropdown && (
                            <div className="absolute right-0 top-8 bg-white shadow-lg w-48 z-50 border border-gray-100">
                                {[
                                    { label: "Account Information", path: "/account" },
                                    { label: "My Orders", path: "/orders" },
                                ].map(item => (
                                    <button key={item.path} onClick={() => { navigate(item.path); setShowDropdown(false); }}
                                        className="w-full px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 text-left">
                                        {item.label}
                                    </button>
                                ))}
                                <div className="border-t border-gray-100">
                                    <button onClick={() => { localStorage.clear(); navigate("/login"); }}
                                        className="w-full px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 text-left">
                                        Logout
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </header>

            <div className="flex flex-1">
                {/* SIDEBAR */}
                <aside className="w-52 shrink-0 border-r border-gray-100 px-6 py-8 hidden md:block">
                    <button
                        onClick={() => { setCategory(""); setSubCategory(""); }}
                        className="text-sm w-full text-left py-1 mb-4 font-semibold"
                        style={{ color: category === "" ? "#80001C" : "#6b7280" }}
                    >
                        All Products ({allProducts.length || products.length})
                    </button>

                    {/* Category filter */}
                    <div className="mb-8">
                        <p className="text-xs font-bold tracking-widest text-gray-700 mb-4">CATEGORY</p>
                        <div className="space-y-2">
                            {category && (CATEGORIES[category] ?? []).map(sub => {
                                const count = allProducts.filter(p =>
                                    p.subCategory?.toLowerCase() === sub.toLowerCase()
                                ).length;
                                return (
                                    <div key={sub} className="flex justify-between items-center">
                                        <span
                                            onClick={() => setSubCategory(sub === subCategory ? "" : sub)}
                                            className="text-xs cursor-pointer hover:text-gray-900 transition"
                                            style={{ color: subCategory === sub ? "#80001C" : "#6b7280" }}
                                        >
                                            {sub}
                                        </span>
                                        <span className="text-xs text-gray-400">({count})</span>
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                    {/* Price Range */}
                    <div>
                        <p className="text-xs font-bold tracking-widest text-gray-700 mb-4">PRICE RANGE</p>
                        <div className="flex justify-between text-xs text-gray-400 mb-2">
                            <span>₫{Number(minPrice).toLocaleString("vi-VN")}</span>
                            <span>₫{Number(maxPrice).toLocaleString("vi-VN")}</span>
                        </div>
                        <input
                            type="range"
                            min={0}
                            max={5000000}
                            step={100000}
                            value={maxPrice}
                            onChange={e => setMaxPrice(Number(e.target.value))}
                            className="w-full accent-[#80001C]"
                        />
                    </div>
                </aside>

                {/* MAIN */}
                <main className="flex-1 px-8 py-8">
                    <div className="flex justify-between items-center mb-6">
                        <div>
                            <h1 className="text-lg font-bold tracking-widest uppercase text-gray-800">
                                {subCategory || category || "All Products"}
                            </h1>
                            <p className="text-xs text-gray-400 mt-1">Found {products.length} items</p>
                        </div>
                        <div className="flex items-center gap-4">
                            <div className="flex items-center gap-2 border border-gray-200 px-3 py-2 bg-white w-56">
                                <Search size={14} className="text-gray-400" />
                                <input
                                    type="text"
                                    placeholder="Search products..."
                                    className="text-xs flex-1 focus:outline-none"
                                    value={search}
                                    onChange={e => setSearch(e.target.value)}
                                />
                            </div>
                            <div className="flex items-center gap-2 text-xs text-gray-500">
                                <span className="tracking-widest">SORT BY</span>
                                <select
                                    value={sort}
                                    onChange={e => setSort(e.target.value)}
                                    className="border border-gray-200 px-3 py-2 text-xs bg-white focus:outline-none"
                                >
                                    <option value="newest">NEW ARRIVALS</option>
                                    <option value="price_asc">PRICE: LOW TO HIGH</option>
                                    <option value="price_desc">PRICE: HIGH TO LOW</option>
                                </select>
                            </div>
                        </div>
                    </div>

                    {products.length === 0 ? (
                        <div className="text-center py-20 text-gray-400 text-sm">
                            Không tìm thấy sản phẩm nào
                        </div>
                    ) : (
                        <div className="grid grid-cols-3 gap-x-6 gap-y-10">
                            {products.map(p => (
                                <div
                                    key={p._id}
                                    onClick={() => navigate(`/products/${p._id}`)}
                                    className="cursor-pointer group"
                                >
                                    <div className="relative overflow-hidden bg-gray-100 mb-3">
                                        {p.isNewArrival && (
                                            <span
                                                className="absolute top-2 left-2 text-xs text-white px-2 py-1 z-10 tracking-wider"
                                                style={{ backgroundColor: "#80001C" }}
                                            >
                                                NEW
                                            </span>
                                        )}
                                        {p.isBestSeller && (
                                            <span className="absolute top-2 right-2 text-xs text-white px-2 py-1 z-10 tracking-wider bg-gray-700">
                                                BEST
                                            </span>
                                        )}
                                        <img
                                            src={p.images?.[0] || "https://via.placeholder.com/400x300?text=No+Image"}
                                            alt={p.name}
                                            className="w-full h-64 object-cover group-hover:scale-105 transition duration-300"
                                        />
                                    </div>
                                    <p className="text-xs text-gray-400 uppercase tracking-wider mb-1">
                                        {p.subCategory || p.category}
                                    </p>
                                    <p className="text-sm font-medium text-gray-800 mb-1">{p.name}</p>
                                    <p className="text-sm font-semibold" style={{ color: "#80001C" }}>
                                        ₫{Number(p.price).toLocaleString("vi-VN")}
                                    </p>
                                </div>
                            ))}
                        </div>
                    )}
                </main>
            </div>

            {/* FOOTER */}
            <footer className="bg-[#f5f0eb] py-6 text-center text-xs text-gray-400 space-x-6 border-t border-gray-200 mt-8">
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