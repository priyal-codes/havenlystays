const User = require("../models/user");

module.exports.renderSignupForm = (req, res) => {
    res.render("users/signup.ejs");
};

module.exports.signup = async(req, res, next) => {
    try{
    let {username, email, password} = req.body;
    const newUser = new User({ email, username });
    const registerUser = await User.register(newUser, password);
    console.log(registerUser);
    req.login(registerUser, (err) => {
        if(err) {
            return next(err);
        }
          req.flash("success", "Welcome to Havenly Stays!");
          res.redirect("/listings");
    });
    } catch(error) {
        req.flash("error", error.message);
        res.redirect("/signup");
    }
};

module.exports.renderLoginForm = (req, res) => {
    res.render("users/login.ejs");
};

module.exports.login = async(req, res) => {
    req.flash("success", "Welcome back to Havenly Stays!");
    let redirectUrl = res.locals.redirectUrl || "/listings";
    res.redirect(redirectUrl);
};

module.exports.logout = (req, res, next) => {
    req.logout((err) => {
        if(err) {
            return next(err);
        }
        req.flash("success", "you are logged out!");
        res.redirect("/listings");
    })
};

module.exports.toggleWishlist = async (req, res) => {
    const mongoose = require("mongoose");
    let { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ success: false, message: "Invalid Listing ID" });
    }

    const user = await User.findById(req.user._id);
    if (!user) {
        return res.status(404).json({ success: false, message: "User not found" });
    }

    const index = user.wishlist.indexOf(id);
    let isSaved = false;

    if (index > -1) {
        user.wishlist.splice(index, 1);
        isSaved = false;
    } else {
        user.wishlist.push(id);
        isSaved = true;
    }

    await user.save();

    if (req.xhr || (req.headers.accept && req.headers.accept.indexOf('json') > -1)) {
        return res.json({ success: true, saved: isSaved, message: isSaved ? "Saved to Wishlist" : "Removed from Wishlist" });
    }

    req.flash("success", isSaved ? "Saved to Wishlist!" : "Removed from Wishlist!");
    res.redirect(req.get("referer") || "/listings");
};

module.exports.renderWishlist = async (req, res) => {
    const user = await User.findById(req.user._id).populate({
        path: "wishlist",
        populate: { path: "owner" }
    });
    res.render("users/wishlist.ejs", { wishlist: user.wishlist });
};

module.exports.renderProfile = async (req, res) => {
    const Listing = require("../models/listing");
    const Booking = require("../models/booking");

    const user = await User.findById(req.user._id).populate("wishlist");
    const userListings = await Listing.find({ owner: req.user._id });
    const userBookings = await Booking.find({ user: req.user._id }).populate("listing");

    res.render("users/profile.ejs", {
        user,
        userListings,
        userBookings
    });
};