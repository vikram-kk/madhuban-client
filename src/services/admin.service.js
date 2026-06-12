import API from "./api";

const adminService = {
    // --- USER MANAGEMENT ---
    getAllUsers: async () => {
        const res = await API.get("/admin/users");
        return res.data?.users || res.data || [];
    },

    deleteUser: async (userId) => {
        const res = await API.delete(`/admin/users/${userId}`);
        return res.data;
    },

    // --- ORDER MANAGEMENT ---
    updateOrderStatus: async (orderId, updates) => {
        // updates payload: { orderStatus, paymentStatus }
        const res = await API.put(`/admin/orders/${orderId}`, updates);
        return res.data?.order || res.data;
    },

    // --- PRODUCT MANAGEMENT ---
    updateProduct: async (productId, payload) => {
        const res = await API.put(`/product/${productId}`, payload);
        return res.data?.product || res.data;
    }
};

export default adminService;