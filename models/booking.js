const mongoose = require("mongoose");

const bookingSchema = new mongoose.Schema({
    hotelName: String,
    price: Number,
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    date: String
});

module.exports = mongoose.model("Booking", bookingSchema);
