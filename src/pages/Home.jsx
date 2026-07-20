import React, { useEffect, useState } from "react";
import API from "../services/api";
import { motion } from "framer-motion";
import { useNavigate, useSearchParams } from "react-router-dom";
import HeroArt from "../assets/hero.png";

export default function Home() {
  const [addingId, setAddingId] = useState(null);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  // Read URL search parameters
  const [searchParams, setSearchParams] = useSearchParams();
  const search = searchParams.get("search") || "";
  const sort = searchParams.get("sort") || "newest";
  const category = searchParams.get("category") || "";
  const minPrice = searchParams.get("minPrice") || "";
  const maxPrice = searchParams.get("maxPrice") || "";

  useEffect(() => {
    const fetchFilteredProducts = async () => {
      try {
        setLoading(true);
        setError("");

        // Build request query dynamically
        const queryParams = new URLSearchParams();
        if (search) queryParams.append("search", search);
        if (sort) queryParams.append("sort", sort);
        if (category) queryParams.append("category", category);
        if (minPrice) queryParams.append("minPrice", minPrice);
        if (maxPrice) queryParams.append("maxPrice", maxPrice);

        // API Endpoint route matches backend router definition: GET /product/search
        const res = await API.get(`/product/search?${queryParams.toString()}`);
        setProducts(res.data.product || []);
      } catch (err) {
        if (err.response?.status === 404) {
          setProducts([]);
        } else {
          setError(err.response?.data?.message || "Error fetching products");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchFilteredProducts();
  }, [search, sort, category, minPrice, maxPrice]);

  const handleParamChange = (key, value) => {
    const newParams = new URLSearchParams(searchParams);
    if (value) {
      newParams.set(key, value);
    } else {
      newParams.delete(key);
    }
    setSearchParams(newParams);
  };

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

  return (
    <div className="min-h-screen bg-[#FCF9F1] font-serif">
      {/* Hero Section */}
      <section className="relative w-full border-b-4 border-[#1A1A1A] bg-[#FCF9F1]">
        <div
          className="w-full aspect-video md:aspect-[21/9] lg:aspect-[16/7]"
          style={{
            backgroundImage: `url(${HeroArt})`,
            backgroundSize: "contain",
            backgroundPosition: "center",
            backgroundRepeat: "no-repeat",
          }}
        />
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

      <div className="py-12 px-8 max-w-7xl mx-auto">
        <div className="text-center mb-10">
          <h2 className="text-4xl text-[#1A1A1A] uppercase tracking-[0.2em]">
            The Exhibition
          </h2>
          <div className="h-1 w-20 mx-auto bg-[#B22222] mt-2"></div>
        </div>

        {/* --- FILTER & SORT CONTROLS BAR --- */}
        <div className="flex flex-wrap items-center justify-between gap-4 mb-10 p-4 border border-[#1A1A1A] bg-white">
          {/* Category Filter */}
          <div className="flex items-center gap-2">
            <label className="text-sm font-bold uppercase">Category:</label>
            <select
              value={category}
              onChange={(e) => handleParamChange("category", e.target.value)}
              className="border border-[#1A1A1A] p-1 text-sm bg-[#FCF9F1] focus:outline-none"
            >
              <option value="">All Artforms</option>
              <option value="Painting">Painting</option>
              <option value="Saree">Saree</option>
              <option value="Textile">Textile</option>
            </select>
          </div>

          {/* Sort Selector */}
          <div className="flex items-center gap-2">
            <label className="text-sm font-bold uppercase">Sort By:</label>
            <select
              value={sort}
              onChange={(e) => handleParamChange("sort", e.target.value)}
              className="border border-[#1A1A1A] p-1 text-sm bg-[#FCF9F1] focus:outline-none"
            >
              <option value="newest">Newest Arrivals</option>
              <option value="price_asc">Price: Low to High</option>
              <option value="price_desc">Price: High to Low</option>
              <option value="rating">Top Rated</option>
            </select>
          </div>

          {/* Reset Filters */}
          {(search ||
            category ||
            minPrice ||
            maxPrice ||
            sort !== "newest") && (
            <button
              onClick={() => setSearchParams({})}
              className="text-xs text-[#B22222] underline font-bold uppercase"
            >
              Clear All Filters
            </button>
          )}
        </div>

        {/* Product Grid */}
        {loading ? (
          <div className="text-center py-20 text-xl font-serif text-[#B22222] animate-pulse">
            Loading masterpieces...
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-12">
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
        )}

        {!loading && products.length === 0 && (
          <div className="text-center py-20">
            <h2 className="text-2xl italic opacity-50">
              No masterpieces matched your criteria.
            </h2>
          </div>
        )}
      </div>
    </div>
  );
}
