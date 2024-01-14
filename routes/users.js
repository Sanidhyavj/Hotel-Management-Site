const express = require('express');
const router = express.Router();
const passport = require('passport');
const User = require('../models/user');

function catchAsync(fn) {
    return function (req, res, next){
        fn(req, res, next).catch(e => next(e));
    }
}

router.get('/register', (req, res) => {
    res.render('users/register');
});

router.post('/register', catchAsync(async (req, res, next) => {
    try {
        const { email, username, password } = req.body;
        const user = new User({ email, username });
        const registeredUser = await User.register(user, password); //hashes the pw
        req.login(registeredUser, err => {
            if (err) return next(err);
            req.flash('success', 'Welcome to Yelp Camp!');
            res.redirect('/hotel');
        })
    } catch (e) {
        req.flash('error', e.message);
        res.redirect('register');
    }
}));

router.get('/login', (req, res) => {
    res.render('users/login');
})
//pw.authenticate  
router.post('/login', passport.authenticate('local', { failureFlash: true, failureRedirect: '/login' }), (req, res) => {
    req.flash('success', 'welcome back!');
    const redirectUrl = req.session.returnTo || '/hotel';
    delete req.session.returnTo;
    res.redirect(redirectUrl);
})

router.get('/logout', (req, res, next) => {
    req.logout(function (err) {
        if (err) {
            return next(err);
        }
        req.flash('success', 'Goodbye!');
        res.redirect('/hotel');
    });
}); 

router.get('/logout', (req, res, next) => {
    req.logout(function (err) { //callback required for logout
        if (err) {
            return next(err);
        }
        req.flash('success', 'Goodbye!');
        res.redirect('/campgrounds');
    });
}); 

module.exports = router;