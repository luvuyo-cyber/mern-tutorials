import { useState, useEffect } from "react";
import axios from "axios";

function ProductForm({ product, onSuccess, onCancel }) {
  const [title, setTitle] = useState(product?.title || "");
  const [description, setDescription] = useState(product?.description || "");
  const [price, setPrice] = useState(product?.price || 0);
  const [stock, setStock] = useState(product?.stock || 0);
  const [image, setImage] = useState(product?.image || "");
  const [uploading, setUploading] = useState(false);

  const isEditing = Boolean(product?._id);
  const token = localStorage.getItem("token");

  const handleSubmit = async (e) => {
    e.preventDefault();

    const productData = {
      title,
      description,
      price,
      stock,
      image,
    };

    try {
      if (isEditing) {
        await axios.put(
          `http://localhost:5001/api/products/${product._id}`,
          productData,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
      } else {
        await axios.post("http://localhost:5001/api/products", productData, {
          headers: { Authorization: `Bearer ${token}` },
        });
      }

      onSuccess();
    } catch (error) {
      console.error(
        "Error saving product:",
        error.response?.data || error.message
      );
      alert("Failed to save product.");
    }
  };

  const uploadImage = async (e) => {
    const file = e.target.files[0];
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", "ecommerce_upload");

    setUploading(true);

    try {
      const res = await axios.post(
        "https://api.cloudinary.com/v1_1/dhy3gob0r/image/upload",
        formData
      );
      setImage(res.data.secure_url);
      setUploading(false);
    } catch (err) {
      console.error("Image upload failed", err);
      alert("Image upload failed");
      setUploading(false);
    }
  };

  return (
    <div
      style={{
        marginBottom: "20px",
        padding: "10px",
        border: "1px solid #ccc",
      }}
    >
      <h3>{isEditing ? "Edit Product" : "Add New Product"}</h3>
      <form onSubmit={handleSubmit}>
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Title"
          required
          style={inputStyle}
        />
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Description"
          required
          style={inputStyle}
        />
        <input
          type="number"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          placeholder="Price"
          required
          style={inputStyle}
        />
        <input
          type="number"
          value={stock}
          onChange={(e) => setStock(e.target.value)}
          placeholder="Stock"
          required
          style={inputStyle}
        />
        <input type="file" onChange={uploadImage} style={inputStyle} />
        {uploading ? (
          <p>Uploading image...</p>
        ) : image ? (
          <img
            src={image}
            alt="Preview"
            style={{ width: "100px", marginBottom: "10px" }}
          />
        ) : null}

        <div style={{ marginTop: "10px" }}>
          <button type="submit" style={{ ...buttonStyle, marginRight: "10px" }}>
            {isEditing ? "Update" : "Create"}
          </button>
          <button onClick={onCancel} type="button" style={buttonStyle}>
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}

const inputStyle = {
  width: "100%",
  marginBottom: "10px",
  padding: "8px",
};

const buttonStyle = {
  padding: "8px 16px",
  backgroundColor: "blue",
  color: "white",
  border: "none",
  cursor: "pointer",
};

export default ProductForm;
