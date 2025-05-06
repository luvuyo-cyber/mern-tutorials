import { useEffect, useState } from "react";
import "./index.css";

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
    <div className="container cart-container">
      <h1>Your Cart</h1>

      {cart.length === 0 ? (
        <p>Your cart is empty.</p>
      ) : (
        <>
          <table className="table">
            <thead>
              <tr>
                <th>Product</th>
                <th>Price</th>
                <th>Quantity</th>
                <th>Total</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {cart.map((item) => (
                <tr key={item._id}>
                  <td>{item.title}</td>
                  <td>${item.price}</td>
                  <td>
                    <button
                      onClick={() => updateQuantity(item._id, -1)}
                      className="qty-button"
                    >
                      −
                    </button>
                    <span style={{ margin: "0 10px" }}>{item.quantity}</span>
                    <button
                      onClick={() => updateQuantity(item._id, 1)}
                      className="qty-button"
                    >
                      +
                    </button>
                  </td>
                  <td>${(item.price * item.quantity).toFixed(2)}</td>
                  <td>
                    <button
                      onClick={() => removeFromCart(item._id)}
                      className="button remove-button"
                    >
                      Remove
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <h3 style={{ textAlign: "right" }}>Total: ${getTotalPrice()}</h3>
          <a href="/checkout" className="button checkout-button">
            Proceed to Checkout
          </a>
        </>
      )}
    </div>
  );
}

export default CartPage;
