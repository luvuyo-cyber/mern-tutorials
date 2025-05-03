import { useEffect, useState } from "react";

function CartPage() {
  const [cart, setCart] = useState([]);

  useEffect(() => {
    const storedCart = JSON.parse(localStorage.getItem("cart")) || [];
    setCart(storedCart);
  }, []);

  const removeFromCart = (id) => {
    const updatedCart = cart.filter((item) => item._id !== id);
    localStorage.setItem("cart", JSON.stringify(updatedCart));
    setCart(updatedCart);
  };

  const updateQuantity = (id, amount) => {
    const updatedCart = cart.map((item) => {
      if (item._id === id) {
        const newQty = item.quantity + amount;
        return { ...item, quantity: newQty >= 1 ? newQty : 1 };
      }
      return item;
    });

    localStorage.setItem("cart", JSON.stringify(updatedCart));
    setCart(updatedCart);
  };

  const getTotalPrice = () => {
    return cart
      .reduce((acc, item) => acc + item.price * item.quantity, 0)
      .toFixed(2);
  };

  return (
    <div style={{ maxWidth: "900px", margin: "0 auto", padding: "20px" }}>
      <h1 style={{ fontSize: "28px", marginBottom: "20px" }}>Your Cart</h1>

      {cart.length === 0 ? (
        <p>Your cart is empty.</p>
      ) : (
        <>
          <table
            style={{
              width: "100%",
              borderCollapse: "collapse",
              marginBottom: "20px",
            }}
          >
            <thead>
              <tr>
                <th style={thStyle}>Product</th>
                <th style={thStyle}>Price</th>
                <th style={thStyle}>Quantity</th>
                <th style={thStyle}>Total</th>
                <th style={thStyle}>Action</th>
              </tr>
            </thead>
            <tbody>
              {cart.map((item) => (
                <tr key={item._id}>
                  <td style={tdStyle}>{item.title}</td>
                  <td style={tdStyle}>${item.price}</td>
                  <td style={tdStyle}>
                    <button
                      onClick={() => updateQuantity(item._id, -1)}
                      style={qtyBtnStyle}
                    >
                      −
                    </button>
                    <span style={{ margin: "0 10px" }}>{item.quantity}</span>
                    <button
                      onClick={() => updateQuantity(item._id, 1)}
                      style={qtyBtnStyle}
                    >
                      +
                    </button>
                  </td>
                  <td style={tdStyle}>
                    ${(item.price * item.quantity).toFixed(2)}
                  </td>
                  <td style={tdStyle}>
                    <button
                      onClick={() => removeFromCart(item._id)}
                      style={removeButtonStyle}
                    >
                      Remove
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <h3 style={{ textAlign: "right" }}>Total: ${getTotalPrice()}</h3>
          <a
            href="/checkout"
            style={{
              display: "inline-block",
              marginTop: "20px",
              padding: "10px 20px",
              backgroundColor: "green",
              color: "white",
              textDecoration: "none",
              borderRadius: "4px",
            }}
          >
            Proceed to Checkout
          </a>
        </>
      )}
    </div>
  );
}

const thStyle = {
  border: "1px solid #ccc",
  padding: "10px",
  backgroundColor: "#f2f2f2",
  textAlign: "left",
};

const tdStyle = {
  border: "1px solid #ccc",
  padding: "10px",
};

const removeButtonStyle = {
  padding: "6px 12px",
  backgroundColor: "red",
  color: "white",
  border: "none",
  borderRadius: "4px",
  cursor: "pointer",
};

const qtyBtnStyle = {
  padding: "4px 10px",
  backgroundColor: "#ccc",
  border: "none",
  borderRadius: "4px",
  fontSize: "16px",
  cursor: "pointer",
};

export default CartPage;
