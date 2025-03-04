const jwt = require('jsonwebtoken');
const sellerModel = require('../models/seller-model');

module.exports = async function (req,res,next) {
    if(!req.cookies.seller){
        req.flash("error" , "You need to be logged in !!!");
        return res.redirect('/sellers/login');
    }

    try{
        let sellerDecoded = jwt.verify(req.cookies.seller , process.env.JWT_SELLER_KEY);
        let seller = await sellerModel
                            .findOne({email : sellerDecoded.email})
                            .select("-password");

        req.seller = seller;
        next();
    } catch(err) {
        console.log(err.message);
    }
}
