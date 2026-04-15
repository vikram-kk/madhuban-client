import { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../services/api";

export default function SignUp() {
  const navigate = useNavigate();
  const { getUser } = useContext(AuthContext);

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
    {
      label: "Phone",
      type: "text",
      name: "phone",
      placeholder: "9987459625",
    },
    {
      label: "Name",
      type: "text",
      name: "name",
      placeholder: "Vikram Thakur",
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

    if (!form.email || !form.password || !form.phone || !form.name) {
      setError("All fields are required");
      return;
    }
    if (form.password.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }
    if (!/^\S+@\S+\.\S+$/.test(form.email)) {
      setError("Enter valid email");
      return;
    }
    if (!/^\d{10}$/.test(form.phone)) {
      setError("Enter valid 10-digit phone number");
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
      setError(err.response?.data?.message || "Sign Up failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <form onSubmit={submitHandler}>
        {inputs.map((item, i) => (
          <div key={i}>
            <label>{item.label}</label>{" "}
            <input
              required
              autoFocus={i === 0}
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
          {loading ? "Creating user..." : "Sign Up"}
        </button>
      </form>
    </div>
  );
}
