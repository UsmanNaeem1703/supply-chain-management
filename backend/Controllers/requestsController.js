const mongoose = require('mongoose');
const { Web3 } = require('web3');
const web3 = new Web3(new Web3.providers.HttpProvider('http://127.0.0.1:7545'));
const Requests = require('../Models/Requests');
const Product = require('../Models/Product');
const Node = require('../Models/Node');

const addRequest = async (req, res) => {
    try {
        if (!req.body.buyerId || !req.body.sellerId || !req.body.medicine) {
            return res.status(400).json({ error: 'buyer, seller, or product ID is required' });
        }
        const buyer = await Node.findById(req.body.buyerId);
        const seller = await Node.findById(req.body.sellerId);
        const product = await Product.findById(req.body.medicine);
        if (!buyer || !seller || !product) {
            return res.status(404).json({ error: 'Invalid buyer, seller, or product ID' });
        }

        // Check seller inventory
        const inventoryItem = seller.inventory.find(item => item.medicine.equals(req.body.medicine));
        if ((!inventoryItem || inventoryItem.quantity < req.body.quantity) && (seller.name !== 'Distributor')) {
            return res.status(400).json({ error: 'Seller does not have enough stock' });
        }

        // Calculate the cost
        const transferAmount = product.unitPrice * req.body.quantity;
        const transferAmountWei = web3.utils.toWei(String(transferAmount * 100), 'gwei');

        // Fetch Ether balance from the blockchain for the buyer
        const balance = await web3.eth.getBalance(buyer.etherAddress);
        const balanceInEther = web3.utils.fromWei(balance, 'ether'); // Convert balance from Wei to Ether

        // Check if the buyer can afford the order
        if (parseFloat(balanceInEther) < parseFloat(web3.utils.fromWei(transferAmountWei, 'ether'))) {
            return res.status(400).json({ error: 'Buyer does not have enough Ether to afford this order' });
        }

        // Create a new request if all conditions are met
        const newRequest = new Requests({
            buyerId: buyer._id,
            sellerId: seller._id,
            productId: product._id,
            quantity: req.body.quantity
        });

        await newRequest.save();
        return res.status(201).json({ success: 'Request has been posted successfully', newRequest });

    } catch (err) {
        console.error(err);
        return { error: 'Error processing request' };
    }
}

const getRequests = async (req, res) => {
    try {
        const ownerAddress = req.user.id;
        const requests = await Requests.find({ 'sellerId': { $in: (await Node.find({ owner: ownerAddress }).select('_id')).map(node => node._id) } })
            .populate('productId', 'name')
            .populate('buyerId', 'name owner address')
            .populate('sellerId', 'name owner address')
            .sort({ createdAt: -1 });
        if (!requests) {
            return res.status(404).json({ error: 'No Requests Found' });
        }

        return res.status(201).json({
            success: 'Request has been posted successfully',
            requests
        });

    } catch (err) {
        console.error(err);
        return { error: 'Error getting request' };
    }
}

const myRequests = async (req, res) => {
    try {
        const ownerAddress = req.user.id;
        const requests = await Requests.find({ 'buyerId': { $in: (await Node.find({ owner: ownerAddress }).select('_id')).map(node => node._id) } })
            .populate('productId', 'name')
            .populate('buyerId', 'name owner address')
            .populate('sellerId', 'name owner address')
            .sort({ createdAt: -1 });
        if (!requests) {
            return res.status(404).json({ error: 'No Requests Found' });
        }

        return res.status(201).json({
            success: 'Request has been posted successfully',
            requests
        });

    } catch (err) {
        console.error(err);
        return { error: 'Error getting request' };
    }
}

const deleteRequest = async (req, res) => {
    try {
        const requestId = req.params.id;

        // Find the request
        const request = await Requests.findById(requestId);

        if (!request) {
            return res.status(404).json({
                status: 'fail',
                message: 'Request not found',
            });
        }

        // Delete the request
        await Requests.findByIdAndDelete(requestId);

        res.status(200).json({
            status: 'success',
            message: 'Request deleted successfully',
        });
    } catch (err) {
        res.status(500).json({
            status: 'error',
            message: 'Error deleting request',
            err: err.message
        });
    }
};

module.exports = {
    addRequest,
    getRequests,
    myRequests,
    deleteRequest
};
