import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import API from "../services/api";
import { motion } from "framer-motion";

export default function ProductPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [adding, setAdding] = useState(false);
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    const fetchProductDetails = async () => {
      try {
        setLoading(true);
        const res = await API.get(`/product/${id}`);
        setProduct(res.data.product || res.data);
      } catch (err) {
        setError(
          err.response?.data?.message || "Failed to load product details.",
        );
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchProductDetails();
  }, [id]);

  const handleAddToCart = async () => {
    try {
      setAdding(true);
      await API.post("/cart/add", { productId: id, quantity });
      alert("Added to cart successfully!");
    } catch (err) {
      alert(err.response?.data?.message || "Failed to add to cart");
    } finally {
      setAdding(false);
    }
  };

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-[#FCF9F1]">
        <div className="text-2xl font-serif animate-pulse text-[#B22222]">
          Unveiling the Masterpiece...
        </div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="flex flex-col h-screen items-center justify-center bg-[#FCF9F1] font-serif gap-4">
        <div className="text-xl text-[#B22222]">
          {error || "Product not found"}
        </div>
        <button
          onClick={() => navigate("/")}
          className="px-6 py-2 border border-[#1A1A1A] uppercase tracking-wider text-sm hover:bg-[#1A1A1A] hover:text-white transition-all"
        >
          Back to Exhibition
        </button>
      </div>
    );
  }

  // Check if stock is available
  const isOutOfStock = product.stock <= 0;

  return (
    <div className="min-h-screen bg-[#FCF9F1] font-serif py-20 px-6 md:px-12">
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12 items-start">
        {/* Left: Product Image Layout */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="relative border-4 border-[#1A1A1A] p-2 bg-[#FDFBF7] shadow-lg"
        >
          {/* Tag for Category */}
          {product.category && (
            <span className="absolute top-4 left-4 bg-[#1A1A1A] text-[#FCF9F1] text-xs uppercase tracking-widest px-3 py-1 font-sans">
              {product.category}
            </span>
          )}

          {/* Tag for Discount */}
          {product.discount > 0 && (
            <span className="absolute top-4 right-4 bg-[#B22222] text-white text-xs font-bold uppercase tracking-widest px-3 py-1 font-sans">
              {product.discount}% OFF
            </span>
          )}

          <img
            src={product.images?.[0] || "https://via.placeholder.com/600"}
            alt={product.name}
            className="w-full h-auto object-cover max-h-[600px]"
          />
        </motion.div>

        {/* Right: Product Details Layout */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="flex flex-col"
        >
          {/* Breadcrumb */}
          <button
            onClick={() => navigate("/")}
            className="text-xs uppercase tracking-widest text-[#666] hover:text-[#B22222] text-left mb-6 transition-colors"
          >
            &larr; Back to Exhibition
          </button>

          <h1 className="text-4xl md:text-5xl font-bold text-[#1A1A1A] uppercase tracking-wide mb-2">
            {product.name}
          </h1>

          {/* Ratings & Reviews Display */}
          <div className="flex items-center gap-3 mb-4 font-sans text-sm text-[#555]">
            <div className="flex text-[#B22222]">
              {"★".repeat(Math.round(product.ratings || 0))}
              {"☆".repeat(5 - Math.round(product.ratings || 0))}
            </div>
            <span>({product.numReviews || 0} Gallery Reviews)</span>
          </div>

          <div className="h-[2px] w-16 bg-[#B22222] mb-6"></div>

          {/* Dynamic Price Area */}
          <div className="flex items-baseline gap-4 mb-6">
            <span className="text-4xl font-bold text-[#B22222]">
              ₹{product.price}
            </span>
            {product.MRP && product.MRP > product.price && (
              <span className="text-xl text-[#888] line-through font-sans">
                ₹{product.MRP}
              </span>
            )}
          </div>

          {/* Stock Notification */}
          <div className="mb-6 font-sans text-sm">
            {isOutOfStock ? (
              <span className="text-[#B22222] font-bold uppercase tracking-wider">
                Out of Stock / Restocking Soon
              </span>
            ) : product.stock <= 5 ? (
              <span className="text-amber-700 font-bold animate-pulse">
                Hurry! Only {product.stock} pieces left in exhibition.
              </span>
            ) : (
              <span className="text-emerald-700 font-semibold">
                ✓ In Stock Available
              </span>
            )}
          </div>

          <p className="text-[#333] text-lg leading-relaxed mb-8 italic border-l-2 border-[#B22222] pl-4">
            {product.description}
          </p>

          {/* Quantity Selector & Add to Cart button */}
          {!isOutOfStock && (
            <div className="flex items-center gap-4 mb-6 font-sans">
              <label className="text-sm uppercase tracking-wider font-serif text-[#1A1A1A]">
                Qty:
              </label>
              <select
                value={quantity}
                onChange={(e) => setQuantity(Number(e.target.value))}
                className="border-2 border-[#1A1A1A] bg-transparent p-2 text-md font-bold focus:outline-none"
              >
                {[...Array(Math.min(product.stock, 10)).keys()].map((x) => (
                  <option key={x + 1} value={x + 1}>
                    {x + 1}
                  </option>
                ))}
              </select>
            </div>
          )}

          <button
            onClick={handleAddToCart}
            disabled={adding || isOutOfStock}
            className="w-full md:w-auto px-8 py-4 border-2 border-[#1A1A1A] font-bold uppercase tracking-widest text-sm transition-all duration-300 disabled:opacity-40 disabled:cursor-not-allowed bg-[#1A1A1A] text-[#FCF9F1] hover:bg-transparent hover:text-[#1A1A1A]"
          >
            {isOutOfStock
              ? "Sold Out"
              : adding
                ? "Adding to Cart..."
                : "Add to Exhibition Cart"}
          </button>
        </motion.div>
      </div>
    </div>
  );
}
