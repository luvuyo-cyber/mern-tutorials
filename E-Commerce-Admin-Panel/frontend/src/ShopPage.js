import { useEffect, useState } from "react";
import axios from "axios";
import "./index.css";

function ShopPage() {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    axios
      .get("http://localhost:5001/api/products")
      .then((res) => setProducts(res.data))
      .catch((err) => console.error(err));
  }, []);

  const handleAddToCart = (product) => {
    const existingCart = JSON.parse(localStorage.getItem("cart")) || [];

    const itemIndex = existingCart.findIndex(
      (item) => item._id === product._id
    );

    if (itemIndex > -1) {
      existingCart[itemIndex].quantity += 1;
    } else {
      existingCart.push({ ...product, quantity: 1 });
    }

    localStorage.setItem("cart", JSON.stringify(existingCart));
    alert("Product added to cart!");
  };

  return (
    <div className="container">
      <a href="/cart" className="button view-cart-button">
        View Cart
      </a>

      <h1>Welcome to the Shop</h1>

      <div className="shop-grid">
        {products.map((product) => (
          <div key={product._id} className="product-card">
            <img src={product.image} alt={product.title} />
            <h3>{product.title}</h3>
            <p>{product.description}</p>
            <strong>${product.price}</strong>

            <button
              onClick={() => handleAddToCart(product)}
              className="button add-button"
            >
              Add to Cart
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default ShopPage;
