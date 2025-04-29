import express from "express";
import Product from "../models/Product.js";
import protect from "../middleware/authMiddleware.js";
import adminOnly from "../middleware/roleMiddleware.js";

const router = express.Router();

// Create a product (Admin only)
router.post("/", protect, adminOnly, async (req, res) => {
  try {
    const { title, price, description, image, stock } = req.body;

    const newProduct = new Product({
      title,
      price,
      description,
      image,
      stock,
    });

    await newProduct.save();
    res.status(201).json(newProduct);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get all products
router.get("/", async (req, res) => {
  try {
    const products = await Product.find();
    res.json(products);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get single product by ID
router.get("/:id", async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: "Product not found" });
    res.json(product);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Update a product
router.put("/:id", protect, adminOnly, async (req, res) => {
  try {
    const { title, price, description, image, stock } = req.body;

    const updatedProduct = await Product.findByIdAndUpdate(
      req.params.id,
      { title, price, description, image, stock },
      { new: true }
    );

    if (!updatedProduct)
      return res.status(404).json({ message: "Product not found" });

    res.json(updatedProduct);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Delete a product
router.delete("/:id", protect, adminOnly, async (req, res) => {
  try {
    const deletedProduct = await Product.findByIdAndDelete(req.params.id);
    if (!deletedProduct)
      return res.status(404).json({ message: "Product not found" });

    res.json({ message: "Product deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export default router;
