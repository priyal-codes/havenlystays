const express = require("express");
const router = express.Router({ mergeParams: true });
const wrapAsync = require("../utils/wrapAsync.js");
const { isLoggedIn, validateBooking, isBookingGuest } = require("../middleware.js");
const bookingController = require("../controllers/bookings.js");

// Reserve Stay Route
router.post(
    "/listings/:id/bookings",
    isLoggedIn,
    validateBooking,
    wrapAsync(bookingController.createBooking)
);

// User Trips / Bookings Dashboard
router.get(
    "/bookings",
    isLoggedIn,
    wrapAsync(bookingController.index)
);

// Cancel Booking Route
router.delete(
    "/bookings/:id",
    isLoggedIn,
    isBookingGuest,
    wrapAsync(bookingController.cancelBooking)
);

module.exports = router;
