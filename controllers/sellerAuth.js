const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser');

const sellerModel = require('../models/seller-model');

const { generateSellerToken} = require('../utils/generateSellerToken');

module.exports.sellerSignup = async function (req,res) {
    try{
        let {email , password , name , ssn} = req.body;

        let seller = await sellerModel.findOne({email});
        
        if(seller) {
            req.flash("error" , "Email Already registered");
            return res.redirect('/sellers/login')
        }


        bcrypt.hash(password, 12, async function(err, hash) {
            let seller = await sellerModel.create({
                name,
                email,                
                password : hash,
                ssn,
                profile_pic : req.file.buffer
            })

            let sellerToken = generateSellerToken(seller);
            res.cookie("seller" , sellerToken);
            req.flash("success" , "Registered Succesfully");
            return res.redirect('/sellers/profile');
        });
    }  catch (err) {
        console.log(err.message);
        req.flash("error" , "Something Went Wrong");
        return res.redirect('/sellers/login');
    }
}

module.exports.sellerLogin = async function (req,res) {
    try{
        let {email , password} = req.body;

        let seller = await sellerModel.findOne({email});

        if(!seller){
            req.flash("error" , "Invalid Email")
            return res.redirect('/sellers/login');
        }
        
        bcrypt.compare(password , seller.password , (err,result) => {
            if(!result){
                req.flash("error" , "Wrong Password")
                return res.redirect('/sellers/login');
            }                        

            let sellerToken = generateSellerToken(seller);
            res.cookie("seller" , sellerToken);
            req.flash("success" , "Logged In Succesfully");
            return res.redirect('/sellers/profile');
        })
    }  catch (err) {
        console.log(err.message);
        req.flash("error" , "Something Went Wrong");
        return res.redirect('/sellers/login');
    }
}

module.exports.sellerLogout = function (req,res) {
    try{
        res.cookie('seller' , "" , {expires : new Date(0)});
        req.flash("success" , "Logged Out Succesfully");
        res.redirect('/sellers/login');
    }  catch (err) {
        console.log(err.message);
        req.flash("error" , "Something Went Wrong");
        return res.redirect('/sellers/profile');
    }
}