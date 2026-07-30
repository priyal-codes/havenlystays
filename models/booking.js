const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const bookingSchema = new Schema({
    listing: {
        type: Schema.Types.ObjectId,
        ref: "Listing",
        required: true,
    },
    user: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    checkIn: {
        type: Date,
        required: true,
    },
    checkOut: {
        type: Date,
        required: true,
    },
    guests: {
        type: Number,
        default: 1,
        min: 1,
    },
    totalNights: {
        type: Number,
        required: true,
    },
    nightlyPrice: {
        type: Number,
        required: true,
    },
    gstAmount: {
        type: Number,
        required: true,
    },
    totalPrice: {
        type: Number,
        required: true,
    },
    status: {
        type: String,
        enum: ["Confirmed", "Cancelled", "Completed"],
        default: "Confirmed",
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

bookingSchema.index({ user: 1 });
bookingSchema.index({ listing: 1 });

const Booking = mongoose.model("Booking", bookingSchema);
module.exports = Booking;
