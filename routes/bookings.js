const express = require("express");
const router = express.Router();
const Booking = require("../models/Booking");
const Listing = require("../models/listing");

// ✅ बुकिंग प्रोसेसिंग रूट
router.post("/:id", async (req, res) => {
    try {
        const listing = await Listing.findById(req.params.id);
        if (!listing) {
            req.flash("error", "Hotel not found!");
            return res.redirect("/listings"); // ✅ होटल न मिले तो लिस्टिंग पेज पर भेजें
        }

        const newBooking = new Booking({
            hotelName: listing.title,
            price: listing.price,
            user: req.user ? req.user._id : null, // 👈 यूजर ID (अगर लॉगिन है)
            date: req.body.date
        });

        await newBooking.save();
        req.flash("success", "Booking successful!");
        res.redirect("/listings"); // ✅ बुकिंग के बाद "Listings" पेज पर Redirect करें
    } catch (err) {
        console.error(err);
        req.flash("error", "Something went wrong!");
        res.redirect("/listings"); // ✅ एरर हो तो भी लिस्टिंग पेज पर भेजें
    }
});

module.exports = router;
