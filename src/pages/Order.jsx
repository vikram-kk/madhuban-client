import React, { useEffect, useState } from "react";
import API from "../services/api";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

export default function Order() {
  const [orderList, setOrderList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const getMyOrders = async () => {
      try {
        setLoading(true);
        const res = await API.get("/order/my");
        setOrderList(res.data?.orders || res.data || []);
      } catch (err) {
        console.error(err);
        setError(
          err.response?.data?.message || "Failed to load exhibition history.",
        );
      } finally {
        setLoading(false);
      }
    };

    getMyOrders();
  }, []);

  // Helper utility to style status text beautifully
  const getStatusStyle = (status) => {
    switch (status?.toLowerCase()) {
      case "delivered":
        return "bg-emerald-100 text-emerald-800 border-emerald-300";
      case "processing":
      case "pending":
        return "bg-amber-100 text-amber-800 border-amber-300";
      case "failed":
        return "bg-rose-100 text-rose-800 border-rose-300";
      default:
        return "bg-gray-100 text-gray-800 border-gray-300";
    }
  };

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-[#FCF9F1]">
        <div className="text-2xl font-serif animate-pulse text-[#B22222]">
          Retrieving Purchase Chronicles...
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FCF9F1] font-serif py-20 px-6 md:px-12">
      <div className="max-w-5xl mx-auto">
        {/* Header Section */}
        <div className="text-center mb-16">
          <h1 className="text-4xl text-[#1A1A1A] uppercase tracking-[0.2em]">
            Your Collection History
          </h1>
          <div className="h-1 w-20 mx-auto bg-[#B22222] mt-2"></div>
          <p className="text-[#666] italic mt-4">
            A record of acquired cultural artifacts and premium apparel.
          </p>
        </div>

        {error && (
          <div className="text-center text-[#B22222] bg-rose-50 border border-rose-200 p-4 mb-8">
            {error}
          </div>
        )}

        {/* Empty State */}
        {orderList.length === 0 ? (
          <div className="text-center py-20 border-2 border-dashed border-[#EEEAE0]">
            <h2 className="text-2xl italic text-[#666] mb-6">
              No historical orders found.
            </h2>
            <button
              onClick={() => navigate("/")}
              className="px-6 py-3 bg-[#1A1A1A] text-[#FCF9F1] text-xs uppercase tracking-widest font-sans hover:bg-[#B22222] transition-colors duration-300"
            >
              Explore the Exhibition
            </button>
          </div>
        ) : (
          /* Orders List Loop */
          <div className="space-y-12">
            {orderList.map((order, orderIndex) => {
              // Calculate overall dynamic order cost summation cleanly
              const orderTotal =
                order.items?.reduce(
                  (sum, item) => sum + item.price * item.quantity,
                  0,
                ) || 0;

              return (
                <motion.div
                  key={order._id || orderIndex}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: orderIndex * 0.05 }}
                  className="bg-white border-2 border-[#1A1A1A] shadow-sm hover:shadow-md transition-shadow"
                >
                  {/* Order Metadata Strip Header */}
                  <div className="bg-[#1A1A1A] text-[#FCF9F1] p-4 flex flex-wrap justify-between items-center gap-4 text-xs font-sans uppercase tracking-wider">
                    <div>
                      <span className="opacity-60 block font-serif lowercase italic text-[10px]">
                        Order Identifier
                      </span>
                      <span className="font-mono">
                        {order._id || `ORD-${orderIndex}`}
                      </span>
                    </div>

                    <div className="flex gap-6">
                      <div className="text-center md:text-right">
                        <span className="opacity-60 block font-serif lowercase italic text-[10px]">
                          Payment Route
                        </span>
                        <span className="font-semibold">
                          {order.paymentMethod || "N/A"}
                        </span>
                      </div>
                      <div className="text-center md:text-right">
                        <span className="opacity-60 block font-serif lowercase italic text-[10px]">
                          Transaction Status
                        </span>
                        <span className="font-semibold text-amber-300">
                          {order.paymentStatus || "pending"}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Nested Purchased Artifacts Grid Items Loop */}
                  <div className="divide-y divide-[#EEEAE0] px-6">
                    {order.items?.map((item, itemIndex) => (
                      <div
                        key={item._id || itemIndex}
                        className="py-6 flex flex-col sm:flex-row items-center justify-between gap-6"
                      >
                        <div className="flex items-center gap-6 w-full sm:w-auto">
                          {/* Item Artwork Frame Display */}
                          <div className="w-20 h-20 flex-shrink-0 border-2 border-[#1A1A1A] p-0.5 bg-[#FDFBF7]">
                            <img
                              src={
                                item.image || "https://via.placeholder.com/150"
                              }
                              alt={item.name}
                              className="w-full h-full object-cover"
                            />
                          </div>

                          {/* Item Details */}
                          <div>
                            <h3
                              onClick={() =>
                                item.product &&
                                navigate(`/product/${item.product}`)
                              }
                              className="text-lg font-bold text-[#1A1A1A] uppercase tracking-wide cursor-pointer hover:text-[#B22222] transition-colors"
                            >
                              {item.name || "Traditional Artwork Piece"}
                            </h3>
                            <p className="text-sm font-sans text-[#666] mt-1">
                              Price: ₹{item.price} &times; {item.quantity}
                            </p>
                          </div>
                        </div>

                        {/* Calculated Single Item Row Sum */}
                        <div className="text-right font-sans font-bold text-lg text-[#1A1A1A] w-full sm:w-auto border-t sm:border-t-0 pt-4 sm:pt-0 border-[#EEEAE0]">
                          ₹{item.price * item.quantity}
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Summary/Footer Section of Order Box */}
                  <div className="bg-[#FDFBF7] border-t-2 border-[#1A1A1A] p-6 flex flex-col sm:flex-row justify-between items-center gap-4">
                    {/* Status Pill Badge */}
                    <div className="flex items-center gap-2">
                      <span className="text-xs uppercase tracking-widest text-[#666]">
                        Dispatch Status:
                      </span>
                      <span
                        className={`text-xs uppercase font-sans font-bold px-3 py-1 border tracking-wider ${getStatusStyle(order.orderStatus)}`}
                      >
                        {order.orderStatus || "Processing"}
                      </span>
                    </div>

                    {/* Final Grand Value Metric */}
                    <div className="text-right">
                      <span className="text-xs uppercase tracking-widest text-[#666] mr-2">
                        Total Paid:
                      </span>
                      <span className="text-2xl font-bold text-[#B22222]">
                        ₹{orderTotal}
                      </span>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
