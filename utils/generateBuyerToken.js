const jwt = require('jsonwebtoken');

const generateBuyerToken = (buyer) => {
    return jwt.sign({email : buyer.email} , process.env.JWT_BUYER_KEY);
}

module.exports.generateBuyerToken = generateBuyerToken;