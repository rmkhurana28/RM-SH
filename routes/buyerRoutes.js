const express = require('express');
const router = express.Router();

// require buyer model
const buyerModel = require('../models/buyer-model');

// imporitng auth
const { buyerLogin , buyerSignup , buyerLogout} = require('../controllers/buyerAuth');

// importing other methods
const {
    buyerProfileUpdate,
    buyerAddToCart,
    buyerRemoveFromCart,
    buyerAddToWish,
    buyerRemoveFromWish,
    buyerBuy,
    buyerCartCheckout
} = require('../controllers/buyerHelp');

// checking if logged in
const isBuyerLoggedIn = require('../middlewares/isBuyerLoggedIn');

//importing mutter for images
const upload = require('../config/multer-config');
const productModel = require('../models/product-model');

router.get('/' , (req,res) => {
    res.redirect('/');
})

router.get('/signup' , (req,res) => {
    let error = req.flash("error");
    let success = req.flash('success');
    res.render('buyerViews/signup' , {error , success});
})
router.post('/signup' , upload.single('profile_pic') , buyerSignup)

router.get('/login' , (req,res) => {
    let success = req.flash('success');
    let error = req.flash('error');
    res.render('buyerViews/login' , {error , success});
})
router.post('/login' , buyerLogin);
router.get('/logout' , buyerLogout);

router.get('/home' , isBuyerLoggedIn , async (req,res) => {
    let success = req.flash('success');
    let error = req.flash('error');
    let products = await productModel.find();
    let buyer = await buyerModel.findOne({email : req.buyer.email})
    res.render('buyerViews/home' , {products , buyer , error , success});
})

router.get('/cart' , isBuyerLoggedIn , async (req,res) => {
    let success = req.flash('success');
    let error = req.flash('error');
    let buyer = await buyerModel.findOne({email : req.buyer.email}).populate('cart');
    res.render('buyerViews/cart' , {buyer , error , success});
})

router.get('/wishlist' , isBuyerLoggedIn , async (req,res) => {
    let success = req.flash('success');
    let error = req.flash('error');
    let buyer = await buyerModel.findOne({email : req.buyer.email}).populate('wishlist');
    res.render('buyerViews/wish' , {buyer , error , success});
})

router.get('/profile' , isBuyerLoggedIn , async (req,res) => {
    let success = req.flash('success');
    let error = req.flash('error');
    let buyer = await buyerModel.findOne({email : req.buyer.email}).populate('orders');
    res.render('buyerViews/profile' , {buyer , error , success});
})

router.get('/profile/edit' , isBuyerLoggedIn , async(req,res) => {
    let buyer = await buyerModel.findOne({email : req.buyer.email});
    res.render('buyerViews/profileEdit' , {buyer});
})
router.post('/profile/edit' , isBuyerLoggedIn , upload.single('profile_pic'), buyerProfileUpdate)

router.get('/products/:prod_id' , isBuyerLoggedIn , async (req,res) => {
    let success = req.flash('success');
    let error = req.flash('error');
    let prod = await productModel.findOne({_id : req.params.prod_id});
    let buyer = await buyerModel.findOne({email : req.buyer.email});
    res.render('buyerViews/productView.ejs' , {prod , buyer , error , success});
})

router.get('/products/:prod_id/cart/add' , isBuyerLoggedIn , buyerAddToCart);
router.get('/products/:prod_id/cart/remove' , isBuyerLoggedIn , buyerRemoveFromCart);

router.get('/products/:prod_id/wish/add' , isBuyerLoggedIn , buyerAddToWish);
router.get('/products/:prod_id/wish/remove' , isBuyerLoggedIn , buyerRemoveFromWish);

router.get('/products/:prod_id/buy' , isBuyerLoggedIn , buyerBuy);
router.get('/products/cart/checkout' , isBuyerLoggedIn , buyerCartCheckout);

module.exports = router;