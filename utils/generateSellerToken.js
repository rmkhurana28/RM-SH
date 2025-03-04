const jwt = require('jsonwebtoken');

const generateSellerToken = (seller) => {
    return jwt.sign({email : seller.email} , process.env.JWT_SELLER_KEY);
}

module.exports.generateSellerToken = generateSellerToken;