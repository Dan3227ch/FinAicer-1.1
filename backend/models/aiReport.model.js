const mongoose = require('mongoose');
const { Schema } = mongoose;

const aiReportSchema = new Schema({
  userId: { 
    type: Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  },
  month: { 
    type: String, 
    required: true 
  },
  categorySpending: { 
    type: Map, 
    of: Number 
  },
  totalExpenses: { 
    type: Number, 
    required: true 
  },
  recommendedSavings: { 
    type: Number 
  },
  summary: {
    type: String,
    required: true
  },
  recommendations: [String],
  risks: [String],
  analysisDate: { 
    type: Date, 
    default: Date.now 
  }
});

module.exports = mongoose.model('AIReport', aiReportSchema);