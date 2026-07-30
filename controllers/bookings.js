const Booking = require("../models/booking.js");
const Listing = require("../models/listing.js");
const mongoose = require("mongoose");

module.exports.createBooking = async (req, res) => {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
        req.flash("error", "Listing requested does not exist!");
        return res.redirect("/");
    }

    const listing = await Listing.findById(id);
    if (!listing) {
        req.flash("error", "Listing requested does not exist!");
        return res.redirect("/");
    }

    // Host cannot book their own stay
    if (listing.owner && listing.owner.equals(req.user._id)) {
        req.flash("error", "Hosts cannot book their own stay!");
        return res.redirect(`/listings/${id}`);
    }

    const { checkIn, checkOut, guests } = req.body.booking;
    const checkInDate = new Date(checkIn);
    const checkOutDate = new Date(checkOut);

    if (isNaN(checkInDate.getTime()) || isNaN(checkOutDate.getTime())) {
        req.flash("error", "Please provide valid check-in and check-out dates.");
        return res.redirect(`/listings/${id}`);
    }

    const diffTime = checkOutDate.getTime() - checkInDate.getTime();
    const totalNights = Math.ceil(diffTime / (1000 * 3600 * 24));

    if (totalNights <= 0) {
        req.flash("error", "Check-out date must be after check-in date!");
        return res.redirect(`/listings/${id}`);
    }

    const nightlyPrice = listing.price || 0;
    const basePrice = nightlyPrice * totalNights;
    const gstAmount = Math.round(basePrice * 0.18);
    const totalPrice = basePrice + gstAmount;

    const newBooking = new Booking({
        listing: listing._id,
        user: req.user._id,
        checkIn: checkInDate,
        checkOut: checkOutDate,
        guests: Number(guests) || 1,
        totalNights,
        nightlyPrice,
        gstAmount,
        totalPrice,
        status: "Confirmed",
    });

    await newBooking.save();

    req.flash("success", "Reservation Confirmed! View your trip details below.");
    res.redirect("/bookings");
};

module.exports.index = async (req, res) => {
    const userBookings = await Booking.find({ user: req.user._id })
        .populate({
            path: "listing",
            populate: {
                path: "owner",
            },
        })
        .sort({ createdAt: -1 });

    res.render("bookings/index.ejs", { bookings: userBookings });
};

module.exports.cancelBooking = async (req, res) => {
    const { id } = req.params;
    const booking = await Booking.findById(id);

    if (!booking) {
        req.flash("error", "Booking requested does not exist!");
        return res.redirect("/bookings");
    }

    booking.status = "Cancelled";
    await booking.save();

    req.flash("success", "Reservation Cancelled.");
    res.redirect("/bookings");
};
