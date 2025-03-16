const Product = require('../models/productModel');

module.exports = {
    // Get all products
    getAllProducts: async (req, res) => {
        try {
            const products = await Product.find();
            res.status(200).json(products);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },

    // Get products by user
    getProductsByUser: async (req, res) => {
        try {
            const products = await Product.find({ userId: req.user.id });
            res.status(200).json(products);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },

    // Create a new product
    createProduct: async (req, res) => {
        try {
            const { name, category, price, description, stock } = req.body;

            const newProduct = await Product.create({
                name,
                category,
                price,
                description,
                stock,
                userId: req.user.id
            });

            res.status(201).json({ message: "Product created successfully", product: newProduct });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },

    // Update a product
    updateProduct: async (req, res) => {
        try {
            const { id } = req.params;
            const updates = req.body;

            const updatedProduct = await Product.findByIdAndUpdate(id, updates, { new: true });

            res.status(200).json({ message: "Product updated successfully", product: updatedProduct });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },

    // Delete a product
    deleteProduct: async (req, res) => {
        try {
            const { id } = req.params;

            await Product.findByIdAndDelete(id);

            res.status(200).json({ message: "Product deleted successfully" });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }
};
