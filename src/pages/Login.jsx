import { useContext, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import API from "../services/api";
import { AuthContext } from "../context/Authcontext";
import madpaint from "../assets/madhuban.png"; // Your Asset
import { motion } from "framer-motion";

export default function Login() {
  const navigate = useNavigate();
  const { getUser } = useContext(AuthContext);

  const inputs = [
    {
      label: "E-mail",
      type: "email",
      name: "email",
      placeholder: "vikram@mithila.com",
    },
    {
      label: "Password",
      type: "password",
      name: "password",
      placeholder: "••••••••",
      // ui improvemnt
    },
  ];

  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const inputHandler = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const submitHandler = async (e) => {
    e.preventDefault();
    if (loading) return;
    try {
      setLoading(true);
      const res = await API.post("/auth/login", form);
      localStorage.setItem("token", res.data.token);
      await getUser();
      navigate("/");
    } catch (err) {
      setError(err.response?.data?.message || "Invalid credentials.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center py-12 px-4 font-serif relative overflow-hidden bg-[#FCF9F1]">
      {/* BACKGROUND IMAGE LAYER */}
      <div
        className="absolute inset-0 z-0 pointer-events-none transition-opacity duration-1000"
        style={{
          backgroundImage: `url(${madpaint})`,
          backgroundSize: "cover",
          backgroundPosition: "top",
          opacity: 0.85, // Reduced opacity for that premium "watermark" look
        }}
      />

      {/* OPTIONAL: MITHILA GEOMETRIC OVERLAY */}
      <div className="absolute top-0 right-0 w-96 h-96 opacity-5 pointer-events-none rotate-12">
        <svg viewBox="0 0 100 100" className="text-[#1A1A1A] fill-current">
          <circle
            cx="50"
            cy="50"
            r="40"
            fill="none"
            stroke="currentColor"
            strokeWidth="0.5"
            strokeDasharray="4 2"
          />
          {[...Array(24)].map((_, i) => (
            <line
              key={i}
              x1="50"
              y1="50"
              x2={50 + 45 * Math.cos((i * 15 * Math.PI) / 180)}
              y2={50 + 45 * Math.sin((i * 15 * Math.PI) / 180)}
              stroke="currentColor"
              strokeWidth="0.2"
            />
          ))}
        </svg>
      </div>

      {/* LOGIN CARD */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="max-w-md w-full z-10 bg-white/90 backdrop-blur-sm p-10 shadow-[0_20px_50px_rgba(0,0,0,0.1)] border-4 border-[#1A1A1A] relative"
      >
        {/* Madhubani Double Border */}
        <div className="absolute inset-2 border-2 border-double border-[#B22222] pointer-events-none"></div>
        <div className="text-center relative ">
          <h2 className="text-4xl font-black text-[#1A1A1A] tracking-tighter uppercase">
            Gallery Login
          </h2>
          <div className="h-0.5 w-12 bg-[#B22222] mx-auto mt-2"></div>
        </div>

        <form className="mt-8 space-y-6" onSubmit={submitHandler}>
          <div className="space-y-5">
            {inputs.map((item, i) => (
              <div key={i}>
                <label className="block text-[10px] font-bold uppercase tracking-[0.2em] text-[#B22222] mb-1">
                  {item.label}
                </label>
                <input
                  type={item.type}
                  name={item.name}
                  value={form[item.name]}
                  onChange={inputHandler}
                  required
                  placeholder={item.placeholder}
                  className="w-full px-0 py-3 bg-transparent border-b-2 border-[#E5E7EB] text-[#1A1A1A] focus:outline-none focus:border-[#B22222] transition-all placeholder:text-gray-300"
                />
              </div>
            ))}
          </div>

          {error && (
            <p className="text-[#B22222] text-xs text-center italic">{error}</p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-4 bg-[#1A1A1A] text-white font-bold uppercase tracking-[0.3em] hover:bg-[#B22222] transition-all duration-500 shadow-lg active:translate-y-1"
          >
            {loading ? "Verifying..." : "Enter Portal"}
          </button>

          <div className="text-center mt-6">
            <Link
              to="/signup"
              className="text-xs font-bold text-gray-500 hover:text-[#B22222] transition-colors uppercase tracking-widest"
            >
              Create an Account
            </Link>
          </div>
        </form>
      </motion.div>
    </div>
  );
}
