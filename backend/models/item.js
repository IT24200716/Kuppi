const mongoose = require('mongoose');

const ItemSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  price: { type: Number, required: true } 
}, { timestamps: true });

// This registers the model as "Item" in Mongoose
module.exports = mongoose.model('Item', ItemSchema);
