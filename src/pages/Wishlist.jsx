import React, { useEffect, useState } from "react";
import API from "../services/api";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";

export default function Wishlist() {
  const [wishlist, setWishlist] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  // Fetch wishlist from backend
  useEffect(() => {
    const fetchWishlist = async () => {
      try {
        setLoading(true);
        const res = await API.get("/wishlist");
        // Populating the products array from your DB structure
        setWishlist(res.data?.wishlist?.products || []);
      } catch (err) {
        console.error(err);
        setError(
          err.response?.data?.message || "Failed to curate your wishlist.",
        );
      } finally {
        setLoading(false);
      }
    };

    fetchWishlist();
  }, []);

  // Remove item handler
  const handleRemoveFromWishlist = async (productId, e) => {
    e.stopPropagation(); // Prevents clicking the button from trigger-navigating to the product details page
    try {
      // Optimistically update the UI instantly for a snappy feel
      setWishlist((prev) => prev.filter((item) => item._id !== productId));

      // Make the actual API call (adjust endpoint depending on your backend routing)
      await API.delete(`/wishlist/remove/${productId}`);
    } catch (err) {
      alert(err.response?.data?.message || "Failed to remove item.");
      // If backend fails, fetch the original database array state back
      const res = await API.get("/wishlist");
      setWishlist(res.data?.wishlist?.products || []);
    }
  };

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-[#FCF9F1]">
        <div className="text-2xl font-serif animate-pulse text-[#B22222]">
          Opening your private lookbook...
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FCF9F1] font-serif py-20 px-6 md:px-12">
      <div className="max-w-6xl mx-auto">
        {/* Header Section */}
        <div className="text-center mb-16">
          <h1 className="text-4xl text-[#1A1A1A] uppercase tracking-[0.2em]">
            Your Curated Favorites
          </h1>
          <div className="h-1 w-20 mx-auto bg-[#B22222] mt-2"></div>
          <p className="text-[#666] italic mt-4">
            A personalized catalog of modern cultural artifacts.
          </p>
        </div>

        {error && (
          <div className="text-center text-[#B22222] bg-rose-50 border border-rose-200 p-4 mb-8 max-w-xl mx-auto">
            {error}
          </div>
        )}

        {/* Empty State */}
        {wishlist.length === 0 ? (
          <div className="text-center py-20 border border-[#EEEAE0] bg-white max-w-2xl mx-auto p-8 shadow-sm">
            <h2 className="text-2xl italic text-[#666] mb-2">
              Your wishlist is pristine.
            </h2>
            <p className="text-sm font-sans text-[#888] mb-6">
              Explore the main collections to add items you love.
            </p>
            <button
              onClick={() => navigate("/")}
              className="px-6 py-3 bg-[#1A1A1A] text-[#FCF9F1] text-xs uppercase tracking-widest font-sans hover:bg-[#B22222] transition-all duration-300"
            >
              Return to Gallery Exhibition
            </button>
          </div>
        ) : (
          /* Wishlist Grid Display */
          <motion.div
            layout
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10"
          >
            <AnimatePresence>
              {wishlist.map((item) => (
                <motion.div
                  key={item._id}
                  layout
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, y: 20 }}
                  onClick={() => navigate(`/product/${item._id}`)}
                  className="group cursor-pointer bg-white p-4 border border-[#EEEAE0] hover:shadow-xl transition-all duration-500 flex flex-col justify-between relative"
                >
                  {/* Remove Button Cross icon */}
                  <button
                    onClick={(e) => handleRemoveFromWishlist(item._id, e)}
                    className="absolute top-6 right-6 z-10 bg-white/80 backdrop-blur-sm p-2 rounded-full border border-[#EEEAE0] text-[#666] hover:text-[#B22222] hover:border-[#B22222] transition-colors"
                    title="Remove from wishlist"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-4 w-4"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                  </button>

                  <div>
                    {/* Artwork Container Frame */}
                    <div className="relative overflow-hidden border-4 border-[#1A1A1A] p-1 mb-4 aspect-square bg-[#FDFBF7]">
                      <img
                        src={
                          item.images?.[0] || "https://via.placeholder.com/400"
                        }
                        alt={item.name}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                      />
                    </div>

                    {/* Metadata Content */}
                    <div className="text-center px-2">
                      <span className="text-[10px] uppercase font-sans tracking-widest text-[#B22222] block mb-1">
                        {item.brand || "Madhuban Original"}
                      </span>
                      <h2 className="text-xl font-bold text-[#1A1A1A] mb-1 uppercase tracking-wide truncate">
                        {item.name}
                      </h2>
                      <p className="text-[#666] text-sm italic mb-4 line-clamp-2">
                        {item.description}
                      </p>
                    </div>
                  </div>

                  {/* Pricing / Stock Status row */}
                  <div className="pt-4 border-t border-[#EEEAE0] flex justify-between items-center px-2 mt-auto">
                    <div className="flex flex-col">
                      <span className="text-lg font-bold text-[#1A1A1A]">
                        ₹{item.price}
                      </span>
                      {item.MRP && item.MRP > item.price && (
                        <span className="text-xs text-[#888] line-through font-sans">
                          ₹{item.MRP}
                        </span>
                      )}
                    </div>

                    <span
                      className={`text-[10px] uppercase font-sans tracking-wider font-bold ${item.stock > 0 ? "text-emerald-700" : "text-[#B22222]"}`}
                    >
                      {item.stock > 0 ? "Available" : "Out of Stock"}
                    </span>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        )}
      </div>
    </div>
  );
}
