const Node = require('../Models/Node');
const mongoose = require('mongoose');
const Requests = require('../Models/Requests');
const Transaction = require('../Models/Transaction');
const Product = require('../Models/Product');
const { Web3 } = require('web3')
const web3 = new Web3(new Web3.providers.HttpProvider('http://127.0.0.1:7545'));
const contractAddress = '0x83F6e4c44D2D23f2a3A5f3D7842A04420da45Cf8';
const contractABI = [
    {
        "anonymous": false,
        "inputs": [
            {
                "indexed": true,
                "internalType": "address",
                "name": "from",
                "type": "address"
            },
            {
                "indexed": true,
                "internalType": "address",
                "name": "to",
                "type": "address"
            },
            {
                "indexed": false,
                "internalType": "uint256",
                "name": "amount",
                "type": "uint256"
            },
            {
                "indexed": false,
                "internalType": "bool",
                "name": "success",
                "type": "bool"
            }
        ],
        "name": "Transfer",
        "type": "event"
    },
    {
        "stateMutability": "payable",
        "type": "receive",
        "payable": true
    },
    {
        "inputs": [
            {
                "internalType": "address payable",
                "name": "_to",
                "type": "address"
            },
            {
                "internalType": "uint256",
                "name": "_amount",
                "type": "uint256"
            }
        ],
        "name": "transferEther",
        "outputs": [],
        "stateMutability": "payable",
        "type": "function",
        "payable": true
    }
];
const contract = new web3.eth.Contract(contractABI, contractAddress);
// Add a single node
const addNode = async (req, res) => {   // TO add pharmacy
    try {
        const { name, address, etherAddress } = req.body;
        const newNode = new Node({
            name,
            address,
            etherAddress,
            owner: req.user._id
        });
        const savedNode = await newNode.save();
        res.status(201).json(savedNode);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Get all nodes
const getNodes = async (req, res) => {
    try {
        const nodes = await Node.find({ verified: true }).populate('owner', 'username email');
        res.json(nodes);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Get a single node by ID
const getNode = async (req, res) => {
    try {
        const node = await Node.findById(req.params.id).populate({
            path: 'inventory.medicine',
            select: 'name brand batchNumber'
        });

        if (!node) {
            return res.status(404).json({ message: 'Node not found' });
        }

        if (node.name === 'Distributor') {
            // Fetch all products with selected fields
            const products = await Product.find().select('_id name brand batchNumber');

            // Map through each product and assign a very large quantity to each
            node.inventory = products.map(product => ({
                medicine: product,
                quantity: Number.MAX_SAFE_INTEGER // Use JavaScript's largest safe integer
            }));
        }

        // Fetch Ether balance from the blockchain
        const balance = await web3.eth.getBalance(node.etherAddress);
        const balanceInEther = web3.utils.fromWei(balance, 'ether'); // Convert balance from Wei to Ether

        // Combine node data with the Ethereum balance
        const nodeDataWithBalance = {
            ...node.toObject(), // Convert Mongoose document to a plain JavaScript object
            etherBalance: balanceInEther
        };

        res.json(nodeDataWithBalance);
    } catch (err) {
        console.error('Error fetching node data or Ethereum balance:', err);
        res.status(500).json({ error: err.message });
    }
};


const getNodebyOwner = async (req, res) => {
    try {
        const owner = req.params.id;
        const nodes = await Node.find({ owner: new mongoose.Types.ObjectId(owner) });

        res.json({
            success: true,
            nodes
        });
    } catch (err) {
        res.status(500).json({ success: false, message: 'Failed to fetch nodes', error: err.message });
    }
};

// Verify a node
const verifyNode = async (req, res) => {
    try {
        const node = await Node.findByIdAndUpdate(req.params.id, { verified: true }, { new: true });
        if (!node) {
            return res.status(404).json({ message: 'Node not found' });
        }
        res.json(node);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

const updateNodeInventory = async (req, res) => {
    const session = await mongoose.startSession();
    try {
        session.startTransaction();
        const { requestId, senderId, receiverId, medicineId, quantity } = req.body;

        if (quantity <= 0) {
            throw new Error("Quantity must be greater than zero");
        }

        if (medicineId === undefined) {
            throw new Error("Medicine ID is required");
        }

        const medicine = await Product.findById(medicineId);
        console.log(medicine);

        const senderNode = await Node.findById(senderId).session(session);
        const receiverNode = await Node.findById(receiverId).session(session);

        if (!senderNode || !receiverNode) {
            throw new Error("Node not found");
        }
        if (senderNode._id.toString() !== "6741613f33b054642e373d11") {
            // Validate sender's inventory
            const senderItemIndex = senderNode.inventory.findIndex(item => item.medicine.equals(medicineId));
            if (senderItemIndex === -1 || senderNode.inventory[senderItemIndex].quantity < quantity) {
                throw new Error("Sender does not have enough inventory");
            }

            senderNode.inventory[senderItemIndex].quantity -= quantity;
        }

        const receiverItemIndex = receiverNode.inventory.findIndex(item => item.medicine.equals(medicineId));
        if (receiverItemIndex > -1) {
            receiverNode.inventory[receiverItemIndex].quantity += quantity;
        } else {
            receiverNode.inventory.push({ medicine: medicineId, quantity });
        }

        await Node.updateOne({ _id: senderNode._id }, { $set: { inventory: senderNode.inventory } }, { session });
        await Node.updateOne({ _id: receiverNode._id }, { $set: { inventory: receiverNode.inventory } }, { session });

        const newTransaction = new Transaction({
            fromNode: senderId,
            toNode: receiverId,
            medicine: medicineId,
            quantity
        });

        const senderAddress = senderNode.etherAddress;
        const receiverAddress = receiverNode.etherAddress;
        const transferAmount = medicine.unitPrice * quantity;
        const transferAmountWei = web3.utils.toWei(String(transferAmount * 100), 'gwei');

        // Perform Ether transfer on Ethereum network
        const receipt = await contract.methods.transferEther(senderAddress, transferAmountWei)
            .send({ from: receiverAddress, value: transferAmountWei });
        // console.log('Transaction hash:', receipt.transactionHash);
        const sanitizedReceipt = JSON.parse(JSON.stringify(receipt, (_, v) =>
            typeof v === 'bigint' ? v.toString() : v
        ));

        newTransaction.blockchainTxHash = sanitizedReceipt.transactionHash;
        const updatedRequest = await Requests.findByIdAndUpdate(requestId, { status: 'Accepted' }, { new: true });
        await newTransaction.save({ session });
        await session.commitTransaction();
        session.endSession();
        res.json({
            message: 'Inventory and blockchain transaction updated successfully',
            transaction: newTransaction,
            sender: senderNode,
            receiver: receiverNode,
            updatedRequest,
            ethTransactionReceipt: sanitizedReceipt
        });
    } catch (err) {
        console.log('Error during transaction:', err);
        await session.abortTransaction();
        res.status(500).json({ error: err.message });
    } finally {
        session.endSession();
    }
};


module.exports = {
    addNode,
    getNodes,
    getNode,
    getNodebyOwner,
    verifyNode,
    updateNodeInventory
};
