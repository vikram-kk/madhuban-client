import React, { useEffect, useState } from "react";
import API from "../services/api";
import { motion } from "framer-motion";

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState("products"); // tabs: 'products' | 'orders'
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [usersCount, setUsersCount] = useState(0); // Added for tracking total patrons
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Form State for creating a new product
  const [newProduct, setNewProduct] = useState({
    name: "",
    description: "",
    price: "",
    MRP: "",
    stock: "",
    brand: "Madhuban",
    category: "",
    imageUrl: "", // Simple single-string image link input
  });

  // Fetch all administration context data from the server
  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        // Added API.get("/user/all") dynamically alongside your previous responses
        const [productsRes, ordersRes, usersRes] = await Promise.all([
          API.get("/product"),
          API.get("/order/all"),
          API.get("/admin/users").catch(() => ({ data: { users: [] } })), // Graceful fallback if route isn't ready
        ]);

        setProducts(productsRes.data?.products || []);
        setOrders(ordersRes.data?.orders || []);

        // Handle database user structures flexibly
        const totalUsers =
          usersRes.data?.users?.length || usersRes.data?.count || 0;
        setUsersCount(totalUsers);
      } catch (err) {
        console.error(err);
        setError("Administration token missing or access denied.");
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  // Handle new artifact creation submit
  const handleCreateProduct = async (e) => {
    e.preventDefault();
    try {
      const formattedPayload = {
        ...newProduct,
        price: Number(newProduct.price),
        MRP: newProduct.MRP ? Number(newProduct.MRP) : undefined,
        stock: Number(newProduct.stock),
        images: newProduct.imageUrl ? [newProduct.imageUrl] : [],
      };

      const res = await API.post("/product/create", formattedPayload);
      alert("Product introduced to gallery registry!");
      setProducts((prev) => [res.data.product || res.data, ...prev]);

      // Reset input form
      setNewProduct({
        name: "",
        description: "",
        price: "",
        MRP: "",
        stock: "",
        brand: "Madhuban",
        category: "",
        imageUrl: "",
      });
    } catch (err) {
      alert(err.response?.data?.message || "Failed to create catalog entry.");
    }
  };

  // Handle inventory deletion matching database IDs
  const handleDeleteProduct = async (id) => {
    if (
      !window.confirm(
        "Are you sure you want to retire this masterpiece from the system?",
      )
    )
      return;
    try {
      await API.delete(`/product/${id}`);
      setProducts((prev) => prev.filter((p) => p._id !== id));
    } catch (err) {
      alert("Failed to drop entry.");
    }
  };

  // Quick analytics parsing calculated dynamically from available arrays
  const totalRevenue = orders
    .filter(
      (o) => o.paymentStatus === "completed" || o.orderStatus !== "failed",
    )
    .reduce(
      (sum, o) =>
        sum + (o.items?.reduce((s, i) => s + i.price * i.quantity, 0) || 0),
      0,
    );

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-[#FCF9F1]">
        <div className="text-2xl font-serif animate-pulse text-[#B22222]">
          Opening Administration Archives...
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FCF9F1] font-serif py-12 px-6 md:px-12">
      <div className="max-w-7xl mx-auto">
        {/* Header Block Layout */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center border-b-2 border-[#1A1A1A] pb-6 mb-12 gap-4">
          <div>
            <h1 className="text-4xl font-bold uppercase tracking-wider text-[#1A1A1A]">
              Curator Dashboard
            </h1>
            <p className="text-[#666] italic text-sm font-sans mt-1">
              Global administrative ecosystem control deck.
            </p>
          </div>

          {/* Action Tabs Switching Control buttons */}
          <div className="flex gap-2 font-sans text-xs uppercase tracking-widest font-bold">
            <button
              onClick={() => setActiveTab("products")}
              className={`px-4 py-2 border border-[#1A1A1A] transition-colors ${activeTab === "products" ? "bg-[#1A1A1A] text-white" : "bg-transparent text-[#1A1A1A]"}`}
            >
              Exhibition Vault
            </button>
            <button
              onClick={() => setActiveTab("orders")}
              className={`px-4 py-2 border border-[#1A1A1A] transition-colors ${activeTab === "orders" ? "bg-[#1A1A1A] text-white" : "bg-transparent text-[#1A1A1A]"}`}
            >
              Order Invoices ({orders.length})
            </button>
          </div>
        </div>

        {/* --- DYNAMIC METRICS OVERVIEW STRIP (NOW 4 BALANCE COLS) --- */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {/* Card 1: Revenue */}
          <div className="bg-white border-2 border-[#1A1A1A] p-6 shadow-sm">
            <span className="text-xs font-sans uppercase text-[#666] tracking-widest block mb-1">
              Total Revenue
            </span>
            <span className="text-3xl font-bold text-[#B22222]">
              ₹{totalRevenue.toLocaleString("en-IN")}
            </span>
          </div>

          {/* Card 2: Total Products */}
          <div className="bg-white border-2 border-[#1A1A1A] p-6 shadow-sm">
            <span className="text-xs font-sans uppercase text-[#666] tracking-widest block mb-1">
              Total Products
            </span>
            <span className="text-3xl font-bold text-[#1A1A1A]">
              {products.length}{" "}
              <span className="text-sm text-gray-500 font-normal font-sans">
                Items
              </span>
            </span>
          </div>

          {/* Card 3: Total Orders */}
          <div className="bg-white border-2 border-[#1A1A1A] p-6 shadow-sm">
            <span className="text-xs font-sans uppercase text-[#666] tracking-widest block mb-1">
              Total Orders
            </span>
            <span className="text-3xl font-bold text-emerald-800">
              {orders.length}{" "}
              <span className="text-sm text-gray-500 font-normal font-sans">
                Invoices
              </span>
            </span>
          </div>

          {/* Card 4: Total Users */}
          <div className="bg-white border-2 border-[#1A1A1A] p-6 shadow-sm">
            <span className="text-xs font-sans uppercase text-[#666] tracking-widest block mb-1">
              Total Users
            </span>
            <span className="text-3xl font-bold text-indigo-900">
              {usersCount}{" "}
              <span className="text-sm text-gray-500 font-normal font-sans">
                Patrons
              </span>
            </span>
          </div>
        </div>

        {error && (
          <div className="p-4 bg-rose-50 text-[#B22222] border border-rose-200 mb-8 font-sans text-sm">
            {error}
          </div>
        )}

        {/* ================= PRODUCTS TAB VIEW CONTAINER ================= */}
        {activeTab === "products" && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 items-start">
            {/* Left Box: Simple Input Registry Entry Creator Form */}
            <div className="bg-white border-2 border-[#1A1A1A] p-6 sticky top-6 shadow-sm">
              <h2 className="text-xl font-bold uppercase tracking-wide border-b border-[#EEEAE0] pb-3 mb-4">
                Register New Piece
              </h2>
              <form
                onSubmit={handleCreateProduct}
                className="space-y-4 font-sans text-sm"
              >
                <div>
                  <label className="block text-xs uppercase tracking-wider text-[#666] mb-1 font-serif">
                    Artifact Name *
                  </label>
                  <input
                    required
                    type="text"
                    value={newProduct.name}
                    onChange={(e) =>
                      setNewProduct({ ...newProduct, name: e.target.value })
                    }
                    className="w-full p-2 bg-[#FCF9F1] border border-[#1A1A1A] focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs uppercase tracking-wider text-[#666] mb-1 font-serif">
                    Description Narrative *
                  </label>
                  <textarea
                    required
                    rows="3"
                    value={newProduct.description}
                    onChange={(e) =>
                      setNewProduct({
                        ...newProduct,
                        description: e.target.value,
                      })
                    }
                    className="w-full p-2 bg-[#FCF9F1] border border-[#1A1A1A] focus:outline-none resize-none"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs uppercase tracking-wider text-[#666] mb-1 font-serif">
                      Sale Price (₹) *
                    </label>
                    <input
                      required
                      type="number"
                      value={newProduct.price}
                      onChange={(e) =>
                        setNewProduct({ ...newProduct, price: e.target.value })
                      }
                      className="w-full p-2 bg-[#FCF9F1] border border-[#1A1A1A] focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs uppercase tracking-wider text-[#666] mb-1 font-serif">
                      MRP tag (₹)
                    </label>
                    <input
                      type="number"
                      value={newProduct.MRP}
                      onChange={(e) =>
                        setNewProduct({ ...newProduct, MRP: e.target.value })
                      }
                      className="w-full p-2 bg-[#FCF9F1] border border-[#1A1A1A] focus:outline-none"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs uppercase tracking-wider text-[#666] mb-1 font-serif">
                      Initial Stock *
                    </label>
                    <input
                      required
                      type="number"
                      value={newProduct.stock}
                      onChange={(e) =>
                        setNewProduct({ ...newProduct, stock: e.target.value })
                      }
                      className="w-full p-2 bg-[#FCF9F1] border border-[#1A1A1A] focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs uppercase tracking-wider text-[#666] mb-1 font-serif">
                      Category Group *
                    </label>
                    <input
                      required
                      type="text"
                      placeholder="e.g. Wellness"
                      value={newProduct.category}
                      onChange={(e) =>
                        setNewProduct({
                          ...newProduct,
                          category: e.target.value,
                        })
                      }
                      className="w-full p-2 bg-[#FCF9F1] border border-[#1A1A1A] focus:outline-none"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-xs uppercase tracking-wider text-[#666] mb-1 font-serif">
                    Asset Image Resource URL
                  </label>
                  <input
                    type="url"
                    placeholder="https://..."
                    value={newProduct.imageUrl}
                    onChange={(e) =>
                      setNewProduct({ ...newProduct, imageUrl: e.target.value })
                    }
                    className="w-full p-2 bg-[#FCF9F1] border border-[#1A1A1A] focus:outline-none text-xs"
                  />
                </div>
                <button
                  type="submit"
                  className="w-full py-3 bg-[#1A1A1A] text-white font-serif uppercase tracking-widest font-bold hover:bg-[#B22222] transition-colors mt-2 text-xs"
                >
                  Commit Entry to Catalog
                </button>
              </form>
            </div>

            {/* Right Box: Live Interactive Directory Listing Column */}
            <div className="lg:col-span-2 space-y-4">
              <h2 className="text-xl font-bold uppercase tracking-wide mb-4 border-b-2 border-[#1A1A1A] pb-2">
                Active Gallery Collections
              </h2>
              {products.length === 0 ? (
                <p className="text-center italic opacity-40 py-8">
                  Vault collections register blank.
                </p>
              ) : (
                products.map((p) => (
                  <div
                    key={p._id}
                    className="bg-white border border-[#EEEAE0] p-4 flex items-center justify-between gap-4 shadow-sm hover:border-[#1A1A1A] transition-colors"
                  >
                    <div className="flex items-center gap-4 truncate">
                      <img
                        src={p.images?.[0] || "https://via.placeholder.com/80"}
                        alt=""
                        className="w-16 h-16 object-cover border border-[#1A1A1A] flex-shrink-0"
                      />
                      <div className="truncate">
                        <h4 className="font-bold text-lg text-[#1A1A1A] truncate uppercase tracking-wide">
                          {p.name}
                        </h4>
                        <p className="text-xs text-[#666] font-sans">
                          Price:{" "}
                          <span className="font-bold text-[#B22222]">
                            ₹{p.price}
                          </span>{" "}
                          | Stock Available:{" "}
                          <span
                            className={`font-semibold ${p.stock <= 3 ? "text-amber-600 animate-pulse font-bold" : "text-gray-700"}`}
                          >
                            {p.stock} units
                          </span>
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={() => handleDeleteProduct(p._id)}
                      className="px-3 py-1.5 font-sans font-bold text-[10px] text-rose-700 border border-rose-200 uppercase hover:bg-rose-50 rounded transition-colors flex-shrink-0"
                    >
                      Delete
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {/* ================= ORDERS TAB VIEW CONTAINER ================= */}
        {activeTab === "orders" && (
          <div className="space-y-6">
            <h2 className="text-xl font-bold uppercase tracking-wide border-b-2 border-[#1A1A1A] pb-2 mb-4">
              Inbound Customer Deliveries Ledger
            </h2>
            {orders.length === 0 ? (
              <p className="text-center italic opacity-40 py-12 bg-white border border-[#EEEAE0]">
                No sales activities logged across client lines.
              </p>
            ) : (
              <div className="overflow-x-auto border-2 border-[#1A1A1A]">
                <table className="w-full text-left font-sans text-sm bg-white divide-y divide-[#1A1A1A]">
                  <thead className="bg-[#1A1A1A] text-white text-xs uppercase tracking-wider font-serif">
                    <tr>
                      <th className="p-4">Invoice Identifier</th>
                      <th className="p-4">Items Manifest</th>
                      <th className="p-4">Payment Node</th>
                      <th className="p-4 font-serif">Fulfillment State</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#EEEAE0]">
                    {orders.map((o) => (
                      <tr
                        key={o._id}
                        className="hover:bg-[#FDFBF7] transition-colors"
                      >
                        <td className="p-4 align-top font-mono text-xs">
                          {o._id}
                        </td>
                        <td className="p-4 align-top max-w-xs">
                          {o.items?.map((item, idx) => (
                            <div key={idx} className="mb-1 text-xs">
                              <span className="font-semibold text-gray-800">
                                {item.name}
                              </span>{" "}
                              &times; {item.quantity}
                            </div>
                          ))}
                        </td>
                        <td className="p-4 align-top text-xs">
                          <span className="uppercase font-semibold block">
                            {o.paymentMethod}
                          </span>
                          <span className="text-gray-500 italic lowercase block">
                            Status: {o.paymentStatus || "pending"}
                          </span>
                        </td>
                        <td className="p-4 align-top">
                          <span
                            className={`inline-block text-[10px] font-bold uppercase tracking-wide px-2.5 py-0.5 rounded border ${
                              o.orderStatus === "delivered"
                                ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                                : "bg-amber-50 text-amber-700 border-amber-200"
                            }`}
                          >
                            {o.orderStatus || "processing"}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
