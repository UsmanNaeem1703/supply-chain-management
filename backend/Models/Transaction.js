const mongoose = require("mongoose");
const crypto = require("crypto"); // To generate hashes

const transactionSchema = new mongoose.Schema({
    fromNode: {
        type: mongoose.Schema.Types.ObjectId,
        required: [true, "Please provide the source node!"],
        ref: "Node",
    },
    toNode: {
        type: mongoose.Schema.Types.ObjectId,
        required: [true, "Please provide the destination node!"],
        ref: "Node",
    },
    medicine: {
        type: mongoose.Schema.Types.ObjectId,
        required: [true, "Please provide the medicine!"],
        ref: "Product",
    },
    quantity: {
        type: Number,
        required: [true, "Please provide the medicine quantity!"],
        min: 1,
    },
    timestamp: {
        type: Date,
        default: Date.now,
    },
    blockchainTxHash: {
        type: String
    },
    previousHash: {
        type: String // Field to store the hash of the previous transaction
    }
}, {
    collection: "transactions"
});

// Middleware to set the previousHash before saving a transaction
transactionSchema.pre('save', async function (next) {
    if (this.isNew) {
        // Find the last transaction of this medicine
        const lastTransaction = await mongoose.model('Transaction').findOne({ toNode: this.fromNode, medicine: this.medicine }).sort({ timestamp: -1 });
        this.previousHash = lastTransaction ? lastTransaction.blockchainTxHash : '0';
    }
    next();
});

const Transaction = mongoose.model("Transaction", transactionSchema);
module.exports = Transaction;
