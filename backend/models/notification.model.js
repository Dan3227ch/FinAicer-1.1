const mongoose = require('mongoose');
const { Schema } = mongoose;

const notificationSchema = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  type: { type: String, enum: ['sms', 'push', 'local'], required: true },
  title: { type: String, required: true },
  body: { type: String, required: true },
  data: { type: Object }, // Extra payload
  scheduledAt: { type: Date, default: null },
  sentAt: { type: Date, default: null },
  status: { 
    type: String, 
    enum: ['scheduled', 'sent', 'failed', 'cancelled', 'sending'], 
    default: 'scheduled',
    index: true
  },
  channelMeta: { // To store provider-specific info
    providerId: String, 
    providerStatus: String 
  },
}, { timestamps: true });

module.exports = mongoose.model('Notification', notificationSchema);