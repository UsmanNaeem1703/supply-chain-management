// controllers/transactionController.js
const Node = require('../Models/Node');
const Transaction = require('../Models/Transaction');
const { Web3 } = require('web3');
const web3 = new Web3(new Web3.providers.HttpProvider('http://127.0.0.1:7545'));

exports.getTransactionsByMedicine = async (req, res) => {
    try {
        const medicineId = req.params.id;
        const transactions = await Transaction.find({ 'medicine': medicineId })
            .populate('fromNode')
            .populate('toNode')
            .populate('medicine');

        res.json(transactions);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Server error fetching transactions.' });
    }
};

exports.getAllTransactions = async (req, res) => {
    try {
        // Retrieve page number and limit from query parameters with defaults
        const page = parseInt(req.params.page, 10) || 1;
        const limit = 50;  // Default to 10 items per page
        const skip = (page - 1) * limit;

        const transactions = await Transaction.find()
            .skip(skip)
            .limit(limit)
            .populate('fromNode', 'name') // Assuming the 'Node' model includes 'username' and 'email'
            .populate('toNode', 'name')   // Same as above for destination node
            .populate('medicine', 'name');          // Assuming 'Product' model includes 'name' as a field
        const total = await Transaction.countDocuments();
        res.json({
            total,
            pages: Math.ceil(total / limit),
            currentPage: page,
            limit,
            transactions
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.getTransaction = async (req, res) => {
    try {
        const tx = await Transaction.findById(req.params.id);
        const txHash = tx.blockchainTxHash;
        const transaction = await web3.eth.getTransaction(txHash);
        const sanitizedReceipt = JSON.parse(JSON.stringify(transaction, (_, v) =>
            typeof v === 'bigint' ? v.toString() : v
        ));
        if (!sanitizedReceipt) {
            return res.status(404).json({ error: 'Transaction not found' });
        }

        res.json(sanitizedReceipt);
    } catch (error) {
        console.error('Error fetching transaction:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

exports.getMyTransactions = async (req, res) => {
    try {
        const ownerAddress = req.user.id; // Assuming req.user.id holds the logged-in user's ID
        const page = parseInt(req.query.page, 10) || 1; // Correction: Use req.query for pagination
        const limit = 50;
        const skip = (page - 1) * limit;

        // Define the query to find transactions related to nodes owned by the current user
        const transactions = await Transaction.find({
            $or: [
                { 'fromNode': { $in: (await Node.find({ owner: ownerAddress }).select('_id')).map(node => node._id) } },
                { 'toNode': { $in: (await Node.find({ owner: ownerAddress }).select('_id')).map(node => node._id) } }
            ]
        })
            .skip(skip)
            .limit(limit)
            .populate({
                path: 'fromNode',
                select: 'name etherAddress owner'
            })
            .populate({
                path: 'toNode',
                select: 'name etherAddress owner'
            })
            .populate('medicine', 'name brand'); // Assuming 'Product' model includes 'name' and 'brand'

        const total = await Transaction.countDocuments({
            $or: [
                { 'fromNode': { $in: (await Node.find({ owner: ownerAddress }).select('_id')).map(node => node._id) } },
                { 'toNode': { $in: (await Node.find({ owner: ownerAddress }).select('_id')).map(node => node._id) } }
            ]
        });

        res.json({
            total,
            pages: Math.ceil(total / limit),
            currentPage: page,
            limit,
            transactions
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

