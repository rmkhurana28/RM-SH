const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser');

const buyerModel = require('../models/buyer-model');

const { generateBuyerToken} = require('../utils/generateBuyerToken');

module.exports.buyerSignup = async function (req,res) {
    try{
        // res.send(req.file)
        let {email , password , name} = req.body;

        let buyer = await buyerModel.findOne({email});
        
        if(buyer) {
            console.log(buyer);
            req.flash("error" , "Email Already registered");
            return res.redirect('/buyers/login')
        }


        bcrypt.hash(password, 12, async function(err, hash) {
            let buyer = await buyerModel.create({
                name,
                email,                
                password : hash,
                profile_pic : req.file.buffer
            })

            let buyerToken = generateBuyerToken(buyer);
            res.cookie("buyer" , buyerToken);
            req.flash("success" , "Registered Succesfully");
            return res.redirect('/buyers/home');
        });
    }  catch (err) {
        console.log(err.message);
        req.flash("error" , "Something Went Wrong");
        return res.redirect('/buyers/signup');
    }
}

module.exports.buyerLogin = async function (req,res) {
    try{
        let {email , password} = req.body;

        let buyer = await buyerModel.findOne({email});

        if(!buyer){
            req.flash("error" , "Invalid Email")
            return res.redirect('/buyers/login');
        }
        
        bcrypt.compare(password , buyer.password , (err,result) => {
            if(!result){
                req.flash("error" , "Wrong Password")
                return res.redirect('/buyers/login');
            }                        

            let buyerToken = generateBuyerToken(buyer);
            res.cookie("buyer" , buyerToken);
            req.flash("success" , "Logged In Succesfully");
            return res.redirect('/buyers/home');
        })
    }  catch (err) {
        console.log(err.message);
        req.flash("error" , "Something Went Wrong");
        return res.redirect('/buyers/login');
    }
}

module.exports.buyerLogout = function (req,res) {
    try{
        res.cookie('buyer' , "" , {expires : new Date(0)});
        req.flash("success" , "Logged Out Succesfully");
        res.redirect('/buyers/login');
    }  catch (err) {
        console.log(err.message);
        req.flash("error" , "Something Went Wrong");
        return res.redirect('/buyers/home');
    }
}