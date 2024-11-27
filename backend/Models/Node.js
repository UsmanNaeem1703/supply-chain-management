const mongoose = require('mongoose');

const nodeSchema = new mongoose.Schema({
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Node must belong to a User']
  },
  name: {
    type: String,
    required: [true, 'Please tell us the node name!']
  },
  address: {
    type: String,
    required: [true, 'Please provide the node address']
  },
  etherAddress: {
    type: String,
    required: [true, 'Please provide the Ethereum address'],
    unique: true,
    validate: {
      validator: function (el) {
        return /^0x[a-fA-F0-9]{40}$/.test(el);
      },
      message: 'Please provide a valid Ethereum address'
    }
  },
  verified: {
    type: Boolean,
    default: false
  },
  inventory: [{
    medicine: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product',
      required: true
    },
    quantity: {
      type: Number,
      required: true,
      min: 0
    }
  }]
}, {
  collection: 'nodes'
});

const Node = mongoose.model('Node', nodeSchema);
module.exports = Node;
