import React, { useEffect, useState } from "react";
import API from "../services/api";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
// Import your hero image here
import HeroArt from "../assets/hero.png";
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

  return (
    <div className="min-h-screen bg-[#FCF9F1] font-serif">
      {/* --- HERO SECTION START --- */}
      <section className="relative w-full border-b-4 border-[#1A1A1A] bg-[#FCF9F1]">
        {/* We use a responsive wrapper. 
      'aspect-video' (16:9) usually matches hero illustrations.
      If your image is a different shape, use 'aspect-[your-width/your-height]' 
  */}
        <div
          className="w-full aspect-video md:aspect-[21/9] lg:aspect-[16/7]"
          style={{
            backgroundImage: `url(${HeroArt})`,
            backgroundSize: "contain" /* Ensures the FULL image is visible */,
            backgroundPosition: "center" /* Keeps it centered */,
            backgroundRepeat: "no-repeat" /* Prevents tiling */,
          }}
        />

        {/* Optional: If you still want the mission text but don't want it 
      to cover the art, you can place it below the image:
  */}
        <div className="bg-[#FCF9F1] py-10 px-6 text-center">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            className="max-w-4xl mx-auto"
          >
            <h1 className="text-5xl md:text-7xl font-bold tracking-tighter text-[#1A1A1A] mb-4">
              MADHUBAN<span className="text-[#B22222]">.</span>
            </h1>
            <p className="text-lg md:text-xl text-[#333] leading-relaxed italic max-w-2xl mx-auto">
              "Bringing Indian artforms and clothing together so that our rich
              culture and traditional arts never vanish, but come to light for
              the modern world."
            </p>
          </motion.div>
        </div>
      </section>

      <div className="py-20 px-8">
        {/* Section Title */}
        <div className="text-center mb-16">
          <h2 className="text-4xl text-[#1A1A1A] uppercase tracking-[0.2em]">
            The Exhibition
          </h2>
          <div className="h-1 w-20 mx-auto bg-[#B22222] mt-2"></div>
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
              <div className="relative overflow-hidden border-4 border-[#1A1A1A] p-1 mb-6 aspect-square bg-[#FDFBF7]">
                <img
                  src={item.images?.[0] || "https://via.placeholder.com/400"}
                  alt={item.name}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-[#B22222] opacity-0 group-hover:opacity-10 transition-opacity"></div>
              </div>

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
                    className="px-4 py-2 border border-[#B22222] text-[#B22222] font-bold text-xs uppercase tracking-widest hover:bg-[#B22222] hover:text-white transition-all duration-300"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleAddToCart(item._id);
                    }}
                    disabled={addingId === item._id}
                  >
                    {addingId === item._id ? "Adding..." : "Add to Cart"}
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {products.length === 0 && !error && (
          <div className="text-center py-20">
            <h2 className="text-2xl italic opacity-50">
              The gallery is currently empty.
            </h2>
          </div>
        )}
      </div>
    </div>
  );
}
