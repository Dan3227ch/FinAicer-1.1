const mongoose = require('mongoose');
const { Schema } = mongoose;

const userSchema = new Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  // Password is not required for users signing in with Google
  password: { type: String },
  // firebaseUid will be stored for users signing in with Google
  firebaseUid: { type: String, unique: true, sparse: true },
  registrationDate: { type: Date, default: Date.now },
  notificationPreferences: {
    pushEnabled: { type: Boolean, default: true },
    smsEnabled: { type: Boolean, default: false },
    pushToken: { type: String }, // FCM token
    phoneNumber: { type: String },
    isVerified: { type: Boolean, default: false },
    notifications: {
        dailyUpdates: { type: Boolean, default: true },
        weeklyReports: { type: Boolean, default: true },
        paymentReminders: { type: Boolean, default: false },
        budgetAlerts: { type: Boolean, default: true },
        largeTransactions: { type: Boolean, default: true },
        monthlyGoals: { type: Boolean, default: true },
    },
    dndEnabled: { type: Boolean, default: false },
  }
});

module.exports = mongoose.model('User', userSchema);