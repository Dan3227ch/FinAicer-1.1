const mongoose = require('mongoose');
const { Schema } = mongoose;

const transactionSchema = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  type: { type: String, enum: ['ingreso', 'gasto'], required: true },
  amount: { type: Number, required: true },
  category: { type: String, required: true },
  date: { type: Date, default: Date.now },
  description: { type: String }
});

module.exports = mongoose.model('Transaction', transactionSchema);
