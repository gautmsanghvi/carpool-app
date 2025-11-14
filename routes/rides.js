const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');

const Ride = require('../models/Ride');

/* =========================================================
   OFFER RIDE
========================================================= */
router.post('/offer', auth, async (req, res) => {
    try {
        const { source, destination, time, seats, price, phone } = req.body;

        const ride = new Ride({
            source,
            destination,
            time,
            seats: Number(seats),   // FIXED
            price: Number(price),   // FIXED
            phone,
            driver: req.userId      // FIXED
        });

        await ride.save();
        res.json({ msg: "Ride offered successfully!" });

    } catch (err) {
        console.log("❌ Offer Ride Error:", err);
        res.status(500).json({ msg: "Error offering ride" });
    }
});


/* =========================================================
   SEARCH RIDE
========================================================= */
router.get('/search', async (req, res) => {
    try {
        const { source = "", destination = "" } = req.query;

        const rides = await Ride.find({
            source: { $regex: source, $options: 'i' },
            destination: { $regex: destination, $options: 'i' }
        }).populate('driver', 'name email');

        res.json(rides);

    } catch (err) {
        console.log("❌ Search Ride Error:", err);
        res.status(500).json({ msg: "Error searching rides" });
    }
});


/* =========================================================
   MY OFFERED RIDES
========================================================= */
router.get('/myrides', auth, async (req, res) => {
    try {
        const rides = await Ride.find({ driver: req.userId })
            .populate('driver', 'name email');

        res.json(rides);

    } catch (err) {
        console.log("❌ My Rides Error:", err);
        res.status(500).json({ msg: "Error loading rides" });
    }
});

module.exports = router;
