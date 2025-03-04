const express = require('express');
const router = express.Router();

const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser');
router.use(cookieParser())

// checking if logged in
const isSellerLoggedIn = require('../middlewares/isSellerLoggedIn');

// require buyer model
const buyerModel = require('../models/buyer-model');

// imporitng auth
const { sellerLogin , sellerSignup , sellerLogout} = require('../controllers/sellerAuth');

// importing other methods
const {
    sellerAddProduct,
    sellerEditProduct,
    sellerDeleteProduct,
    sellerProfileUpdate
} = require('../controllers/sellerHelp');

//importing mutter for images
const upload = require('../config/multer-config');

const sellerModel = require('../models/seller-model');
const productModel = require('../models/product-model');

router.get('/' , (req,res) => {
    res.redirect('/');
})

router.get('/signup' , (req,res) => {
    let error = req.flash('error');
    let success = req.flash('success');
    res.render('sellerViews/signup' , {error , success});
})
router.post('/signup' , upload.single('profile_pic'), sellerSignup)

router.get('/login' , (req,res) => {
    let success = req.flash('success');
    let error = req.flash('error');
    res.render('sellerViews/login' , {error , success});
})
router.post('/login' , sellerLogin);
router.get('/logout' , sellerLogout);

router.get('/profile' , isSellerLoggedIn , async (req,res) => {
    let success = req.flash('success');
    let error = req.flash('error');
    let seller = await sellerModel.findOne({email : req.seller.email}).populate('products');
    res.render('sellerViews/profile' , {seller , error , success});
});

router.get('/profile/edit' , isSellerLoggedIn , async(req,res) => {
    let seller = await sellerModel.findOne({email : req.seller.email});
    res.render('sellerViews/profileEdit' , {seller});
})
router.post('/profile/edit' , isSellerLoggedIn ,upload.single('profile_pic'), sellerProfileUpdate)

router.get('/sell' , isSellerLoggedIn , (req,res) => {
    res.render('sellerViews/sell');
})
router.post('/sell' , isSellerLoggedIn , upload.single('image') , sellerAddProduct);

router.get('/products/:prod_id' , isSellerLoggedIn , async (req,res) => {
    let success = req.flash('success');
    let error = req.flash('error');
    let prod = await productModel.findOne({_id : req.params.prod_id}).populate('sold_by');
    res.render('sellerViews/manageProduct' , {prod , error , success});
})

router.get('/products/:prod_id/edit' , isSellerLoggedIn , async (req,res) => {
    let success = req.flash('success');
    let error = req.flash('error');
    let prod = await productModel.findOne({_id : req.params.prod_id});
    // console.log(prod);
    res.render('sellerViews/editProduct' , {prod , error , success});
})
router.post('/products/:prod_id/edit' , isSellerLoggedIn , upload.single('image') , sellerEditProduct);

router.get('/products/:prod_id/delete' , isSellerLoggedIn , sellerDeleteProduct);

module.exports = router;