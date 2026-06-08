import React, { useEffect, useState } from "react";
import API from "../services/api";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

export default function Account() {
  const navigate = useNavigate();
  const [profile, setProfile] = useState(null);
  const [stats, setStats] = useState({ ordersCount: 0, wishlistCount: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // New States for Profile Editing
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({ name: "", email: "" });
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    const fetchAccountData = async () => {
      try {
        setLoading(true);

        const [profileRes, ordersRes, wishlistRes] = await Promise.all([
          API.get("/auth/user"),
          API.get("/order/my"),
          API.get("/wishlist"),
        ]);

        const userData = profileRes.data?.user || profileRes.data;
        setProfile(userData);

        // Initialize editing form values
        setEditForm({
          name: userData?.name || "",
          email: userData?.email || "",
        });

        const ordersArray = ordersRes.data?.orders || ordersRes.data || [];
        const wishlistArray = wishlistRes.data?.wishlist?.products || [];

        setStats({
          ordersCount: ordersArray.length,
          wishlistCount: wishlistArray.length,
        });
      } catch (err) {
        console.error(err);
        setError(
          err.response?.data?.message || "Failed to load account profile.",
        );
      } finally {
        setLoading(false);
      }
    };

    fetchAccountData();
  }, []);

  // Update profile logic
  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    try {
      setUpdating(true);
      //   alert("! are you sure");
      // Assuming your backend put route is PUT /api/user/update
      const res = await API.put("/auth/update", editForm);

      // Update local view profile state with response records
      const updatedUser = res.data?.user || res.data;
      setProfile(updatedUser);
      setIsEditing(false);
      alert("Profile modifications committed successfully!");
    } catch (err) {
      alert(err.response?.data?.message || "Failed to update profile records.");
    } finally {
      setUpdating(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-[#FCF9F1]">
        <div className="text-2xl font-serif animate-pulse text-[#B22222]">
          Opening your profile profile...
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FCF9F1] font-serif py-20 px-6 md:px-12">
      <div className="max-w-5xl mx-auto">
        {/* Header Block */}
        <div className="text-center mb-16">
          <h1 className="text-4xl text-[#1A1A1A] uppercase tracking-[0.2em]">
            My Account
          </h1>
          <div className="h-1 w-20 mx-auto bg-[#B22222] mt-2"></div>
        </div>

        {error && (
          <div className="text-center text-[#B22222] bg-rose-50 border border-rose-200 p-4 mb-8 max-w-xl mx-auto font-sans text-sm">
            {error}
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 items-start">
          {/* ================= LEFT COLUMN: PROFILE CARD ================= */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white border-2 border-[#1A1A1A] p-6 text-center shadow-sm"
          >
            {/* Avatar Placeholder Frame */}
            <div className="w-24 h-24 bg-[#FCF9F1] border-2 border-[#1A1A1A] rounded-full mx-auto flex items-center justify-center mb-4">
              <span className="text-3xl font-bold text-[#B22222] uppercase">
                {profile?.name ? profile.name[0] : "U"}
              </span>
            </div>

            {/* Conditionally Render static display or edit fields */}
            {!isEditing ? (
              <>
                <h2 className="text-2xl font-bold text-[#1A1A1A] uppercase tracking-wide truncate">
                  {profile?.name || "Patron of Art"}
                </h2>
                <p className="text-sm font-sans text-[#666] truncate mb-6">
                  {profile?.email || "user@example.com"}
                </p>

                <button
                  onClick={() => setIsEditing(true)}
                  className="w-full py-2 border border-[#1A1A1A] text-[#1A1A1A] text-xs uppercase tracking-widest font-sans mb-3 hover:bg-[#1A1A1A] hover:text-white transition-colors"
                >
                  Edit Profile Fields
                </button>
              </>
            ) : (
              <form
                onSubmit={handleUpdateProfile}
                className="space-y-3 text-left font-sans text-xs mb-4"
              >
                <div>
                  <label className="block text-[#666] uppercase tracking-wider mb-1 font-serif">
                    Full Name
                  </label>
                  <input
                    required
                    type="text"
                    value={editForm.name}
                    onChange={(e) =>
                      setEditForm({ ...editForm, name: e.target.value })
                    }
                    className="w-full p-2 bg-[#FCF9F1] border border-[#1A1A1A] font-medium text-sm text-[#1A1A1A] focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-[#666] uppercase tracking-wider mb-1 font-serif">
                    Email Address
                  </label>
                  <input
                    required
                    type="email"
                    value={editForm.email}
                    onChange={(e) =>
                      setEditForm({ ...editForm, email: e.target.value })
                    }
                    className="w-full p-2 bg-[#FCF9F1] border border-[#1A1A1A] font-medium text-sm text-[#1A1A1A] focus:outline-none"
                  />
                </div>

                <div className="flex gap-2 pt-2">
                  <button
                    type="submit"
                    disabled={updating}
                    className="flex-1 py-2 bg-[#1A1A1A] text-white uppercase tracking-wider font-bold hover:bg-[#B22222] transition-colors disabled:opacity-50"
                  >
                    {updating ? "Saving..." : "Save"}
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setIsEditing(false);
                      setEditForm({
                        name: profile?.name || "",
                        email: profile?.email || "",
                      });
                    }}
                    className="flex-1 py-2 border border-gray-300 text-gray-600 uppercase tracking-wider hover:bg-gray-50 transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            )}

            <div className="border-t border-[#EEEAE0] pt-4">
              <button
                onClick={handleLogout}
                className="w-full py-2.5 border border-[#B22222] text-[#B22222] text-xs uppercase tracking-widest font-sans font-bold hover:bg-[#B22222] hover:text-white transition-colors duration-300"
              >
                Sign Out / Exit
              </button>
            </div>
          </motion.div>

          {/* ================= RIGHT COLUMN: DASHBOARD PANELS ================= */}
          <div className="md:col-span-2 space-y-8">
            {/* Analytics Stats Counter Strip */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <motion.div
                whileHover={{ y: -4 }}
                onClick={() => navigate("/orders")}
                className="bg-white border border-[#EEEAE0] p-6 cursor-pointer hover:border-[#1A1A1A] transition-colors flex justify-between items-center shadow-sm"
              >
                <div>
                  <span className="text-xs uppercase font-sans tracking-wider text-[#666] block mb-1">
                    Acquired Pieces
                  </span>
                  <span className="text-3xl font-bold text-[#1A1A1A]">
                    {stats.ordersCount} Orders
                  </span>
                </div>
                <div className="text-[#B22222] text-xl">&rarr;</div>
              </motion.div>

              <motion.div
                whileHover={{ y: -4 }}
                onClick={() => navigate("/wishlist")}
                className="bg-white border border-[#EEEAE0] p-6 cursor-pointer hover:border-[#1A1A1A] transition-colors flex justify-between items-center shadow-sm"
              >
                <div>
                  <span className="text-xs uppercase font-sans tracking-wider text-[#666] block mb-1">
                    Curated Catalog
                  </span>
                  <span className="text-3xl font-bold text-[#B22222]">
                    {stats.wishlistCount} Favorites
                  </span>
                </div>
                <div className="text-[#1A1A1A] text-xl">&rarr;</div>
              </motion.div>
            </div>

            {/* Quick Menu Settings Options Box */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-white border border-[#EEEAE0] p-6 shadow-sm"
            >
              <h3 className="text-lg font-bold uppercase tracking-wide border-b border-[#EEEAE0] pb-3 mb-4 text-[#1A1A1A]">
                Gallery Settings & Shortcuts
              </h3>

              <ul className="divide-y divide-[#EEEAE0] font-sans text-sm text-[#444]">
                <li
                  onClick={() => navigate("/")}
                  className="py-3.5 flex justify-between items-center cursor-pointer hover:text-[#B22222] transition-colors"
                >
                  <span className="font-serif italic text-base">
                    Browse Main Collections Exhibition
                  </span>
                  <span className="text-xs tracking-widest text-[#888]">
                    EXPLORE &rarr;
                  </span>
                </li>
                <li
                  onClick={() => navigate("/cart")}
                  className="py-3.5 flex justify-between items-center cursor-pointer hover:text-[#B22222] transition-colors"
                >
                  <span className="font-serif italic text-base">
                    View Active Exhibition Shopping Cart
                  </span>
                  <span className="text-xs tracking-widest text-[#888]">
                    CHECK OUT &rarr;
                  </span>
                </li>
                {profile?.role === "admin" && (
                  <li
                    onClick={() => navigate("/admin")}
                    className="py-3.5 flex justify-between items-center cursor-pointer hover:text-[#B22222] transition-colors bg-amber-50/40 px-2 -mx-2"
                  >
                    <span className="font-serif font-bold text-amber-900 uppercase tracking-wide text-xs">
                      ⚠️ Access Administrative Curator Console
                    </span>
                    <span className="text-xs tracking-widest text-amber-700 font-bold">
                      MANAGE &rarr;
                    </span>
                  </li>
                )}
              </ul>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}
