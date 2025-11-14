const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');

const Ride = require('../models/Ride');
const Booking = require('../models/Booking');

/* =========================================================
   BOOK A RIDE
========================================================= */
router.post('/:rideId/book', auth, async (req, res) => {
    try {
        const rideId = req.params.rideId;
        const seatsBooked = Number(req.body.seatsBooked || 1);

        if (!rideId) return res.status(400).json({ msg: "Ride ID missing" });

        const ride = await Ride.findById(rideId).populate('driver');

        if (!ride) return res.status(404).json({ msg: "Ride not found" });

        if (ride.seats < seatsBooked) {
            return res.status(400).json({ msg: "Not enough seats available" });
        }

        // Reduce seats
        ride.seats -= seatsBooked;
        await ride.save();

        // Create booking
        const booking = new Booking({
            ride: ride._id,
            passenger: req.userId,   // FIXED
            seatsBooked
        });
        await booking.save();

        // Send driver data + ride info
        res.json({
            msg: "Ride booked successfully!",
            driver: {
                name: ride.driver.name,
                phone: ride.phone,
                time: ride.time,
                price: ride.price
            }
        });

    } catch (err) {
        console.log("❌ Booking Error:", err);
        res.status(500).json({ msg: "Server error while booking ride" });
    }
});


/* =========================================================
   GET MY BOOKINGS
========================================================= */
router.get('/my', auth, async (req, res) => {
    try {
        const bookings = await Booking.find({ passenger: req.userId })
            .populate({
                path: 'ride',
                populate: { path: 'driver', select: 'name email' }
            });

        res.json(bookings);

    } catch (err) {
        console.log("❌ Fetch Bookings Error:", err);
        res.status(500).json({ msg: "Server error" });
    }
});

module.exports = router;
