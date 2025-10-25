const mongoose = require('mongoose');
const { Schema } = mongoose;

const aiChatSchema = new Schema({
  userId: { 
    type: Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  },
  prompt: { 
    type: String, 
    required: true 
  },
  response: { 
    type: String, 
    required: true 
  },
  date: { 
    type: Date, 
    default: Date.now 
  }
});

module.exports = mongoose.model('AIChat', aiChatSchema);