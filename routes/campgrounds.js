const express = require('express');
const router = express.Router();
const ExpressError = require('../utils/ExpressError');
const Campground = require('../models/campground');
const { isLoggedIn } = require('../middleware');

function catchAsync(fn) {
    return function (req, res, next){
        fn(req, res, next).catch(e => next(e));
    }
}


router.get('/', catchAsync(async (req,res) => {
    const campgrounds = await Campground.find({});
    res.render('campgrounds/index' , {campgrounds})
}))

router.get('/new' , isLoggedIn , (req,res) => {
    res.render('campgrounds/new');
})

router.post('/' , isLoggedIn , catchAsync(async(req,res) => {
    const campground = new Campground(req.body.campground);
    await campground.save();
    req.flash('success', 'Successfully made a new Hotel!');
    res.redirect(`/hotel/${campground._id}`) ;
}))

router.get('/:id' , catchAsync(async (req,res) => {
    const campground = await Campground.findById(req.params.id).populate('reviews');
    res.render('campgrounds/show' , { campground });
}))

router.get('/:id/edit', isLoggedIn ,catchAsync(async (req, res) => {
    const campground = await Campground.findById(req.params.id)
    res.render('campgrounds/edit', { campground });
}))

router.put('/:id', isLoggedIn, catchAsync(async (req, res) => {
    const { id } = req.params;
    const campground = await Campground.findByIdAndUpdate(id, { ...req.body.campground });
    req.flash('success' , 'Successfully updated Hotel !')
    res.redirect(`/hotel/${campground._id}`)
}));

router.delete('/:id',isLoggedIn , catchAsync(async (req, res) => {
    const { id } = req.params;
    await Campground.findByIdAndDelete(id);
    res.redirect('/hotel');
}))

module.exports = router;