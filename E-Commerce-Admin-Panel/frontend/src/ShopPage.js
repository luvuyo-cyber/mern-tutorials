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

  return (
    <div style={{ maxWidth: "1100px", margin: "0 auto", padding: "20px" }}>
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
          </div>
        ))}
      </div>
    </div>
  );
}

export default ShopPage;
