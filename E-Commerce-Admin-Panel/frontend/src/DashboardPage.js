import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import ProductForm from "./ProductForm";

function DashboardPage() {
  const [products, setProducts] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editProduct, setEditProduct] = useState(null);

  const navigate = useNavigate();
  const role = localStorage.getItem("role");
  const name = localStorage.getItem("name") || "Admin";

  const fetchProducts = async () => {
    try {
      const response = await axios.get("http://localhost:5001/api/products");
      setProducts(response.data);
    } catch (error) {
      console.error(error);
      navigate("/");
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    localStorage.removeItem("name");
    navigate("/");
  };

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this product?"
    );
    if (!confirmDelete) return;

    const token = localStorage.getItem("token");

    try {
      await axios.delete(`http://localhost:5001/api/products/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      fetchProducts();
    } catch (error) {
      console.error(
        "Failed to delete product:",
        error.response?.data || error.message
      );
      alert("Could not delete product. Try again.");
    }
  };

  return (
    <div style={{ maxWidth: "1100px", margin: "0 auto", padding: "20px" }}>
      <h1 style={{ fontSize: "28px", marginBottom: "10px" }}>
        Welcome, {name} ({role})
      </h1>
      <button
        onClick={handleLogout}
        style={{ marginBottom: "30px", ...buttonStyle }}
      >
        Logout
      </button>

      <h2 style={{ fontSize: "22px", marginBottom: "10px" }}>All Products</h2>

      {role === "admin" && (
        <button
          onClick={() => {
            setEditProduct(null);
            setShowForm(true);
          }}
          style={{
            ...buttonStyle,
            marginBottom: "20px",
            backgroundColor: "green",
          }}
        >
          + Add Product
        </button>
      )}

      {showForm && (
        <ProductForm
          product={editProduct}
          onSuccess={() => {
            fetchProducts();
            setShowForm(false);
          }}
          onCancel={() => setShowForm(false)}
        />
      )}

      <table
        style={{ width: "100%", borderCollapse: "collapse", marginTop: "10px" }}
      >
        <thead>
          <tr>
            <th style={thStyle}>Image</th>
            <th style={thStyle}>Title</th>
            <th style={thStyle}>Description</th>
            <th style={thStyle}>Price</th>
            <th style={thStyle}>Stock</th>
            <th style={thStyle}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {products.map((product, index) => (
            <tr
              key={product._id}
              style={{
                backgroundColor: index % 2 === 0 ? "#ffffff" : "#f8f8f8",
              }}
            >
              <td style={tdStyle}>
                <img
                  src={product.image}
                  alt={product.title}
                  style={{
                    width: "80px",
                    height: "80px",
                    objectFit: "cover",
                    borderRadius: "6px",
                  }}
                />
              </td>
              <td style={tdStyle}>{product.title}</td>
              <td style={tdStyle}>{product.description}</td>
              <td style={tdStyle}>${product.price}</td>
              <td style={tdStyle}>{product.stock}</td>
              <td style={tdStyle}>
                {role === "admin" && (
                  <>
                    <button
                      onClick={() => {
                        setEditProduct(product);
                        setShowForm(true);
                      }}
                      style={buttonStyle}
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(product._id)}
                      style={{
                        ...buttonStyle,
                        backgroundColor: "red",
                        marginLeft: "10px",
                      }}
                    >
                      Delete
                    </button>
                  </>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

// Styles
const thStyle = {
  border: "1px solid #ddd",
  padding: "12px",
  backgroundColor: "#f1f1f1",
  fontWeight: "bold",
  textAlign: "left",
};

const tdStyle = {
  border: "1px solid #ddd",
  padding: "12px",
  textAlign: "left",
  verticalAlign: "middle",
  fontSize: "14px",
};

const buttonStyle = {
  padding: "6px 12px",
  backgroundColor: "blue",
  color: "white",
  border: "none",
  borderRadius: "4px",
  cursor: "pointer",
  fontSize: "14px",
};

export default DashboardPage;
