cimport { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function CheckoutPage() {
  const [cart, setCart] = useState([]);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [address, setAddress] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const storedCart = JSON.parse(localStorage.getItem("cart")) || [];
    setCart(storedCart);
  }, []);

  const getTotalPrice = () => {
    return cart
      .reduce((acc, item) => acc + item.price * item.quantity, 0)
      .toFixed(2);
  };

  const handlePlaceOrder = () => {
    if (!name || !email || !address) {
      alert("Please fill in all fields");
      return;
    }

    // Simulate saving the order
    alert("Order placed successfully!");

    // Clear cart
    localStorage.removeItem("cart");
    navigate("/shop");
  };

  return (
    <div style={{ maxWidth: "700px", margin: "0 auto", padding: "20px" }}>
      <h1 style={{ marginBottom: "20px" }}>Checkout</h1>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          handlePlaceOrder();
        }}
        style={{ marginBottom: "30px" }}
      >
        <input
          type="text"
          placeholder="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          style={inputStyle}
        />
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          style={inputStyle}
        />
        <textarea
          placeholder="Shipping Address"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          style={{ ...inputStyle, height: "80px" }}
        ></textarea>

        <button type="submit" style={submitStyle}>
          Place Order
        </button>
      </form>

      <h3>Order Summary</h3>
      {cart.map((item) => (
        <div key={item._id} style={{ marginBottom: "10px" }}>
          {item.quantity} × {item.title} — ${item.price * item.quantity}
        </div>
      ))}
      <h4 style={{ marginTop: "10px" }}>Total: ${getTotalPrice()}</h4>
    </div>
  );
}

const inputStyle = {
  width: "100%",
  padding: "10px",
  marginBottom: "10px",
  border: "1px solid #ccc",
  borderRadius: "4px",
};

const submitStyle = {
  padding: "10px 20px",
  backgroundColor: "blue",
  color: "white",
  border: "none",
  borderRadius: "4px",
  cursor: "pointer",
};

export default CheckoutPage;
