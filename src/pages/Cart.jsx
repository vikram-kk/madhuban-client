import { useEffect, useState, useMemo } from "react";
import API from "../services/api";

export default function Cart() {
  const [cart, setCart] = useState([]);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState(null);

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
      setErr(error.response?.data?.message || "Error fetching cart");
    } finally {
      setLoading(false);
    }
  };

  const handleRemove = async (id) => {
    try {
      const previousCart = [...cart];
      setCart(cart.filter((item) => item.product._id !== id));

      await API.delete("/cart/remove", { data: { productId: id } });
    } catch (error) {
      setErr("Could not remove item. Please try again.");
      getCart();
    }
  };

  const handleQuantity = async (id, opp, currQty) => {
    let newQty = opp === "add" ? currQty + 1 : currQty - 1;
    if (newQty < 1) return;

    const updatedCart = cart.map((item) =>
      item.product._id === id ? { ...item, quantity: newQty } : item,
    );
    setCart(updatedCart);

    try {
      await API.patch("/cart/update", {
        productId: id,
        quantity: newQty,
      });
    } catch (err) {
      console.error("Update failed", err);
      getCart();
    }
  };

  const handleCheckOut =()=>{
      try {
    const res = await API.post("/order/place");
    alert("Order placed successfully 🎉");
    navigate("/orders");
  } catch (err) {
    console.log(err);
  }
  }

  if (loading) return <h1>Loading...</h1>;
  if (err) return <h2>{err}</h2>;

  return (
    <div>
      {cart.length === 0 ? (
        <h2>Your cart is empty. Continue shopping 🛒</h2>
      ) : (
        <>
          {cart.map((item) => (
            <div
              key={item.product._id}
              style={{ borderBottom: "1px solid #ccc", margin: "10px 0" }}
            >
              <h1>{item.product.name}</h1>
              <p>{item.product.description}</p>
              <h2>₹{item.product.price}</h2>

              <div
                style={{ display: "flex", alignItems: "center", gap: "10px" }}
              >
                <button
                  onClick={() =>
                    handleQuantity(item.product._id, "sub", item.quantity)
                  }
                >
                  -
                </button>
                <p>Qty: {item.quantity}</p>
                <button
                  onClick={() =>
                    handleQuantity(item.product._id, "add", item.quantity)
                  }
                >
                  +
                </button>
              </div>

              <button
                onClick={() => handleRemove(item.product._id)}
                style={{ marginTop: "10px", color: "red" }}
              >
                Remove
              </button>
            </div>
          ))}
          <hr />
          <h2>Total: ₹{total}</h2>
          <button onClick={() => alert("Proceeding to Checkout")}>
            Checkout
          </button>
        </>
      )}
    </div>
  );
}
