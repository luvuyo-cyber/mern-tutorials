import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import ProductForm from "./ProductForm";

function DashboardPage() {
  const [products, setProducts] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editProduct, setEditProduct] = useState(null);

  const navigate = useNavigate();

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
    <div style={{ padding: "20px" }}>
      <h1>Admin Dashboard</h1>
      <button onClick={handleLogout} style={{ marginBottom: "20px" }}>
        Logout
      </button>

      <h2>All Products</h2>
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

      <table style={{ width: "100%", borderCollapse: "collapse" }}>
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
          {products.map((product) => (
            <tr key={product._id}>
              <td style={tdStyle}>
                <img
                  src={product.image}
                  alt={product.title}
                  style={{ width: "80px", height: "80px", objectFit: "cover" }}
                />
              </td>
              <td style={tdStyle}>{product.title}</td>
              <td style={tdStyle}>{product.description}</td>
              <td style={tdStyle}>${product.price}</td>
              <td style={tdStyle}>{product.stock}</td>
              <td style={tdStyle}>
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
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

// Some basic styles for table
const thStyle = {
  border: "1px solid black",
  padding: "8px",
  backgroundColor: "#f0f0f0",
};

const tdStyle = {
  border: "1px solid black",
  padding: "8px",
  textAlign: "center",
};

const buttonStyle = {
  padding: "5px 10px",
  backgroundColor: "blue",
  color: "white",
  border: "none",
  cursor: "pointer",
};

export default DashboardPage;
