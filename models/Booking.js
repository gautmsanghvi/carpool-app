// models/Booking.js
const mongoose = require("mongoose");

const bookingSchema = new mongoose.Schema(
  {
    ride: { type: mongoose.Schema.Types.ObjectId, ref: "Ride", required: true },
    passenger: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    seatsBooked: { type: Number, default: 1 },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Booking", bookingSchema);
