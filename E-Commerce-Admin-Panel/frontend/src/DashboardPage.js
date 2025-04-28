import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function DashboardPage() {
  const [products, setProducts] = useState([]);
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

  return (
    <div style={{ padding: "20px" }}>
      <h1>Admin Dashboard</h1>
      <button onClick={handleLogout} style={{ marginBottom: "20px" }}>
        Logout
      </button>

      <h2>All Products</h2>
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
                <button style={buttonStyle}>Edit</button>
                <button
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
