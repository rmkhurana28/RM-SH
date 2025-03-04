const jwt = require('jsonwebtoken');
const buyerModel = require('../models/buyer-model');

module.exports = async function (req,res,next) {
    if(!req.cookies.buyer){
        req.flash("error" , "You need to be logged in !!!");
        return res.redirect('/buyers/login');
    }

    try{
        let buyerDecoded = jwt.verify(req.cookies.buyer , process.env.JWT_BUYER_KEY);
        let buyer = await buyerModel
                            .findOne({email : buyerDecoded.email})
                            .select("-password");
        req.buyer = buyer;
        next();
    } catch(err) {
        console.log(err.message);
    }
}
