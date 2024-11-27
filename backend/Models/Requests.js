const mongoose = require('mongoose');

const requestSchema = new mongoose.Schema({
    buyerId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Node',
        required: [true, 'Buyer must be specified']
    },
    sellerId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Node',
        required: [true, 'Seller must be specified']
    },
    productId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product',
        required: [true, 'Product ID is required']
    },
    quantity: {
        type: Number,
        required: [true, 'Quantity of the product is required'],
        min: 1
    },
    status: {
        type: String,
        enum: ['Pending', 'Accepted', 'Rejected', 'Completed'],
        default: 'Pending'
    }
}, {
    timestamps: true,
    collection: 'requests'
});

const Request = mongoose.model('Request', requestSchema);
module.exports = Request;
