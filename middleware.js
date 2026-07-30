const Listing = require("./models/listing.js");
const ExpressError = require("./utils/ExpressError.js");
const { listingSchema, reviewSchema, bookingSchema } = require("./schema.js");
const Review = require("./models/review.js");
const Booking = require("./models/booking.js");
const mongoose = require("mongoose");

module.exports.isLoggedIn = (req, res, next) => {
    if (!req.isAuthenticated()) {
        req.session.redirectUrl = req.originalUrl;
        req.flash("error", "You must be logged in first!");
        return res.redirect("/login");
    }
    next();
}

module.exports.saveRedirectUrl = (req, res, next) => {
    if(req.session.redirectUrl) {
        res.locals.redirectUrl = req.session.redirectUrl;
    }
    next();
}

module.exports.isOwner = async(req, res, next) => {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
        req.flash("error", "Listing you requested does not exist!");
        return res.redirect("/");
    }
    let listing = await Listing.findById(id);
    if(!listing) {
        req.flash("error", "Listing you requested does not exist!");
        return res.redirect("/");
    }
    if(!listing.owner || !listing.owner.equals(res.locals.currUser._id)) {
        req.flash("error", "You are not the owner of this listing!");
        return res.redirect(`/listings/${id}`);
    }
    next();
}

module.exports.validateListing = (req, res, next) => {
    let {error} = listingSchema.validate(req.body);
    if(error) {
        let errMsg = error.details.map((el) => el.message).join(",");
        throw new ExpressError(400, errMsg);
    } else {
        next();
    }
};

module.exports.validateReview = (req, res, next) => {
    let {error} = reviewSchema.validate(req.body);
    if(error) {
        let errMsg = error.details.map((el) => el.message).join(",");
        throw new ExpressError(400, errMsg);
    } else {
        next();
    }
};

module.exports.validateBooking = (req, res, next) => {
    let {error} = bookingSchema.validate(req.body);
    if(error) {
        let errMsg = error.details.map((el) => el.message).join(",");
        throw new ExpressError(400, errMsg);
    } else {
        next();
    }
};

module.exports.isReviewAuthor = async(req, res, next) => {
    const {id, reviewId} = req.params;
    if (!mongoose.Types.ObjectId.isValid(reviewId)) {
        req.flash("error", "Review does not exist!");
        return res.redirect(`/listings/${id}`);
    }
    let review = await Review.findById(reviewId);
    if(!review) {
        req.flash("error", "Review does not exist!");
        return res.redirect(`/listings/${id}`);
    }
    if(!review.author || !review.author.equals(res.locals.currUser._id)) {
        req.flash("error", "You are not the author of this review!");
        return res.redirect(`/listings/${id}`);
    }
    next();
};

module.exports.isBookingGuest = async(req, res, next) => {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
        req.flash("error", "Booking does not exist!");
        return res.redirect("/bookings");
    }
    let booking = await Booking.findById(id).populate("listing");
    if(!booking) {
        req.flash("error", "Booking does not exist!");
        return res.redirect("/bookings");
    }
    const isGuest = booking.user && booking.user.equals(res.locals.currUser._id);
    const isHost = booking.listing && booking.listing.owner && booking.listing.owner.equals(res.locals.currUser._id);
    
    if(!isGuest && !isHost) {
        req.flash("error", "You do not have permission to manage this booking!");
        return res.redirect("/bookings");
    }
    next();
};