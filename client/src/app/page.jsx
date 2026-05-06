import { useNavigate } from "react-router-dom";
import { Search, ShoppingBag, User } from "lucide-react";

export default function Home() {
    const navigate = useNavigate();

    return (
        <div className="min-h-screen flex flex-col">
            {/* NAVBAR */}
            <header className="flex items-center justify-between px-8 py-4 border-b border-gray-200">
                <span className="text-xl font-bold tracking-widest cursor-pointer" style={{ color: "#80001C" }}>
                    MUJI
                </span>
                <nav className="hidden md:flex items-center gap-8 text-xs tracking-widest text-gray-600">
                    <nav className="hidden md:flex items-center gap-8 text-xs tracking-widest text-gray-600">
                        <span onClick={() => navigate("/products?category=apparel")} className="cursor-pointer hover:text-gray-900">APPAREL</span>
                        <span onClick={() => navigate("/products?category=household")} className="cursor-pointer hover:text-gray-900">HOUSEHOLD</span>
                        <span onClick={() => navigate("/products?category=food")} className="cursor-pointer hover:text-gray-900">FOOD</span>
                        <span onClick={() => navigate("/products?category=furniture")} className="cursor-pointer hover:text-gray-900">FURNITURE</span>
                    </nav>
                </nav>
                <div className="flex items-center gap-4">
                    <button><Search size={20} style={{ color: "#80001C" }} strokeWidth={1.5} /></button>
                    <button onClick={() => navigate("/cart")}>
                        <ShoppingBag size={20} style={{ color: "#80001C" }} strokeWidth={1.5} />
                    </button>
                    <button onClick={() => navigate("/account")}>
                        <User size={20} style={{ color: "#80001C" }} strokeWidth={1.5} />
                    </button>
                </div>
            </header>

            {/* HERO BANNER */}
            <div className="relative">
                <img
                    src="https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=1200"
                    alt="Hero"
                    className="w-full h-96 object-cover"
                />
                <div className="absolute inset-0 flex items-center">
                    <div className="bg-white/90 ml-10 p-8 max-w-xs">
                        <h1 className="text-3xl font-bold mb-2" style={{ color: "#80001C" }}>
                            Clean Living.<br />Simple Life.
                        </h1>
                        <p className="text-xs text-gray-500 mb-4">
                            Discover the new Autumn/Winter collection, designed for comfort and functional purity.
                        </p>
                        <button
                            style={{ backgroundColor: "#80001C" }}
                            className="text-white text-xs tracking-widest px-6 py-3 hover:opacity-90 transition"
                        >
                            SHOP COLLECTION
                        </button>
                    </div>
                </div>
            </div>

            {/* NEW ARRIVALS */}
            <div className="px-8 py-12">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-sm font-bold tracking-widest" style={{ color: "#80001C" }}>NEW ARRIVALS</h2>
                    <span className="text-xs text-gray-400 cursor-pointer hover:underline tracking-widest">VIEW ALL</span>
                </div>
                <div className="grid grid-cols-2 gap-4">
                    <div className="bg-gray-50 cursor-pointer hover:opacity-90 transition">
                        <img src="https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=600" alt="" className="w-full h-72 object-cover" />
                        <div className="p-4">
                            <p className="text-xs text-gray-400 uppercase tracking-wider mb-1">Apparel</p>
                            <p className="text-sm font-medium">Organic Cotton Series</p>
                        </div>
                    </div>
                    <div className="bg-gray-50 cursor-pointer hover:opacity-90 transition">
                        <img src="https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=600" alt="" className="w-full h-72 object-cover" />
                        <div className="p-4">
                            <p className="text-xs text-gray-400 uppercase tracking-wider mb-1">Household</p>
                            <p className="text-sm font-medium">Standard Kitchenware</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* BEST SELLERS */}
            <div className="px-8 py-8 bg-gray-50">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-sm font-bold tracking-widest" style={{ color: "#80001C" }}>BEST SELLERS</h2>
                    <span className="text-xs text-gray-400 cursor-pointer hover:underline tracking-widest">VIEW ALL</span>
                </div>
                <div className="grid grid-cols-4 gap-4">
                    {[
                        { name: "Ultrasonic Aroma Diffuser", sub: "Classic Home Fragrance", price: "1.250.000 VND", img: "https://images.unsplash.com/photo-1602928321679-560bb453f190?w=400" },
                        { name: "Linen Bedding Set", sub: "Natural Beige", price: "3.450.000 VND", img: "https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=400" },
                        { name: "Smooth Gel Ink Pen", sub: "Black 0.5mm", price: "25.000 VND", img: "https://images.unsplash.com/photo-1585336261022-680e295ce3fe?w=400" },
                        { name: "Cotton Crew Neck T-Shirt", sub: "Men's Apparel", price: "299.000 VND", img: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400" },
                    ].map((item, i) => (
                        <div key={i} className="cursor-pointer hover:opacity-90 transition">
                            <img src={item.img} alt={item.name} className="w-full h-48 object-cover bg-gray-200" />
                            <div className="pt-3">
                                <p className="text-sm font-medium">{item.name}</p>
                                <p className="text-xs text-gray-400 mb-1">{item.sub}</p>
                                <p className="text-sm font-semibold" style={{ color: "#80001C" }}>{item.price}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* QUOTE */}
            <div className="px-8 py-16 text-center bg-[#f5f0eb]">
                <h2 className="text-xl font-bold tracking-widest mb-3">"NO-BRAND QUALITY GOODS"</h2>
                <p className="text-xs text-gray-500 max-w-md mx-auto leading-relaxed">
                    MUJI's concept is to focus on the essential qualities of a product through careful selection of
                    materials, streamlining processes, and simplifying packages.
                </p>
            </div>

            {/* FOOTER */}
            <footer className="bg-[#f5f0eb] border-t border-gray-200 py-6 text-center text-xs text-gray-400 space-x-6">
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