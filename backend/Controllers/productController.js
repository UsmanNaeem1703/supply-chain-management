const Product = require('../Models/Product'); // Ensure the path and model names are correct.

// Create a product
const addProduct = async (req, res) => {
    try {
        const newProduct = new Product({
            ...req.body
        });
        const savedProduct = await newProduct.save();
        res.status(201).json(savedProduct);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Get all products with pagination
const getProducts = async (req, res) => {
    try {
        // Retrieve page number and limit from query parameters with defaults
        const page = parseInt(req.params.page, 10) || 1;
        const limit = 50;  // Default to 10 items per page
        const skip = (page - 1) * limit;

        const products = await Product.find()
            .skip(skip)
            .limit(limit);

        // Optionally, return the total count of products for client-side pagination
        const total = await Product.countDocuments();

        res.json({
            total,
            pages: Math.ceil(total / limit),
            currentPage: page,
            limit,
            products
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Get all products with pagination
const getProduct = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);

        res.json({
            product
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Get products by name pattern
const getProductsByNamePattern = async (req, res) => {
    try {
        const namePattern = req.params.name;
        const regex = new RegExp(namePattern, 'i');
        const products = await Product.find({ name: { $regex: regex } }).limit(100);
        if (products.length === 0) {
            return res.status(404).json({ message: "No products found matching the given name pattern" });
        }
        res.json(products);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Update product
const updateProduct = async (req, res) => {
    try {
        const updatedProduct = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!updatedProduct) {
            return res.status(404).json({ message: "Product not found" });
        }
        res.json(updatedProduct);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Delete product
const deleteProduct = async (req, res) => {
    try {
        const deletedProduct = await Product.findByIdAndRemove(req.params.id);
        if (!deletedProduct) {
            return res.status(404).json({ message: "Product not found" });
        }
        res.json({ message: "Product deleted successfully" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

module.exports = {
    addProduct,
    getProducts,
    getProduct,
    getProductsByNamePattern,
    updateProduct,
    deleteProduct
};
