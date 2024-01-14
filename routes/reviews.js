const express = require('express');
const router = express.Router({ mergeParams: true });
const Review = require('../models/review');
const Campground = require('../models/campground');
const ExpressError = require('../utils/ExpressError');

function catchAsync(fn) {
    return function (req, res, next){
        fn(req, res, next).catch(e => next(e));
    }
}

router.post('/', catchAsync(async (req, res) => {
    const campground = await Campground.findById(req.params.id);
    const review = new Review(req.body.review);
    campground.reviews.push(review);
    await review.save();
    await campground.save();
    req.flash('success' , 'Created new review');
    res.redirect(`/hotel/${campground._id}`);
}))

router.delete('/:reviewId', catchAsync(async (req, res) => {
    const { id, reviewId } = req.params;
    await Campground.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
    await Review.findByIdAndDelete(reviewId);
    res.redirect(`/hotel/${id}`);
}))

module.exports = router;