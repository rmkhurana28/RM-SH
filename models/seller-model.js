const mongoose = require('mongoose');

const sellerSchema = mongoose.Schema({
    name : String,
    email : String,
    password : String,
    profile_pic : Buffer,
    ssn : Number,
    products : [{
        type : mongoose.Schema.Types.ObjectId,
        ref : "product"
    }]
})

module.exports = mongoose.model("seller" , sellerSchema);