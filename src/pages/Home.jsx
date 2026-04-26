import React, { useEffect, useState } from "react";
import API from "../services/api";
import { motion } from "framer-motion"; // Highly recommended for that "premium" feel
import { useNavigate } from "react-router-dom";

export default function Home() {
  const [addingId, setAddingId] = useState(null);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  useEffect(() => {
    const getProducts = async () => {
      try {
        setLoading(true);
        const res = await API.get("/product");
        setProducts(res.data.products || []);
      } catch (error) {
        setError(error.response?.data?.message || "Error fetching products");
      } finally {
        setLoading(false);
      }
    };
    getProducts();
  }, []);

  const handleAddToCart = async (id) => {
    try {
      setAddingId(id);
      await API.post("/cart/add", { productId: id, quantity: 1 });
      alert("Added to cart");
    } catch (error) {
      alert(error.response?.data?.message || "Failed to add to cart");
    } finally {
      setAddingId(null);
    }
  };

  if (loading)
    return (
      <div className="flex h-screen items-center justify-center bg-[#FCF9F1]">
        <div className="text-2xl font-serif animate-pulse text-[#B22222]">
          Opening the Gallery...
        </div>
      </div>
    );

  if (error)
    return (
      <div className="flex h-screen items-center justify-center bg-[#FCF9F1]">
        <div className="text-xl font-serif text-[#B22222] border-2 border-[#B22222] p-4">
          {error}
        </div>
      </div>
    );

  return (
    <div className="min-h-screen bg-[#FCF9F1] font-serif py-16 px-8">
      {/* Page Header */}
      <div className="text-center mb-16">
        <h1 className="text-6xl text-[#1A1A1A] mb-4">Featured Artworks</h1>
        <div className="h-1 w-32 mx-auto bg-[#B22222]"></div>
      </div>

      {/* Product Grid */}
      <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-12">
        {products.map((item) => (
          <motion.div
            onClick={() => navigate(`/product/${item._id}`)}
            key={item._id}
            whileHover={{ y: -10 }}
            className="group cursor-pointer bg-white p-4 border border-[#EEEAE0] shadow-sm hover:shadow-2xl transition-all duration-500"
          >
            {/* Image Container with Madhubani-style double border */}
            <div className="relative overflow-hidden border-4 border-[#1A1A1A] p-1 mb-6 aspect-square bg-[#FDFBF7]">
              <img
                src={item.images?.[0] || "https://via.placeholder.com/400"}
                alt={item.name}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-[#B22222] opacity-0 group-hover:opacity-10 transition-opacity"></div>
            </div>

            {/* Product Details */}
            <div className="text-center">
              <h2 className="text-2xl font-bold text-[#1A1A1A] mb-2 uppercase tracking-wide">
                {item.name}
              </h2>
              <p className="text-[#666] italic mb-4 line-clamp-2 px-4">
                {item.description}
              </p>
              <div className="flex justify-between items-center px-4 pt-4 border-t border-[#EEEAE0]">
                <span className="text-xl font-bold text-[#B22222]">
                  ₹{item.price}
                </span>

                <button
                  className="px-3 py-1 border border-[#B22222] text-[#B22222] hover:bg-[#B22222] hover:text-white transition-all duration-300"
                  onClick={(e) => {
                    e.stopPropagation(); // 🔥 THIS IS IMPORTANT
                    handleAddToCart(item._id);
                  }}
                  disabled={addingId === item._id}
                >
                  {addingId === item._id ? "Adding..." : "Add to Cart"}
                </button>
                {/* <button
                  
                  className="text-xs font-bold tracking-[0.2em] uppercase text-[#1A1A1A] hover:text-[#B22222] transition-colors"
                >
                  View Details
                </button> */}
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {products.length === 0 && (
        <div className="text-center py-20">
          <h2 className="text-2xl italic opacity-50">
            The gallery is currently empty.
          </h2>
        </div>
      )}
    </div>
  );
}
