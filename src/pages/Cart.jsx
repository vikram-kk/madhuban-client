import { useEffect, useState } from "react";
import API from "../services/api";

export default function Cart() {
  const [cart, setCart] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState(null);

  useEffect(() => {
    const getCart = async () => {
      try {
        setLoading(true);

        const res = await API.get("/cart");
        console.log(res.data);
        const items = res.data.cart.items || [];

        if (items.length === 0) {
          setErr("Your cart is empty. Continue shopping 🛒");
          return;
        }

        setCart(items);

        const totalPrice = items.reduce(
          (acc, item) => acc + item.product.price * item.quantity,
          0,
        );

        setTotal(totalPrice);
      } catch (error) {
        setErr(error.response?.data?.message || "Error fetching cart");
      } finally {
        setLoading(false);
      }
    };

    getCart();
  }, []);

  const HandleRemove = async (id) => {
    console.log(id);
    try {
      await API.delete("/cart/remove", { data: { productId: id } });
      const updatedCart = cart.filter((item) => item.product._id !== id);
      setCart(updatedCart);

      if (updatedCart.length === 0) setErr("Your cart is empty. 🛒");
      console.log(res.data);
    } catch (error) {
      return setErr(
        error.response?.data?.message ||
          `error while removing the item from the cart`,
      );
    }
  };

  if (loading) return <h1>Loading...</h1>;

  if (err) return <h2>{err}</h2>;

  return (
    <div>
      {cart.map((item) => (
        <div key={item.product._id}>
          <h1>{item.product.name}</h1>
          <p>{item.product.description}</p>
          <h2>₹{item.product.price}</h2>
          <p>Qty: {item.quantity}</p>
          <button
            onClick={() => {
              HandleRemove(item.product._id);
            }}
          >
            Remove
          </button>
        </div>
      ))}

      <h2>Total: ₹{total}</h2>
    </div>
  );
}
