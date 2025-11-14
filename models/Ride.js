const mongoose = require('mongoose');

const rideSchema = new mongoose.Schema({
  driver: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  source: { type: String, required: true },
  destination: { type: String, required: true },
  time: { type: String, required: true },
  seats: { type: Number, required: true },
  price: { type: Number, required: true },  // 💰
  phone: { type: String, required: true }   // 📞
}, { timestamps: true });

module.exports = mongoose.model('Ride', rideSchema);
