// Importing necessary components and modules from React Router and local files
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

// Importing page components for different parts of the app
import LoginPage from "./LoginPage";
import DashboardPage from "./DashboardPage";
import ShopPage from "./ShopPage";
import CartPage from "./CartPage";
import CheckoutPage from "./CheckoutPage";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/shop" element={<ShopPage />} />
        <Route path="/cart" element={<CartPage />} />
        <Route path="/checkout" element={<CheckoutPage />} />
      </Routes>
    </Router>
  );
}

export default App;
