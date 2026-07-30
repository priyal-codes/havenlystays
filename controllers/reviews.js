const Review = require("../models/review.js");
const Listing = require("../models/listing.js");
const mongoose = require("mongoose");

module.exports.createReview = async(req, res) => {
    let { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
        req.flash("error", "Listing you requested does not exist!");
        return res.redirect("/");
    }

    let listing = await Listing.findById(id);
    if (!listing) {
        req.flash("error", "Listing you requested does not exist!");
        return res.redirect("/");
    }

    let newReview = new Review(req.body.review);
    newReview.author = req.user._id;
    listing.reviews.push(newReview);

    await Promise.all([newReview.save(), listing.save()]);

    req.flash("success", "New Review Created!");
    res.redirect(`/listings/${listing._id}`);
};

module.exports.destroyReview = async(req, res) => {
    let { id, reviewId } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id) || !mongoose.Types.ObjectId.isValid(reviewId)) {
        req.flash("error", "Invalid request!");
        return res.redirect("/");
    }

    await Promise.all([
        Listing.findByIdAndUpdate(id, {$pull: {reviews: reviewId}}),
        Review.findByIdAndDelete(reviewId)
    ]);

    req.flash("success", "Review Deleted!");
    res.redirect(`/listings/${id}`);
};