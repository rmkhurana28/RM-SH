const sellerModel = require('../models/seller-model');
const productModel = require('../models/product-model');

module.exports.sellerAddProduct = async function(req,res) {
    try {
        let {name , quantity , price , discount} = req.body;

        let createdProduct = await productModel.create({
            name,
            quantity,
            price,
            discount,
            image : req.file.buffer,
            sold_by : req.seller._id
        })

        req.seller.products.push(createdProduct._id);
        req.seller.save();
        req.flash("success" , "Product Added Succesfully !!!");
        res.redirect('/sellers/profile');
    } catch(err) {
        console.log(err.message);
        req.flash("error" , "Something Went Wrong");
        return res.redirect('/sellers/profile');
    }
}

module.exports.sellerEditProduct = async function(req,res) {
    try {
        let {name , quantity , price , discount} = req.body;

        let updatedProduct = await productModel.findOneAndUpdate({_id : req.params.prod_id} , {
            name,
            quantity,
            price,
            discount,
            image : req.file.buffer,
        } , {new : true})

        req.flash("success" , "Product Updated Succesfully !!!");
        res.redirect(`/sellers/products/${req.params.prod_id}`);
    } catch(err) {
        console.log(err.message);
        req.flash("error" , "Something Went Wrong");
        return res.redirect('/sellers/profile');
    }
}

module.exports.sellerDeleteProduct = async function(req,res) {
    try {

        let deleteProduct = await productModel.findOneAndDelete({_id : req.params.prod_id});

        let seller = await sellerModel.findOneAndUpdate(
            {email : req.seller.email},
            {$pull : {products : deleteProduct._id}},
            {new : true}
        )

        req.flash("success" , "Product Deleted Succesfully !!!");
        res.redirect(`/sellers/profile`);
    } catch(err) {
        console.log(err.message);
        req.flash("error" , "Something Went Wrong");
        return res.redirect('/sellers/profile');
    }
}

module.exports.sellerProfileUpdate = async function (req,res) {
    try{
        let {name , ssn} = req.body;

        let seller = await sellerModel.findOneAndUpdate(
            {email : req.seller.email},
            {
                name,
                ssn,
                profile_pic : req.file.buffer
            },
            {new : true}
        );
        req.flash("success" , "Profile Updated Succesfully");
        return res.redirect('/sellers/profile');

    }  catch (err) {
        console.log(err.message);
        req.flash("error" , "Something Went Wrong");
        return res.redirect('/sellers/profile');
    }
}