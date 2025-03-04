const buyerModel = require('../models/buyer-model');
const productModel = require('../models/product-model');

const mongoose = require('mongoose')

module.exports.buyerProfileUpdate = async function (req,res) {
    try{
        let {name} = req.body;

        let buyer = await buyerModel.findOneAndUpdate(
            {email : req.buyer.email},
            {
                name,
                profile_pic : req.file.buffer
            },
            {new : true}
        );
        req.flash("success" , "Profile Updated Succesfully");
        return res.redirect('/buyers/profile');

    }  catch (err) {
        console.log(err.message);
        req.flash("error" , "Something Went Wrong");
        return res.redirect('/buyers/home');
    }
}

module.exports.buyerAddToCart = async function(req,res) {
    try {
        let buyer = await buyerModel.findOneAndUpdate(
            {email : req.buyer.email},
            {
                $push : {cart : req.params.prod_id}
            },
            {new : true}
        )
        req.flash("success" , "Item Added to Cart Succesfully");
        return res.redirect(`/buyers/products/${req.params.prod_id}`);
    } catch(err) {
        console.log(err.message);
        req.flash("error" , "Something Went Wrong");
        return res.redirect('/buyers/home');
    }
}

module.exports.buyerRemoveFromCart = async function(req,res) {
    try {
        let buyer = await buyerModel.findOneAndUpdate(
            {email : req.buyer.email},
            {
                $pull : {cart : req.params.prod_id}
            },
            {new : true}
        )
        req.flash("success" , "Item Removed from Cart Succesfully");
        return res.redirect(`/buyers/products/${req.params.prod_id}`);
    } catch(err) {
        console.log(err.message);
        req.flash("error" , "Something Went Wrong");
        return res.redirect('/buyers/home');
    }
}

module.exports.buyerAddToWish = async function(req,res) {
    try {
        let buyer = await buyerModel.findOneAndUpdate(
            {email : req.buyer.email},
            {
                $push : {wishlist : req.params.prod_id}
            },
            {new : true}
        )
        req.flash("success" , "Item Added to Wishlist Succesfully");
        return res.redirect(`/buyers/products/${req.params.prod_id}`);
    } catch(err) {
        console.log(err.message);
        req.flash("error" , "Something Went Wrong");
        return res.redirect('/buyers/home');
    }
}

module.exports.buyerRemoveFromWish = async function(req,res) {
    try {
        let buyer = await buyerModel.findOneAndUpdate(
            {email : req.buyer.email},
            {
                $pull : {wishlist : req.params.prod_id}
            },
            {new : true}
        )
        req.flash("success" , "Item Removed from Wishlist Succesfully");
        return res.redirect(`/buyers/products/${req.params.prod_id}`);
    } catch(err) {
        console.log(err.message);
        req.flash("error" , "Something Went Wrong");
        return res.redirect('/buyers/home');
    }
}

module.exports.buyerBuy = async function(req,res) {
    try {
        let prod = await productModel.findOneAndUpdate(
            {_id : req.params.prod_id},
            {
                $inc : {quantity : -1}
            },{new : true}
        )

        let buyer = await buyerModel.findOneAndUpdate(
            {email : req.buyer.email},
            {                
                $pull : { cart : req.params.prod_id},
                $push  : {orders : req.params.prod_id}
            },
            {new : true}
        )

        req.flash("success" , "Transaction Succesfull");
        return res.redirect('/buyers/profile');
    } catch(err) {
        console.log(err.message);
        req.flash("error" , "Something Went Wrong");
        return res.redirect('/buyers/home');
    }
}

module.exports.buyerCartCheckout = async function(req,res) {
    try {        

        let buyer = await buyerModel.findOne({email : req.buyer.email});

        buyer.cart.forEach(async function(prod) {
            console.log(prod);
            console.log(typeof(prod));
            await buyerModel.updateOne(
                {email : buyer.email},
                {       
                    $pull : {cart : prod._id},
                    $push  : {orders : prod._id}
                },
                {new : true}
            )
        })

        req.flash("success" , "Transaction Succesfully Completed");
        return res.redirect('/buyers/profile');
    } catch(err) {
        console.log(err.message);
        req.flash("error" , "Something Went Wrong");
        return res.redirect('/buyers/home');
    }
}