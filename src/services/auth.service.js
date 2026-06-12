import { useState } from "react";

const [profile, setProfile] = useState(null);
const [stats, setStats] = useState({ ordersCount: 0, wishlistCount: 0 });
const [loading, setLoading] = useState(true);
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

export { fetchAccountData }