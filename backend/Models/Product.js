const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "Please tell product name!"],
    },
    brand: {
        type: String
    },
    batchNumber: {
        type: Number,
        unique: true,
        required: [true, "Please provide product batch number!"],
    },
    unitPrice: {
        type: Number,
        required: [true, "Please provide the unit price of the product!"],
    },
    retailPrice: {
        type: Number,
        required: [true, "Please provide the retail price of the product!"],
    }
}, { collection: "products" });

const Product = mongoose.model("Product", productSchema);
module.exports = Product;
