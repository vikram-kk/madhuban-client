import React, { useEffect, useState } from "react";
import API from "../services/api";
import adminService from "../services/admin.service.js"; // Import our new services layer
import { motion, AnimatePresence } from "framer-motion";

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState("products"); // tabs: 'products' | 'orders' | 'users'
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Editing modal local state holders
  const [editingProduct, setEditingProduct] = useState(null);

  // Creation Form State
  const [newProduct, setNewProduct] = useState({
    name: "",
    description: "",
    price: "",
    MRP: "",
    stock: "",
    brand: "Madhuban",
    category: "",
    imageUrl: "",
  });

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const [productsRes, ordersRes] = await Promise.all([
        API.get("/product"),
        API.get("/order/all"),
      ]);
      setProducts(productsRes.data?.products || []);
      setOrders(ordersRes.data?.orders || []);

      // Fetch users using our clean administration service layer
      const usersData = await adminService.getAllUsers().catch(() => []);
      setUsers(usersData);
    } catch (err) {
      console.error(err);
      setError("Administration token missing or access denied.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  // Handle creating a product
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

  // Handle updating an existing product's fields via modal submit
  const handleUpdateProductSubmit = async (e) => {
    e.preventDefault();
    try {
      const updated = await adminService.updateProduct(editingProduct._id, {
        ...editingProduct,
        price: Number(editingProduct.price),
        MRP: editingProduct.MRP ? Number(editingProduct.MRP) : undefined,
        stock: Number(editingProduct.stock),
        images: editingProduct.imageUrl
          ? [editingProduct.imageUrl]
          : editingProduct.images,
      });
      alert("Masterpiece specifications updated!");
      setProducts((prev) =>
        prev.map((p) => (p._id === editingProduct._id ? updated : p)),
      );
      setEditingProduct(null);
    } catch (err) {
      alert("Failed to save product alterations.");
    }
  };

  // Handle product deletion
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

  // Handle moving status steps for a placement order invoice dynamically
  const handleStatusChange = async (orderId, targetField, targetValue) => {
    try {
      const updatedOrder = await adminService.updateOrderStatus(orderId, {
        [targetField]: targetValue,
      });
      setOrders((prev) =>
        prev.map((o) => (o._id === orderId ? { ...o, ...updatedOrder } : o)),
      );
    } catch (err) {
      alert("Failed to alter invoice configuration parameters.");
    }
  };

  // Handle database user removal
  const handleDeleteUser = async (userId) => {
    if (
      !window.confirm(
        "Revoke gallery entrance rights and drop this patron data profile?",
      )
    )
      return;
    try {
      await adminService.deleteUser(userId);
      setUsers((prev) => prev.filter((u) => u._id !== userId));
    } catch (err) {
      alert("Failed to eliminate profile node.");
    }
  };

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
    <div className="min-h-screen bg-[#FCF9F1] font-serif py-12 px-6 md:px-12 relative">
      <div className="max-w-7xl mx-auto">
        {/* Header Block Layout */}
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center border-b-2 border-[#1A1A1A] pb-6 mb-12 gap-4">
          <div>
            <h1 className="text-4xl font-bold uppercase tracking-wider text-[#1A1A1A]">
              Curator Dashboard
            </h1>
            <p className="text-[#666] italic text-sm font-sans mt-1">
              Global administrative ecosystem control deck.
            </p>
          </div>

          {/* Action Tabs Switching Control buttons */}
          <div className="flex flex-wrap gap-2 font-sans text-xs uppercase tracking-widest font-bold">
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
            <button
              onClick={() => setActiveTab("users")}
              className={`px-4 py-2 border border-[#1A1A1A] transition-colors ${activeTab === "users" ? "bg-[#1A1A1A] text-white" : "bg-transparent text-[#1A1A1A]"}`}
            >
              Patrons Directory ({users.length})
            </button>
          </div>
        </div>

        {/* --- DYNAMIC METRICS OVERVIEW STRIP --- */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          <div className="bg-white border-2 border-[#1A1A1A] p-6 shadow-sm">
            <span className="text-xs font-sans uppercase text-[#666] tracking-widest block mb-1">
              Total Revenue
            </span>
            <span className="text-3xl font-bold text-[#B22222]">
              ₹{totalRevenue.toLocaleString("en-IN")}
            </span>
          </div>
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
          <div className="bg-white border-2 border-[#1A1A1A] p-6 shadow-sm">
            <span className="text-xs font-sans uppercase text-[#666] tracking-widest block mb-1">
              Total Users
            </span>
            <span className="text-3xl font-bold text-indigo-900">
              {users.length}{" "}
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
            {/* Input Form Box Container */}
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
                      placeholder="e.g. Clothes"
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

            {/* Catalog List display block section */}
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

                    <div className="flex gap-2 flex-shrink-0">
                      <button
                        onClick={() =>
                          setEditingProduct({
                            ...p,
                            imageUrl: p.images?.[0] || "",
                          })
                        }
                        className="px-3 py-1.5 font-sans font-bold text-[10px] text-gray-700 border border-gray-300 uppercase hover:bg-gray-50 rounded transition-colors"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDeleteProduct(p._id)}
                        className="px-3 py-1.5 font-sans font-bold text-[10px] text-rose-700 border border-rose-200 uppercase hover:bg-rose-50 rounded transition-colors"
                      >
                        Delete
                      </button>
                    </div>
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
                      <th className="p-4">Payment Node / Action</th>
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
                        <td className="p-4 align-top text-xs space-y-2">
                          <div>
                            <span className="uppercase font-semibold block">
                              {o.paymentMethod}
                            </span>
                            <span className="text-gray-500 italic lowercase block">
                              Status: {o.paymentStatus || "pending"}
                            </span>
                          </div>

                          {/* Live interactive drop selector modifier for structural Payment State tracking */}
                          <select
                            value={o.paymentStatus || "pending"}
                            onChange={(e) =>
                              handleStatusChange(
                                o._id,
                                "paymentStatus",
                                e.target.value,
                              )
                            }
                            className="p-1 border border-gray-300 bg-white font-sans text-[11px] focus:outline-none"
                          >
                            <option value="pending">Pending</option>
                            <option value="completed">Completed</option>
                            <option value="failed">Failed</option>
                          </select>
                        </td>
                        <td className="p-4 align-top space-y-2">
                          <span
                            className={`inline-block text-[10px] font-bold uppercase tracking-wide px-2.5 py-0.5 rounded border ${o.orderStatus === "delivered" ? "bg-emerald-50 text-emerald-700 border-emerald-200" : "bg-amber-50 text-amber-700 border-amber-200"}`}
                          >
                            {o.orderStatus || "processing"}
                          </span>

                          {/* Live interactive selector modifier for structural Delivery Tracking state steps */}
                          <select
                            value={o.orderStatus || "processing"}
                            onChange={(e) =>
                              handleStatusChange(
                                o._id,
                                "orderStatus",
                                e.target.value,
                              )
                            }
                            className="block p-1 border border-gray-300 bg-white font-sans text-[11px] focus:outline-none"
                          >
                            <option value="processing">Processing</option>
                            <option value="shipped">Shipped</option>
                            <option value="delivered">Delivered</option>
                            <option value="cancelled">Cancelled</option>
                          </select>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* ================= PATRONS (USERS) TAB VIEW CONTAINER ================= */}
        {activeTab === "users" && (
          <div className="space-y-6">
            <h2 className="text-xl font-bold uppercase tracking-wide border-b-2 border-[#1A1A1A] pb-2 mb-4">
              Registered Patron Records Directory
            </h2>
            {users.length === 0 ? (
              <p className="text-center italic opacity-40 py-12 bg-white border border-[#EEEAE0]">
                No consumer nodes resolved across directory lines.
              </p>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {users.map((u) => (
                  <div
                    key={u._id}
                    className="bg-white border border-[#EEEAE0] p-6 shadow-sm hover:border-[#1A1A1A] transition-colors relative flex flex-col justify-between"
                  >
                    <div>
                      <span
                        className={`text-[9px] uppercase tracking-widest font-sans font-bold px-2 py-0.5 rounded border inline-block mb-3 ${u.role === "admin" ? "bg-amber-50 text-amber-800 border-amber-200" : "bg-gray-50 text-gray-700 border-gray-200"}`}
                      >
                        {u.role || "user"}
                      </span>
                      <h3 className="text-lg font-bold text-[#1A1A1A] uppercase tracking-wide truncate">
                        {u.name}
                      </h3>
                      <p className="text-xs font-sans text-[#666] truncate mt-0.5">
                        {u.email}
                      </p>
                    </div>

                    <div className="border-t border-[#EEEAE0] mt-4 pt-3 flex justify-between items-center">
                      <span className="font-mono text-[9px] text-gray-400">
                        ID: {u._id}
                      </span>
                      {u.role !== "admin" && (
                        <button
                          onClick={() => handleDeleteUser(u._id)}
                          className="text-xs font-sans font-bold uppercase tracking-wide text-rose-700 hover:underline"
                        >
                          Revoke Access
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* ================= DYNAMIC PRODUCT ALTERATION MODAL POPUP LAYER ================= */}
      <AnimatePresence>
        {editingProduct && (
          <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 30 }}
              className="bg-white border-4 border-[#1A1A1A] p-6 max-w-md w-full max-h-[90vh] overflow-y-auto shadow-2xl"
            >
              <div className="flex justify-between items-center border-b border-[#EEEAE0] pb-3 mb-4">
                <h3 className="text-xl font-bold uppercase tracking-wide text-[#1A1A1A]">
                  Edit Masterpiece
                </h3>
                <button
                  onClick={() => setEditingProduct(null)}
                  className="text-2xl font-bold hover:text-[#B22222] focus:outline-none"
                >
                  &times;
                </button>
              </div>

              <form
                onSubmit={handleUpdateProductSubmit}
                className="space-y-4 font-sans text-sm"
              >
                <div>
                  <label className="block text-xs uppercase tracking-wider text-[#666] mb-1 font-serif">
                    Artifact Name
                  </label>
                  <input
                    required
                    type="text"
                    value={editingProduct.name}
                    onChange={(e) =>
                      setEditingProduct({
                        ...editingProduct,
                        name: e.target.value,
                      })
                    }
                    className="w-full p-2 bg-[#FCF9F1] border border-[#1A1A1A] focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs uppercase tracking-wider text-[#666] mb-1 font-serif">
                    Description Narrative
                  </label>
                  <textarea
                    required
                    rows="3"
                    value={editingProduct.description}
                    onChange={(e) =>
                      setEditingProduct({
                        ...editingProduct,
                        description: e.target.value,
                      })
                    }
                    className="w-full p-2 bg-[#FCF9F1] border border-[#1A1A1A] focus:outline-none resize-none"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs uppercase tracking-wider text-[#666] mb-1 font-serif">
                      Sale Price (₹)
                    </label>
                    <input
                      required
                      type="number"
                      value={editingProduct.price}
                      onChange={(e) =>
                        setEditingProduct({
                          ...editingProduct,
                          price: e.target.value,
                        })
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
                      value={editingProduct.MRP || ""}
                      onChange={(e) =>
                        setEditingProduct({
                          ...editingProduct,
                          MRP: e.target.value,
                        })
                      }
                      className="w-full p-2 bg-[#FCF9F1] border border-[#1A1A1A] focus:outline-none"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs uppercase tracking-wider text-[#666] mb-1 font-serif">
                      Stock Units
                    </label>
                    <input
                      required
                      type="number"
                      value={editingProduct.stock}
                      onChange={(e) =>
                        setEditingProduct({
                          ...editingProduct,
                          stock: e.target.value,
                        })
                      }
                      className="w-full p-2 bg-[#FCF9F1] border border-[#1A1A1A] focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs uppercase tracking-wider text-[#666] mb-1 font-serif">
                      Category
                    </label>
                    <input
                      required
                      type="text"
                      value={editingProduct.category}
                      onChange={(e) =>
                        setEditingProduct({
                          ...editingProduct,
                          category: e.target.value,
                        })
                      }
                      className="w-full p-2 bg-[#FCF9F1] border border-[#1A1A1A] focus:outline-none"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-xs uppercase tracking-wider text-[#666] mb-1 font-serif">
                    Asset Image Link URL
                  </label>
                  <input
                    type="url"
                    value={editingProduct.imageUrl || ""}
                    onChange={(e) =>
                      setEditingProduct({
                        ...editingProduct,
                        imageUrl: e.target.value,
                      })
                    }
                    className="w-full p-2 bg-[#FCF9F1] border border-[#1A1A1A] focus:outline-none text-xs"
                  />
                </div>

                <div className="flex gap-2 pt-2">
                  <button
                    type="submit"
                    className="flex-1 py-3 bg-[#1A1A1A] text-white font-serif uppercase tracking-widest font-bold hover:bg-[#B22222] transition-colors text-xs"
                  >
                    Save Alterations
                  </button>
                  <button
                    type="button"
                    onClick={() => setEditingProduct(null)}
                    className="flex-1 py-3 border border-gray-300 text-gray-700 font-serif uppercase tracking-widest text-xs hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
