import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getProducts, createProduct, updateProduct, deleteProduct } from "@/services/productService";
import { Pencil, Trash2, Plus, X, Search, Bell, User } from "lucide-react";

const EMPTY_FORM = {
    name: "", description: "", price: "", category: "apparel",
    subCategory: "", stock: "", material: "", itemNo: "",
    isBestSeller: false, isNewArrival: false,
};

export default function AdminProducts() {
    const [products, setProducts] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [form, setForm] = useState(EMPTY_FORM);
    const [editId, setEditId] = useState(null);
    const [error, setError] = useState("");
    const [search, setSearch] = useState("");
    const navigate = useNavigate();
    const [deleteId, setDeleteId] = useState(null);
    const [toast, setToast] = useState("");
    const [showDropdown, setShowDropdown] = useState(false);
    const [uploading, setUploading] = useState(false);

    const fetchProducts = async () => {
        const res = await getProducts({ search });
        setProducts(res.data);
    };

    useEffect(() => {
        const token = localStorage.getItem("token");
        if (!token) return navigate("/login");
        fetchProducts();
    }, [search]);

    useEffect(() => {
        const handler = () => setShowDropdown(false);
        document.addEventListener("click", handler);
        return () => document.removeEventListener("click", handler);
    }, []);

    const openAdd = () => { setForm(EMPTY_FORM); setEditId(null); setError(""); setShowModal(true); };
    const openEdit = (p) => { setForm({ ...p }); setEditId(p._id); setError(""); setShowModal(true); };

    const handleSubmit = async () => {
        try {
            if (editId) await updateProduct(editId, form);
            else await createProduct(form);
            setShowModal(false);
            fetchProducts();
            setToast(editId ? "Cập nhật sản phẩm thành công!" : "Thêm sản phẩm thành công!");
            setTimeout(() => setToast(""), 3000);
        } catch (err) {
            setError(err.response?.data?.msg || "Có lỗi xảy ra");
        }
    };

    const handleDelete = async () => {
        await deleteProduct(deleteId);
        setDeleteId(null);
        fetchProducts();
        setToast("Đã xóa sản phẩm!");
        setTimeout(() => setToast(""), 3000);
    };

    const handleImageUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;
        setUploading(true);
        try {
            const formData = new FormData();
            formData.append("image", file);
            const res = await fetch("import.meta.env.VITE_API_URL/api/upload", {
            method: "POST",
            headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
            body: formData,
            });
            const data = await res.json();
            setForm({ ...form, images: [data.url] });
        } catch {
            setError("Upload ảnh thất bại");
        }
        setUploading(false);
    };

    return (
        <div className="min-h-screen flex flex-col bg-gray-50">
            {/* NAVBAR */}
            <header className="bg-white border-b border-gray-200 px-8 py-4 flex items-center justify-between">
                <div className="flex items-center gap-10">
                    <span
                        className="text-xl font-bold tracking-widest cursor-pointer"
                        style={{ color: "#80001C" }}
                        onClick={() => navigate("/admin")}
                    >
                        MUJI
                    </span>
                    <nav className="flex items-center gap-8 text-xs tracking-widest">
                        <span onClick={() => navigate("/admin")} className="cursor-pointer pb-1 text-gray-400 hover:text-gray-700 transition">
                            DASHBOARD
                        </span>
                        <span className="cursor-pointer pb-1 font-bold border-b-2 text-gray-900 transition" style={{ borderColor: "#80001C" }}>
                            INVENTORY
                        </span>
                        <span onClick={() => navigate("/admin?page=REPORTS")} className="cursor-pointer pb-1 text-gray-400 hover:text-gray-700 transition">
                            REPORTS
                        </span>
                        <span onClick={() => navigate("/admin?page=SETTINGS")} className="cursor-pointer pb-1 text-gray-400 hover:text-gray-700 transition">
                            SETTINGS
                        </span>
                        <span onClick={() => navigate("/admin/orders")} className="cursor-pointer pb-1 text-gray-400 hover:text-gray-700 transition">
                            ORDERS
                        </span>
                    </nav>
                </div>
                <div className="relative">
                    <button
                        onClick={(e) => { e.stopPropagation(); setShowDropdown(!showDropdown); }}
                        className="flex items-center gap-2 text-sm text-gray-600"
                    >
                        <User size={16} strokeWidth={1.5} />
                        <span>Admin</span>
                    </button>

                    {showDropdown && (
                        <div className="absolute right-0 top-8 bg-white shadow-lg w-40 z-50 border border-gray-100">
                            <button
                                onClick={() => { localStorage.clear(); navigate("/login"); }}
                                className="w-full flex items-center gap-3 px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 transition text-left"
                            >
                                Logout
                            </button>
                        </div>
                    )}
                </div>
            </header>

            <div className="px-8 py-6">
                {/* Title */}
                <div className="flex justify-between items-center mb-6">
                    <div>
                        <h1 className="text-xl font-bold text-gray-800">Quản lý sản phẩm</h1>
                        <p className="text-sm text-gray-500">Thêm, sửa, xóa sản phẩm trong hệ thống</p>
                    </div>
                    <button
                        onClick={openAdd}
                        className="flex items-center gap-2 text-white text-sm px-5 py-2 font-semibold tracking-widest hover:opacity-90"
                        style={{ backgroundColor: "#80001C" }}
                    >
                        <Plus size={16} /> THÊM SẢN PHẨM
                    </button>
                </div>

                {/* Search */}
                <div className="bg-white px-4 py-3 mb-4 flex items-center gap-2 border border-gray-200">
                    <Search size={16} className="text-gray-400" />
                    <input
                        type="text"
                        placeholder="Tìm kiếm sản phẩm..."
                        className="flex-1 text-sm focus:outline-none"
                        value={search}
                        onChange={e => setSearch(e.target.value)}
                    />
                </div>

                {/* Table */}
                <div className="bg-white shadow-sm overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead className="bg-gray-50 text-gray-500 uppercase text-xs border-b">
                            <tr>
                                <th className="px-4 py-3 text-left">Tên sản phẩm</th>
                                <th className="px-4 py-3 text-left">Danh mục</th>
                                <th className="px-4 py-3 text-left">Giá</th>
                                <th className="px-4 py-3 text-left">Tồn kho</th>
                                <th className="px-4 py-3 text-left">Chất liệu</th>
                                <th className="px-4 py-3 text-left">Best Seller</th>
                                <th className="px-4 py-3 text-left">New Arrival</th>
                                <th className="px-4 py-3 text-left">Thao tác</th>
                            </tr>
                        </thead>
                        <tbody>
                            {products.map(p => (
                                <tr key={p._id} className="border-t hover:bg-gray-50 transition">
                                    <td className="px-4 py-3 font-medium text-gray-800">{p.name}</td>
                                    <td className="px-4 py-3 capitalize text-gray-500">{p.category}</td>
                                    <td className="px-4 py-3 font-medium" style={{ color: "#80001C" }}>
                                        {Number(p.price).toLocaleString("vi-VN")}đ
                                    </td>
                                    <td className="px-4 py-3">
                                        <span className={`px-2 py-1 text-xs font-semibold ${p.stock < 10 ? "bg-red-100 text-red-600" : "bg-green-100 text-green-600"}`}>
                                            {p.stock}
                                        </span>
                                    </td>
                                    <td className="px-4 py-3 text-gray-500">{p.material || "—"}</td>
                                    <td className="px-4 py-3">{p.isBestSeller ? "✅" : "—"}</td>
                                    <td className="px-4 py-3">{p.isNewArrival ? "✅" : "—"}</td>
                                    <td className="px-4 py-3">
                                        <div className="flex gap-3">
                                            <button onClick={() => openEdit(p)} className="text-blue-500 hover:text-blue-700">
                                                <Pencil size={15} />
                                            </button>
                                            <button onClick={() => setDeleteId(p._id)} className="text-red-500 hover:text-red-700">
                                                <Trash2 size={15} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                            {products.length === 0 && (
                                <tr>
                                    <td colSpan={8} className="text-center py-12 text-gray-400">
                                        Chưa có sản phẩm nào
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Modal */}
            {showModal && (
                <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
                    <div className="bg-white w-full max-w-lg mx-4 p-6 relative max-h-[90vh] overflow-y-auto">
                        <button onClick={() => setShowModal(false)} className="absolute top-4 right-4 text-gray-400 hover:text-gray-800">
                            <X size={20} />
                        </button>
                        <h2 className="text-lg font-bold mb-5 tracking-widest" style={{ color: "#80001C" }}>
                            {editId ? "SỬA SẢN PHẨM" : "THÊM SẢN PHẨM"}
                        </h2>

                        {error && (
                            <div className="bg-red-50 border border-red-200 text-red-600 text-sm px-4 py-3 mb-4">
                                ⚠️ {error}
                            </div>
                        )}

                        <div className="grid grid-cols-2 gap-3 mb-3">
                            {[
                                { label: "Tên sản phẩm", key: "name", col: 2 },
                                { label: "Giá (VNĐ)", key: "price", type: "number" },
                                { label: "Tồn kho", key: "stock", type: "number" },
                                { label: "Chất liệu", key: "material" },
                                { label: "Item No.", key: "itemNo" },
                                { label: "Mô tả", key: "description", col: 2 },
                            ].map(({ label, key, type = "text", col }) => (
                                <div key={key} className={col === 2 ? "col-span-2" : ""}>
                                    <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">{label}</label>
                                    <input
                                        type={type}
                                        className="w-full border border-gray-300 px-3 py-2 text-sm mt-1 focus:outline-none focus:border-gray-500"
                                        value={form[key]}
                                        onChange={e => setForm({ ...form, [key]: e.target.value })}
                                    />
                                </div>
                            ))}
                        </div>

                        {/* Upload ảnh */}
                        <div className="mb-4">
                            <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                                Hình ảnh sản phẩm
                            </label>
                            <input
                                type="file"
                                accept="image/*"
                                className="w-full border border-gray-300 px-3 py-2 text-sm mt-1 focus:outline-none"
                                onChange={handleImageUpload}
                            />
                            {uploading && <p className="text-xs text-gray-400 mt-1">⏳ Đang upload...</p>}
                            {form.images?.[0] && (
                                <img
                                src={form.images[0]}
                                alt="preview"
                                className="mt-2 h-32 w-full object-cover border border-gray-200"
                                />
                            )}
                        </div>

                        <div className="mb-4">
                            <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Danh mục</label>
                            <select
                                className="w-full border border-gray-300 px-3 py-2 text-sm mt-1 focus:outline-none bg-white"
                                value={form.category}
                                onChange={e => setForm({ ...form, category: e.target.value })}
                            >
                                <option value="apparel">Apparel</option>
                                <option value="household">Household</option>
                                <option value="food">Food</option>
                                <option value="furniture">Furniture</option>
                            </select>
                        </div>

                        <div className="flex gap-6 mb-6">
                            {[{ label: "Best Seller", key: "isBestSeller" }, { label: "New Arrival", key: "isNewArrival" }].map(({ label, key }) => (
                                <label key={key} className="flex items-center gap-2 text-sm text-gray-600 cursor-pointer">
                                    <input
                                        type="checkbox"
                                        checked={form[key]}
                                        className="w-4 h-4 accent-[#80001C]"
                                        onChange={e => setForm({ ...form, [key]: e.target.checked })}
                                    />
                                    {label}
                                </label>
                            ))}
                        </div>

                        <button
                            onClick={handleSubmit}
                            className="w-full text-white text-sm font-semibold py-3 tracking-widest hover:opacity-90 transition"
                            style={{ backgroundColor: "#80001C" }}
                        >
                            {editId ? "CẬP NHẬT" : "THÊM SẢN PHẨM"}
                        </button>
                    </div>
                </div>
            )}
            {/* Modal xác nhận xóa */}
            {deleteId && (
                <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
                    <div className="bg-white w-full max-w-sm mx-4 p-6 relative">
                        <button
                            onClick={() => setDeleteId(null)}
                            className="absolute top-4 right-4 text-gray-400 hover:text-gray-800"
                        >
                            <X size={20} />
                        </button>
                        <div className="text-center">
                            <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                <Trash2 size={20} className="text-red-600" />
                            </div>
                            <h2 className="text-base font-bold text-gray-800 mb-2">Xóa sản phẩm?</h2>
                            <p className="text-sm text-gray-500 mb-6">
                                Hành động này không thể hoàn tác. Sản phẩm sẽ bị xóa vĩnh viễn.
                            </p>
                            <div className="flex gap-3">
                                <button
                                    onClick={() => setDeleteId(null)}
                                    className="flex-1 border border-gray-300 text-gray-600 text-sm py-2 hover:bg-gray-50 transition"
                                >
                                    Hủy
                                </button>
                                <button
                                    onClick={handleDelete}
                                    className="flex-1 text-white text-sm py-2 hover:opacity-90 transition"
                                    style={{ backgroundColor: "#80001C" }}
                                >
                                    Xóa
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
            {toast && (
                <div className="fixed top-6 right-6 z-50 bg-green-100 border border-green-300 text-green-700 text-sm px-5 py-3 shadow-lg flex items-center gap-2 animate-fade-in">
                    {toast}
                </div>
            )}
        </div>
    );
}