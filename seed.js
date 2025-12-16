const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

// Import models
const buyerModel = require('./models/buyer-model');
const sellerModel = require('./models/seller-model');
const productModel = require('./models/product-model');

// Connect to MongoDB
mongoose
    .connect(`${process.env.MONGODB_URL}/RM`)
    .then(() => {
        console.log("✅ Database Connected Successfully!");
        seedDatabase();
    })
    .catch((err) => {
        console.log("❌ Database Connection Error:", err.message);
        process.exit(1);
    });

// Function to create a placeholder image buffer
function createPlaceholderImage(text) {
    // Create a simple SVG image as Buffer
    const svg = `
    <svg width="400" height="400" xmlns="http://www.w3.org/2000/svg">
        <rect width="400" height="400" fill="#${Math.floor(Math.random()*16777215).toString(16)}"/>
        <text x="50%" y="50%" font-size="24" fill="white" text-anchor="middle" dy=".3em">${text}</text>
    </svg>
    `;
    return Buffer.from(svg);
}

// Function to create profile picture
function createProfilePicture(name) {
    const svg = `
    <svg width="200" height="200" xmlns="http://www.w3.org/2000/svg">
        <circle cx="100" cy="100" r="100" fill="#${Math.floor(Math.random()*16777215).toString(16)}"/>
        <text x="50%" y="50%" font-size="48" fill="white" text-anchor="middle" dy=".3em" font-weight="bold">${name[0].toUpperCase()}</text>
    </svg>
    `;
    return Buffer.from(svg);
}

