const mongoose = require('mongoose');
const { Schema } = mongoose;

const notificationLogSchema = new Schema({
  notificationId: { type: Schema.Types.ObjectId, ref: 'Notification', required: true, index: true },
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  channel: { type: String, enum: ['sms', 'push'], required: true },
  providerResponse: { type: Object },
  attempt: { type: Number, default: 1 },
  success: { type: Boolean, required: true },
  error: { type: String, default: null },
}, { timestamps: true });

module.exports = mongoose.model('NotificationLog', notificationLogSchema);