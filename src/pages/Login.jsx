import { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../services/api";

export default function Login() {
  const navigate = useNavigate();

  const inputs = [
    {
      label: "E-mail",
      type: "email",
      name: "email",
      placeholder: "vikram@test.com",
    },
    {
      label: "Password",
      type: "password",
      name: "password",
      placeholder: "12439d@V",
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
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const submitHandler = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);
      const res = await API.post("/auth/login", form);

      localStorage.setItem("token", res.data.token);
      await getUser();
      navigate("/");
    } catch (err) {
      setError(err.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <form onSubmit={submitHandler}>
        {inputs.map((item, i) => (
          <div key={i}>
            <h5>{item.label}</h5>
            <input
              type={item.type}
              placeholder={item.placeholder}
              value={form[item.name]}
              name={item.name}
              onChange={inputHandler}
            />
          </div>
        ))}

        {error && <p style={{ color: "red" }}>{error}</p>}

        <button type="submit" disabled={loading}>
          {loading ? "Logging in..." : "Login"}
        </button>
      </form>
    </div>
  );
}
