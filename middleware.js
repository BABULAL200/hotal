// const listing = require("./models/listing");

// module.exports.isLoggedIn = (req, res, next) => {
//     if (!req.isAuthenticated()) {
//         req.session.redirectUrl = req.originalUrl;
//         req.flash("error", "You must be logged in to create listing!");
//         return res.redirect("/login");
//     }
//     next();
// };

// module.exports.saveRedirectUrl = (req, res, next) => {
//     if (req.session.redirectUrl) {
//         res.locals.redirectUrl = req.session.redirectUrl;
//     }
//     next();
// };

// module.exports.isOwner = async (req, res, next) => {
//     let { id } = req.params;
//     const listing = await Listing.findById(id);
//     if (!listing.owner.equals(res.locals.currUser._id)) {
//         req.flash("error", "You don't have permission to edit");
//         return res.redirect(`/listings/${id}`);
//     }
//     next();
// };

const Listing = require("./models/listing"); // ✅ Correct import
const Review = require("./models/review");

// Middleware to check if user is logged in
module.exports.isLoggedIn = (req, res, next) => {
    if (!req.isAuthenticated()) {
        req.session.redirectUrl = req.originalUrl;
        req.flash("error", "You must be logged in to access this feature!");
        return res.redirect("/login");
    }
    next();
};

// Middleware to save the redirect URL
module.exports.saveRedirectUrl = (req, res, next) => {
    if (req.session.redirectUrl) {
        res.locals.redirectUrl = req.session.redirectUrl;
    }
    next();
};

// Middleware to check if the logged-in user is the owner of the listing
module.exports.isOwner = async (req, res, next) => {
    try {
        let { id } = req.params;

        // ✅ Validate ObjectId before querying to prevent errors
        const mongoose = require("mongoose");
        if (!mongoose.Types.ObjectId.isValid(id)) {
            req.flash("error", "Invalid listing ID format!");
            return res.redirect("/listings");
        }

        const listing = await Listing.findById(id);
        
        if (!listing) {
            req.flash("error", "Listing not found!");
            return res.redirect("/listings");
        }

        // ✅ Check if user is logged in and owns the listing
        if (!res.locals.currUser || !listing.owner.equals(res.locals.currUser._id)) {
            req.flash("error", "You don't have permission to edit this listing!");
            return res.redirect(`/listings/${id}`);
        }

        next();
    } catch (error) {
        console.error("Error in isOwner middleware:", error);
        req.flash("error", "Something went wrong. Please try again!");
        res.redirect("/listings");
    }
};

module.exports.isReviewAuthor = async (req, res, next) => {
    let { id, reviewId } = req.params;
    let review = await Review.findById(reviewId);
    if (!review.author.equals(res.locals.currUser._id)) {
      req.flash("error", "You are not the author of this review");
      return res.redirect(`/listings/${id}`);
    }
    next();
  };
  