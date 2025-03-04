const mongoose = require('mongoose');

const productSchema = mongoose.Schema({
    name : String,
    quantity : Number,
    sold_by : {
        type : mongoose.Schema.Types.ObjectId,
        ref : "seller"
    },
    price : Number,
    discount : {
        type : Number,
        default : 0
    },
    date : {
        type : Date,
        default : Date.now
    },
    image : Buffer
})

module.exports = mongoose.model("product" , productSchema);