async function seedDatabase() {
    try {
        console.log("\n🧹 Cleaning existing data...");
        
        // Clear existing data
        await buyerModel.deleteMany({});
        await sellerModel.deleteMany({});
        await productModel.deleteMany({});
        
        console.log("✅ Existing data cleared!\n");

        // Create Buyers
        console.log("👥 Creating sample buyers...");
        
        const buyer1Password = await bcrypt.hash('buyer123', 12);
        const buyer2Password = await bcrypt.hash('buyer123', 12);
        
        const buyer1 = await buyerModel.create({
            name: 'John Doe',
            email: 'buyer1@test.com',
            password: buyer1Password,
            profile_pic: createProfilePicture('John Doe'),
            wishlist: [],
            cart: [],
            orders: []
        });

        const buyer2 = await buyerModel.create({
            name: 'Jane Smith',
            email: 'buyer2@test.com',
            password: buyer2Password,
            profile_pic: createProfilePicture('Jane Smith'),
            wishlist: [],
            cart: [],
            orders: []
        });

        console.log("✅ Created 2 buyers");
        console.log(`   📧 buyer1@test.com / buyer123`);
        console.log(`   📧 buyer2@test.com / buyer123\n`);

        // Create Sellers
        console.log("🏪 Creating sample sellers...");
        
        const seller1Password = await bcrypt.hash('seller123', 12);
        const seller2Password = await bcrypt.hash('seller123', 12);
        
        const seller1 = await sellerModel.create({
            name: 'Mike\'s Electronics',
            email: 'seller1@test.com',
            password: seller1Password,
            profile_pic: createProfilePicture('Mike'),
            ssn: 123456789,
            products: []
        });

        const seller2 = await sellerModel.create({
            name: 'Sarah\'s Fashion Store',
            email: 'seller2@test.com',
            password: seller2Password,
            profile_pic: createProfilePicture('Sarah'),
            ssn: 987654321,
            products: []
        });

        console.log("✅ Created 2 sellers");
        console.log(`   📧 seller1@test.com / seller123`);
        console.log(`   📧 seller2@test.com / seller123\n`);

        // Create Products
        console.log("📦 Creating sample products...");

        const products = [
            {
                name: 'Wireless Headphones',
                quantity: 50,
                price: 79.99,
                discount: 10,
                image: createPlaceholderImage('Headphones'),
                sold_by: seller1._id
            },
            {
                name: 'Smart Watch',
                quantity: 30,
                price: 199.99,
                discount: 15,
                image: createPlaceholderImage('Smart Watch'),
                sold_by: seller1._id
            },
            {
                name: 'Laptop Stand',
                quantity: 100,
                price: 29.99,
                discount: 0,
                image: createPlaceholderImage('Laptop Stand'),
                sold_by: seller1._id
            },
            {
                name: 'USB-C Hub',
                quantity: 75,
                price: 45.99,
                discount: 5,
                image: createPlaceholderImage('USB Hub'),
                sold_by: seller1._id
            },
            {
                name: 'Cotton T-Shirt',
                quantity: 200,
                price: 24.99,
                discount: 20,
                image: createPlaceholderImage('T-Shirt'),
                sold_by: seller2._id
            },
            {
                name: 'Denim Jeans',
                quantity: 150,
                price: 59.99,
                discount: 25,
                image: createPlaceholderImage('Jeans'),
                sold_by: seller2._id
            },
            {
                name: 'Leather Jacket',
                quantity: 40,
                price: 149.99,
                discount: 30,
                image: createPlaceholderImage('Jacket'),
                sold_by: seller2._id
            },
            {
                name: 'Running Shoes',
                quantity: 80,
                price: 89.99,
                discount: 15,
                image: createPlaceholderImage('Shoes'),
                sold_by: seller2._id
            }
        ];

        const createdProducts = await productModel.insertMany(products);
        
        // Update sellers with their products
        const seller1Products = createdProducts.filter(p => p.sold_by.equals(seller1._id));
        const seller2Products = createdProducts.filter(p => p.sold_by.equals(seller2._id));
        
        seller1.products = seller1Products.map(p => p._id);
        seller2.products = seller2Products.map(p => p._id);
        
        await seller1.save();
        await seller2.save();

        console.log(`✅ Created ${createdProducts.length} products`);
        
        createdProducts.forEach((product, index) => {
            const finalPrice = (product.price - (product.price * product.discount / 100)).toFixed(2);
            console.log(`   ${index + 1}. ${product.name} - $${finalPrice} (${product.discount}% off)`);
        });

        // Add some products to buyer1's wishlist and cart
        console.log("\n🛒 Adding items to sample buyer carts and wishlists...");
        
        buyer1.wishlist = [createdProducts[0]._id, createdProducts[2]._id];
        buyer1.cart = [createdProducts[1]._id];
        await buyer1.save();
        
        buyer2.wishlist = [createdProducts[4]._id, createdProducts[6]._id];
        buyer2.cart = [createdProducts[5]._id, createdProducts[7]._id];
        await buyer2.save();

        console.log("✅ Sample wishlists and carts populated!\n");

        console.log("=" .repeat(60));
        console.log("🎉 DATABASE SEEDING COMPLETED SUCCESSFULLY! 🎉");
        console.log("=" .repeat(60));
        console.log("\n📊 Summary:");
        console.log(`   • ${await buyerModel.countDocuments()} Buyers created`);
        console.log(`   • ${await sellerModel.countDocuments()} Sellers created`);
        console.log(`   • ${await productModel.countDocuments()} Products created`);
        console.log("\n🔐 Login Credentials:");
        console.log("\n   BUYERS:");
        console.log("   ├─ Email: buyer1@test.com  | Password: buyer123");
        console.log("   └─ Email: buyer2@test.com  | Password: buyer123");
        console.log("\n   SELLERS:");
        console.log("   ├─ Email: seller1@test.com | Password: seller123");
        console.log("   └─ Email: seller2@test.com | Password: seller123");
        console.log("\n💡 Tip: Start the server with 'node app.js' and visit http://localhost:4000");
        console.log("=" .repeat(60) + "\n");

        process.exit(0);
    } catch (error) {
        console.error("\n❌ Error seeding database:", error.message);
        console.error(error);
        process.exit(1);
    }
}
