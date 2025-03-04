const mongoose = require('mongoose');

const buyerSchema = mongoose.Schema({
    name : String,
    email : String,
    password : String,
    profile_pic : Buffer,
    wishlist : [{
        type : mongoose.Schema.Types.ObjectId,
        ref : "product"
    }],
    cart : [{
        type : mongoose.Schema.Types.ObjectId,
        ref : "product"
    }],
    orders : [{
        type : mongoose.Schema.Types.ObjectId,
        ref : "product"
    }]
})

module.exports = mongoose.model("buyer" , buyerSchema);