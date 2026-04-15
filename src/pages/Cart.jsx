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
        console.log(res.data.cart.items);
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

  if (loading) return <h1>Loading...</h1>;

  if (err) return <h2>{err}</h2>;

  return (
    <div>
      {cart.map((item) => (
        <div key={item.product._id}>
          <h1>{item.product.name}</h1>
          <p>{item.product.description}</p>
          <h2>₹{item.product.price}</h2>
          Qty:<button>-</button> {item.quantity} <p> {item.quantity}</p>
          <button>+</button>
        </div>
      ))}

      <h2>Total: ₹{total}</h2>
    </div>
  );
}
