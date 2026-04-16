import { useContext, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import API from "../services/api";
import { AuthContext } from "../context/Authcontext";
import { motion } from "framer-motion";
import madpaint from "../assets/madhuban.png";

export default function SignUp() {
  const navigate = useNavigate();
  const { getUser } = useContext(AuthContext);

  const inputs = [
    { label: "Name", type: "text", name: "name", placeholder: "Vikram Thakur" },
    {
      label: "E-mail",
      type: "email",
      name: "email",
      placeholder: "vikram@mithila.com",
    },
    { label: "Phone", type: "text", name: "phone", placeholder: "9988776655" },
    {
      label: "Password",
      type: "password",
      name: "password",
      placeholder: "••••••••",
    },
  ];

  const initialState = inputs.reduce((acc, input) => {
    acc[input.name] = "";
    return acc;
  }, {});

  const [form, setForm] = useState(initialState);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const inputHandler = (e) => {
    const { name, value } = e.target;
    setError("");
    setForm((prev) => ({ ...prev, [name]: value.trimStart() }));
  };

  const submitHandler = async (e) => {
    e.preventDefault();
    if (loading) return;

    // Validation logic remains the same
    if (!form.email || !form.password || !form.phone || !form.name) {
      setError("Every stroke matters. All fields are required.");
      return;
    }
    if (form.password.length < 6) {
      setError("Security must be strong—at least 6 characters.");
      return;
    }
    if (!/^\S+@\S+\.\S+$/.test(form.email)) {
      setError("This E-mail doesn't match our palette.");
      return;
    }
    if (!/^\d{10}$/.test(form.phone)) {
      setError("Provide a valid 10-digit contact number.");
      return;
    }

    try {
      setLoading(true);
      const res = await API.post("/auth/register", form);
      localStorage.setItem("token", res.data.token);
      await getUser();
      setForm(initialState);
      navigate("/");
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FCF9F1] flex items-center justify-center py-12 px-4 sm:px-6 font-serif">
      <div
        className="absolute inset-0 z-0 pointer-events-none transition-opacity duration-1000"
        style={{
          backgroundImage: `url(${madpaint})`,
          backgroundSize: "cover",
          backgroundPosition: "top",
          opacity: 0.85, // Reduced opacity for that premium "watermark" look
        }}
      />
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="max-w-2xl w-full bg-white shadow-2xl relative p-1"
      >
        {/* Intricate Madhubani Outer Frame */}
        <div className="border-[6px] border-[#1A1A1A] p-8 md:p-12 relative">
          {/* Inner Double-Line Red Border */}
          <div className="absolute inset-2 border-2 border-double border-[#B22222] pointer-events-none"></div>

          <div className="text-center mb-10 relative z-10">
            <h2 className="text-4xl font-black text-[#1A1A1A] tracking-tight uppercase border-b-2 border-[#1A1A1A] inline-block pb-1">
              Join the Guild
            </h2>
            <p className="mt-4 text-[#666] italic">
              Register to collect authentic Mithila masterpieces.
            </p>
          </div>

          <form onSubmit={submitHandler} className="relative z-10">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {inputs.map((item, i) => (
                <div key={i} className="relative">
                  <label className="block text-[10px] font-bold uppercase tracking-[0.2em] text-[#B22222] mb-1">
                    {item.label}
                  </label>
                  <input
                    required
                    autoFocus={i === 0}
                    type={item.type}
                    name={item.name}
                    placeholder={item.placeholder}
                    value={form[item.name]}
                    onChange={inputHandler}
                    className="w-full bg-transparent border-b-2 border-[#1A1A1A] py-2 outline-none focus:border-[#B22222] transition-colors placeholder:opacity-30 text-[#1A1A1A]"
                  />
                </div>
              ))}
            </div>

            {error && (
              <motion.div
                initial={{ x: -10 }}
                animate={{ x: 0 }}
                className="mt-6 text-center text-[#B22222] font-bold text-sm bg-[#B22222]/5 py-2 border border-[#B22222]/20"
              >
                {error}
              </motion.div>
            )}

            <div className="mt-12 flex flex-col items-center">
              <button
                type="submit"
                disabled={loading}
                className="w-full md:w-64 py-4 bg-[#1A1A1A] text-white font-bold uppercase tracking-widest hover:bg-[#B22222] transition-all duration-500 shadow-xl active:scale-95"
              >
                {loading ? "Inscribing..." : "Create Account"}
              </button>

              <p className="mt-6 text-sm text-gray-500">
                Already part of the tradition?{" "}
                <Link
                  to="/login"
                  className="text-[#1A1A1A] font-bold border-b border-[#1A1A1A] hover:text-[#B22222] hover:border-[#B22222] transition-all"
                >
                  Sign In
                </Link>
              </p>
            </div>
          </form>

          {/* Decorative Corner Motif (Mocking a Fish - symbol of Mithila) */}
          <div className="absolute bottom-2 right-2 opacity-10 pointer-events-none w-16 h-16">
            <svg viewBox="0 0 100 100" className="fill-[#1A1A1A]">
              <path d="M10,50 Q40,10 90,50 Q40,90 10,50 Z M30,50 A5,5 0 1,0 31,50 Z" />
              <path d="M90,50 L110,30 L110,70 Z" />
            </svg>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
