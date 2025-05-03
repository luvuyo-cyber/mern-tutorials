import { useEffect, useState } from "react";
import axios from "axios";

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
    <div style={{ maxWidth: "1100px", margin: "0 auto", padding: "20px" }}>
      <a
        href="/cart"
        style={{
          display: "inline-block",
          marginBottom: "20px",
          backgroundColor: "#222",
          color: "white",
          padding: "10px 15px",
          borderRadius: "4px",
          textDecoration: "none",
        }}
      >
        View Cart
      </a>

      <h1 style={{ fontSize: "28px", marginBottom: "20px" }}>
        Welcome to the Shop
      </h1>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(250px, 1fr))",
          gap: "20px",
        }}
      >
        {products.map((product) => (
          <div
            key={product._id}
            style={{
              border: "1px solid #ddd",
              padding: "15px",
              borderRadius: "8px",
              backgroundColor: "#fff",
            }}
          >
            <img
              src={product.image}
              alt={product.title}
              style={{
                width: "100%",
                height: "180px",
                objectFit: "cover",
                marginBottom: "10px",
                borderRadius: "4px",
              }}
            />

            <h3 style={{ marginBottom: "10px" }}>{product.title}</h3>
            <p style={{ fontSize: "14px", marginBottom: "10px" }}>
              {product.description}
            </p>
            <strong style={{ fontSize: "16px", color: "#222" }}>
              ${product.price}
            </strong>

            <button
              onClick={() => handleAddToCart(product)}
              style={{
                marginTop: "10px",
                padding: "8px 12px",
                backgroundColor: "blue",
                color: "white",
                border: "none",
                cursor: "pointer",
                borderRadius: "4px",
                fontSize: "14px",
                width: "100%",
              }}
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
