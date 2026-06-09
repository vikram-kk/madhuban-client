import React, { useEffect, useState } from "react";
import API from "../services/api";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

export default function Address() {
  const navigate = useNavigate();
  const [address, setAddress] = useState(null);
  const [loading, setLoading] = useState(true);
  const [locations, setLocations] = useState([]);
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);
  const [change, setChange] = useState(false);

  // Structural subfields exactly mimicking your Order address payload parameters
  const [addressForm, setAddressForm] = useState({
    fullName: "",
    street: "",
    city: "",
    state: "",
    pincode: "",
    country: "India",
    phone: "",
  });

  // fetch all addresss
  useEffect(() => {
    const fetchAlladdresses = async () => {
      try {
        const res = await API.get("/address");
        const userLocations = res.data?.locations;
        if (userLocations.length !== 0) {
          setLocations(userLocations);
        }
      } catch (error) {}
    };
    fetchAlladdresses();
  }, [loading, locations, change]);
  // Fetch current address data context from backend profile on component mount
  useEffect(() => {
    const fetchCurrentAddress = async () => {
      try {
        setLoading(true);
        const res = await API.get("/auth/user");
        const userAddress = res.data?.user?.address || res.data?.address;

        if (userAddress) {
          setAddress(userAddress);
          setAddressForm({
            street: userAddress.street || "",
            city: userAddress.city || "",
            state: userAddress.state || "",
            zipCode: userAddress.zipCode || "",
            country: userAddress.country || "India",
            phone: userAddress.phone || "",
          });
        }
      } catch (err) {
        console.error(err);
        setError("Failed to synchronize with your profile directory.");
      } finally {
        setLoading(false);
      }
    };

    fetchCurrentAddress();
  }, []);

  // Handle saving/updating the delivery metadata mapping inside database
  const handleSaveAddress = async (e) => {
    e.preventDefault();
    try {
      setSaving(true);
      // Calls your dynamic user configuration updater with your specific layout object
      const res = await API.post("/address", {
        addressForm,
      });

      const updatedUser = res.data?.user || res.data;
      setAddress(updatedUser.address);
      alert(
        "Fulfillment destination committed to ledger registries successfully!",
      );
    } catch (err) {
      alert(
        err.response?.data?.message || "Failed to commit delivery variables.",
      );
    } finally {
      setSaving(false);
    }
  };

  const setAsPrimary = async () => {
    try {
      setChange(true);
      const res = await API.put("/auth/update");
      const user = res.data?.user;
      console.log(res.data);

      setChange(false);
    } catch (error) {
      return;
    }
  };

  // Optional clear utility to reset parameters inside user schemas
  const handleClearAddress = async () => {
    if (
      !window.confirm(
        "Are you sure you want to remove this destination framework?",
      )
    )
      return;
    try {
      setSaving(true);
      const res = await API.put("/user/update", { address: null });
      setAddress(null);
      setAddressForm({
        street: "",
        city: "",
        state: "",
        pincode: "",
        country: "India",
        phone: "",
      });
      alert("Destination records cleared.");
    } catch (err) {
      alert("Failed to clear directory parameter nodes.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-[#FCF9F1]">
        <div className="text-2xl font-serif animate-pulse text-[#B22222]">
          Opening Delivery Archives...
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FCF9F1] font-serif py-20 px-6 md:px-12">
      <div className="max-w-5xl mx-auto">
        {/* Navigation Breadcrumb & Header Box */}
        <div className="mb-12">
          <button
            onClick={() => navigate("/account")}
            className="text-xs uppercase tracking-widest text-[#666] hover:text-[#B22222] transition-colors mb-4 block"
          >
            &larr; Return to Profile Account
          </button>
          <h1 className="text-4xl text-[#1A1A1A] uppercase tracking-[0.2em]">
            Fulfillment Destination
          </h1>
          <div className="h-1 w-20 bg-[#B22222] mt-2"></div>
          <p className="text-[#666] italic font-sans text-sm mt-3">
            Configure your premium shipping coordinates for art dispatches.
          </p>
        </div>

        {error && (
          <div className="p-4 bg-rose-50 text-[#B22222] border border-rose-200 mb-8 font-sans text-sm">
            {error}
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-5 gap-12 items-start">
          {/* ================= LEFT COLUMN: CURRENT ADDRESS CARD ================= */}
          <div className="md:col-span-2 space-y-6">
            <h2 className="text-xl font-bold uppercase tracking-wide border-b border-[#EEEAE0] pb-2 text-[#1A1A1A]">
              Registered Registry
            </h2>

            {!address ? (
              <div className="bg-white border-2 border-dashed border-[#EEEAE0] p-8 text-center italic text-[#888] text-sm">
                No active dispatch coordinates mapped. Complete the registry
                template to proceed.
              </div>
            ) : (
              <motion.div
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-white border-2 border-[#1A1A1A] p-6 shadow-sm relative flex flex-col justify-between min-h-[220px]"
              >
                <div>
                  <div className="flex justify-between items-start mb-4">
                    <span className="text-[10px] bg-[#1A1A1A] text-white px-2.5 py-0.5 uppercase tracking-widest font-sans font-semibold">
                      Primary Address
                    </span>
                  </div>

                  {/* Human-readable formatted fields output layout block */}
                  <p className="text-lg font-bold text-[#1A1A1A] tracking-wide mb-2 uppercase">
                    {address.street}
                  </p>
                  <p className="text-base text-[#444] italic mb-1">
                    {address.city}, {address.state} — {address.pincode}
                  </p>
                  <p className="text-sm text-[#666] font-sans tracking-wide mb-4">
                    {address.country}
                  </p>

                  <p className="text-xs font-sans text-[#666] border-t border-[#EEEAE0] pt-3">
                    <span className="font-serif italic text-gray-500 font-semibold mr-1">
                      Contact Phone:
                    </span>{" "}
                    {address.phone}
                  </p>
                </div>

                <button
                  disabled={saving}
                  onClick={handleClearAddress}
                  className="mt-6 text-left text-xs uppercase tracking-widest font-sans font-bold text-[#B22222] hover:underline"
                >
                  Remove Address Coordinates
                </button>
              </motion.div>
            )}
            {locations.length !== 0 ? (
              <div className="border p-2">
                {locations.map((location) => (
                  <div>
                    {/* <div className="flex justify-between items-start mb-4"></div> */}

                    {/* Human-readable formatted fields output layout block */}
                    <p className="text-lg font-bold text-[#1A1A1A] tracking-wide mb-1 uppercase">
                      {location.street}
                    </p>
                    <p className="text-base text-[#444] italic mb-1">
                      {location.city}, {location.state} — {location.pincode}
                    </p>
                    <p className="text-sm text-[#666] font-sans tracking-wide mb-1">
                      {location.country}
                    </p>
                    <div className="flex justify-between">
                      <p className="text-xs font-sans text-[#666] border-t border-[#EEEAE0] pt-3">
                        <span className="font-serif italic text-gray-500 font-semibold mr-1">
                          Contact Phone:
                        </span>{" "}
                        {location.phone}
                      </p>
                      <button
                        onClick={setAsPrimary}
                        className={
                          change
                            ? "text-xs text-white font-sans font-bold bg-[#691515] border-t border-[#EEEAE0] mt-2 p-1 rounded "
                            : "text-xs text-white font-sans font-bold bg-[#B22222] border-t border-[#EEEAE0] mt-2 p-1 rounded hover:bg-[#ca2828]"
                        }
                      >
                        {change ? "Saving...." : "Set as Primary"}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              ""
            )}
          </div>

          {/* ================= RIGHT COLUMN: ADDRESS RECONSTRUCTION INPUT FORM ================= */}
          <div className="md:col-span-3 space-y-6">
            <h2 className="text-xl font-bold uppercase tracking-wide border-b border-[#EEEAE0] pb-2 text-[#1A1A1A]">
              Modify Coordinates
            </h2>

            <form
              onSubmit={handleSaveAddress}
              className="bg-white border-2 border-[#1A1A1A] p-6 font-sans text-sm space-y-4 shadow-sm"
            >
              <div>
                <label className="block text-xs uppercase tracking-wider text-[#666] mb-1 font-serif">
                  Full Name*
                </label>
                <input
                  required
                  type="text"
                  value={addressForm.fullName}
                  onChange={(e) =>
                    setAddressForm({ ...addressForm, fullName: e.target.value })
                  }
                  placeholder="e.g., Vikram Thakur"
                  className="w-full p-2.5 bg-[#FCF9F1] border border-[#1A1A1A] focus:outline-none text-base font-serif"
                />
                <label className="block text-xs uppercase tracking-wider text-[#666] mb-1 font-serif">
                  Street / Apartment / Locality *
                </label>
                <input
                  required
                  type="text"
                  value={addressForm.street}
                  onChange={(e) =>
                    setAddressForm({ ...addressForm, street: e.target.value })
                  }
                  placeholder="e.g., 45, Gallery Lane, Near Central Museum"
                  className="w-full p-2.5 bg-[#FCF9F1] border border-[#1A1A1A] focus:outline-none text-base font-serif"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs uppercase tracking-wider text-[#666] mb-1 font-serif">
                    City *
                  </label>
                  <input
                    required
                    type="text"
                    value={addressForm.city}
                    onChange={(e) =>
                      setAddressForm({ ...addressForm, city: e.target.value })
                    }
                    placeholder="e.g., New Delhi"
                    className="w-full p-2.5 bg-[#FCF9F1] border border-[#1A1A1A] focus:outline-none text-sm font-medium"
                  />
                </div>
                <div>
                  <label className="block text-xs uppercase tracking-wider text-[#666] mb-1 font-serif">
                    State / Region *
                  </label>
                  <input
                    required
                    type="text"
                    value={addressForm.state}
                    onChange={(e) =>
                      setAddressForm({ ...addressForm, state: e.target.value })
                    }
                    placeholder="e.g., Delhi"
                    className="w-full p-2.5 bg-[#FCF9F1] border border-[#1A1A1A] focus:outline-none text-sm font-medium"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs uppercase tracking-wider text-[#666] mb-1 font-serif">
                    ZIP / Postal Code *
                  </label>
                  <input
                    required
                    type="text"
                    value={addressForm.pincode}
                    onChange={(e) =>
                      setAddressForm({
                        ...addressForm,
                        pincode: e.target.value,
                      })
                    }
                    placeholder="e.g., 110001"
                    className="w-full p-2.5 bg-[#FCF9F1] border border-[#1A1A1A] focus:outline-none text-sm font-mono tracking-widest font-semibold"
                  />
                </div>
                <div>
                  <label className="block text-xs uppercase tracking-wider text-[#666] mb-1 font-serif">
                    Country *
                  </label>
                  <input
                    required
                    type="text"
                    value={addressForm.country}
                    onChange={(e) =>
                      setAddressForm({
                        ...addressForm,
                        country: e.target.value,
                      })
                    }
                    className="w-full p-2.5 bg-[#FCF9F1] border border-[#1A1A1A] focus:outline-none text-sm font-medium"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs uppercase tracking-wider text-[#666] mb-1 font-serif">
                  Delivery Mobile Contact *
                </label>
                <input
                  required
                  type="tel"
                  pattern="[0-9]{10,12}"
                  value={addressForm.phone}
                  onChange={(e) =>
                    setAddressForm({ ...addressForm, phone: e.target.value })
                  }
                  placeholder="e.g., 9876543210"
                  className="w-full p-2.5 bg-[#FCF9F1] border border-[#1A1A1A] focus:outline-none text-sm font-mono tracking-wider"
                />
              </div>

              <button
                type="submit"
                disabled={saving}
                className="w-full py-3.5 bg-[#1A1A1A] text-white font-serif uppercase tracking-widest font-bold hover:bg-[#B22222] transition-colors duration-300 text-xs disabled:opacity-50"
              >
                {saving
                  ? "Updating Registries..."
                  : "Save Delivery Coordinates"}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
