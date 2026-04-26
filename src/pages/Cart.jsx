import { useEffect, useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import API from "../services/api";
import madpaintsec from "../assets/madhuban2-edited.png";
import { motion, AnimatePresence } from "framer-motion"; // For premium smooth transitions

export default function Cart() {
  const [cart, setCart] = useState([]);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState(null);
  const navigate = useNavigate();

  const total = useMemo(() => {
    return cart.reduce(
      (acc, item) => acc + item.product.price * item.quantity,
      0,
    );
  }, [cart]);

  useEffect(() => {
    getCart();
  }, []);

  const getCart = async () => {
    try {
      setLoading(true);
      const res = await API.get("/cart");
      setCart(res.data.cart.items || []);
    } catch (error) {
      setErr(error.response?.data?.message || "Error fetching your collection");
    } finally {
      setLoading(false);
    }
  };

  const handleRemove = async (id) => {
    try {
      setCart(cart.filter((item) => item.product._id !== id));
      await API.delete("/cart/remove", { data: { productId: id } });
    } catch (error) {
      getCart();
    }
  };

  const handleQuantity = async (id, opp, currQty) => {
    let newQty = opp === "add" ? currQty + 1 : currQty - 1;
    if (newQty < 1) return;

    setCart(
      cart.map((item) =>
        item.product._id === id ? { ...item, quantity: newQty } : item,
      ),
    );

    try {
      await API.patch("/cart/update", { productId: id, quantity: newQty });
    } catch (err) {
      getCart();
    }
  };

  const handleCheckOut = async () => {
    try {
      await API.post("/order/place");
      alert("Your masterpiece has been reserved! 🎉");
      navigate("/orders");
    } catch (err) {
      console.error(err);
    }
  };

  if (loading)
    return (
      <div className="flex h-screen items-center justify-center bg-[#FCF9F1]">
        <div className="text-2xl font-serif animate-pulse text-[#B22222]">
          Preparing your Gallery...
        </div>
      </div>
    );

  return (
    <div className="min-h-screen bg-[#FCF9F1] text-[#1A1A1A] font-serif py-12 px-6 pb-18 ">
      <div
        className="mt-14 absolute inset-0 z-0 pointer-events-none transition-opacity duration-1000"
        style={{
          backgroundImage: `url(${madpaintsec})`,
          backgroundSize: "cover",
          backgroundPosition: "top",
          opacity: 0.85, // Reduced opacity for that premium "watermark" look
        }}
      />
      <div className="max-w-4xl mx-auto bg">
        {/* Decorative Madhubani Header */}
        <div className="text-center mb-12 ">
          <h1 className="text-5xl mb-2 tracking-tight text-[#1A1A1A] drop-shadow-md ">
            Your Collection
          </h1>
          <div className="h-1 w-48 mx-auto bg-[#B22222] border-y border-[#1A1A1A] drop-shadow-md"></div>
        </div>

        {err && <div className="text-center text-[#B22222] mb-4">{err}</div>}

        {cart.length === 0 ? (
          <div className="text-center py-20 border-2 border-dashed border-[#DAA520]">
            <h2 className="text-2xl italic opacity-70">The canvas is blank.</h2>
            <button
              onClick={() => navigate("/")}
              className="mt-6 px-8 py-3 bg-[#1A1A1A] text-white hover:bg-[#B22222] transition-colors"
            >
              Explore Artworks
            </button>
          </div>
        ) : (
          <div className="bg-white border-t-8 border-[#DAA520] shadow-2xl p-8 rounded-sm relative overflow-hidden">
            {/* Background Texture Overlay */}
            <div className="absolute inset-0 opacity-5 pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/handmade-paper.png')]"></div>

            <AnimatePresence>
              {cart.map((item) => (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, x: -100 }}
                  key={item.product._id}
                  className="flex flex-col md:flex-row items-center gap-6 py-8 border-b-2 border-double border-[#EEEAE0]"
                >
                  {/* Product Image with Madhubani Border */}
                  <div className="w-32 h-32 border-4 border-[#1A1A1A] p-1 bg-white flex-shrink-0">
                    <img
                      src={
                        item.product.image || "https://via.placeholder.com/150"
                      }
                      alt={item.product.name}
                      className="w-full h-full object-cover grayscale-[20%] hover:grayscale-0 transition-all"
                    />
                  </div>

                  <div className="flex-grow text-center md:text-left">
                    <h3 className="text-2xl font-bold mb-1">
                      {item.product.name}
                    </h3>
                    <p className="text-[#666] italic mb-4 text-sm">
                      {item.product.description}
                    </p>
                    <button
                      onClick={() => handleRemove(item.product._id)}
                      className="text-xs uppercase tracking-widest text-[#B22222] font-bold hover:underline "
                    >
                      Remove from Cart
                    </button>
                  </div>
                  {/* ui improvemnt */}

                  <div className="flex flex-col items-center gap-4">
                    <h2 className="text-2xl">₹{item.product.price}</h2>
                    <div className="flex items-center border-2 border-[#1A1A1A]">
                      <button
                        className="px-4 py-1 hover:bg-[#FCF9F1]"
                        onClick={() =>
                          handleQuantity(item.product._id, "sub", item.quantity)
                        }
                      >
                        {" "}
                        -{" "}
                      </button>
                      <span className="px-6 font-bold border-x-2 border-[#1A1A1A]">
                        {item.quantity}
                      </span>
                      <button
                        className="px-4 py-1 hover:bg-[#FCF9F1]"
                        onClick={() =>
                          handleQuantity(item.product._id, "add", item.quantity)
                        }
                      >
                        {" "}
                        +{" "}
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>

            {/* Footer Summary */}
            <div className="mt-12 flex flex-col md:flex-row justify-between items-center bg-[#FDFBF7] p-6 border-2 border-[#1A1A1A]">
              <div>
                <span className="text-sm uppercase tracking-[0.2em] opacity-60">
                  Total Value
                </span>
                <h2 className="text-4xl font-bold text-[#1A1A1A]">₹{total}</h2>
              </div>

              <button
                onClick={handleCheckOut}
                className="mt-6 md:mt-0 px-12 py-4 bg-[#B22222] text-white text-lg tracking-widest hover:bg-[#1A1A1A] transition-all duration-500 shadow-xl"
              >
                FINALIZE ORDER
              </button>
            </div>
          </div>
        )}
      </div>
      <div class="custom-shape-divider-bottom-1777212824">
        <svg
          data-name="Layer 1"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 1200 120"
          preserveAspectRatio="none"
        >
          <path
            d="M0,0V46.29c47.79,22.2,103.59,32.17,158,28,70.36-5.37,136.33-33.31,206.8-37.5C438.64,32.43,512.34,53.67,583,72.05c69.27,18,138.3,24.88,209.4,13.08,36.15-6,69.85-17.84,104.45-29.34C989.49,25,1113-14.29,1200,52.47V0Z"
            opacity=".25"
            class="shape-fill"
          ></path>
          <path
            d="M0,0V15.81C13,36.92,27.64,56.86,47.69,72.05,99.41,111.27,165,111,224.58,91.58c31.15-10.15,60.09-26.07,89.67-39.8,40.92-19,84.73-46,130.83-49.67,36.26-2.85,70.9,9.42,98.6,31.56,31.77,25.39,62.32,62,103.63,73,40.44,10.79,81.35-6.69,119.13-24.28s75.16-39,116.92-43.05c59.73-5.85,113.28,22.88,168.9,38.84,30.2,8.66,59,6.17,87.09-7.5,22.43-10.89,48-26.93,60.65-49.24V0Z"
            opacity=".5"
            class="shape-fill"
          ></path>
          <path
            d="M0,0V5.63C149.93,59,314.09,71.32,475.83,42.57c43-7.64,84.23-20.12,127.61-26.46,59-8.63,112.48,12.24,165.56,35.4C827.93,77.22,886,95.24,951.2,90c86.53-7,172.46-45.71,248.8-84.81V0Z"
            class="shape-fill"
          ></path>
        </svg>
      </div>
    </div>
  );
}
