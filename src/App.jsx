import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import SignUp from "./pages/Register";
import Home from "./pages/Home";
import ProtectedRoute from "./components/ProtectedRoute";
import Cart from "./pages/Cart";
import Navbar from "./components/Navbar";
import ProductPage from "./pages/ProductPage";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<SignUp />} />

        <Route
          path="/"
          element={
            <ProtectedRoute>
              <>
                <Navbar />
                <Home />
              </>
            </ProtectedRoute>
          }
        />

        <Route
          path="/cart"
          element={
            <ProtectedRoute>
              <>
                <Navbar />
                <Cart />
              </>
            </ProtectedRoute>
          }
        />
        <Route
          path="/product/:id"
          element={
            <ProtectedRoute>
              <>
                <Navbar />
                <ProductPage />
              </>
            </ProtectedRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}
