# RM Shopping Hub 🛍️

A full-stack e-commerce marketplace built with Node.js, Express, MongoDB, and EJS. This platform enables sellers to list products and buyers to browse, add items to cart/wishlist, and make purchases.

## 🌟 Features

### For Buyers
- **User Authentication**: Secure signup/login with JWT tokens
- **Product Browsing**: View all available products with images
- **Wishlist**: Save favorite products for later
- **Shopping Cart**: Add products and checkout
- **Order History**: Track purchased items
- **Profile Management**: Update profile information and picture

### For Sellers
- **Seller Dashboard**: Manage all products in one place
- **Product Management**: Add, edit, and delete products
- **Image Upload**: Upload product images
- **Profile Management**: Update seller information
- **Sales Tracking**: View all products sold

## 🚀 Tech Stack

- **Backend**: Node.js, Express.js
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: JWT (JSON Web Tokens) + bcrypt
- **Template Engine**: EJS
- **File Upload**: Multer
- **Session Management**: Express-session with connect-flash
- **Styling**: TailwindCSS

## 📋 Prerequisites

Before you begin, ensure you have the following installed:
- Node.js (v14 or higher)
- MongoDB (local or MongoDB Atlas account)
- Git

## 🛠️ Installation & Setup

### 1. Clone the Repository

```bash
git clone https://github.com/rmkhurana28/RM-SH.git
cd RM-SH
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Environment Configuration

Create a `.env` file in the root directory:

```bash
touch .env
```

Add the following environment variables to `.env`:

```env
# MongoDB Connection
MONGODB_URL=mongodb://localhost:27017
# OR for MongoDB Atlas:
# MONGODB_URL=mongodb+srv://username:password@cluster.mongodb.net

# JWT Secret Keys (use strong random strings)
JWT_BUYER_KEY=your_buyer_jwt_secret_key_here
JWT_SELLER_KEY=your_seller_jwt_secret_key_here

# Express Session Secret
EXPRESS_SESSION_SECRET=your_express_session_secret_here
```

**⚠️ Important**: Replace the placeholder values with your own secure random strings. You can generate secure keys using:

```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

### 4. Seed Database with Sample Data

To test the application with sample data (buyers, sellers, and products), run:

```bash
node seed.js
```

This will create:
- **2 Sample Buyers** with demo profiles
- **2 Sample Sellers** with demo profiles  
- **8 Sample Products** with images

**Sample Credentials** (after seeding):

*Buyers:*
- Email: `buyer1@test.com` | Password: `buyer123`
- Email: `buyer2@test.com` | Password: `buyer123`

*Sellers:*
- Email: `seller1@test.com` | Password: `seller123`
- Email: `seller2@test.com` | Password: `seller123`

### 5. Start the Application

```bash
node app.js
```

The server will start on `http://localhost:4000`

### 6. Access the Application

Open your browser and navigate to:
```
http://localhost:4000
```

## 📁 Project Structure

```
├── app.js                      # Main application entry point
├── package.json               # Dependencies and scripts
├── seed.js                    # Database seeding script
├── .env                       # Environment variables (not in repo)
├── config/
│   ├── mongoose-connection.js # MongoDB connection
│   └── multer-config.js       # File upload configuration
├── controllers/
│   ├── buyerAuth.js           # Buyer authentication logic
│   ├── buyerHelp.js           # Buyer helper functions
│   ├── sellerAuth.js          # Seller authentication logic
│   └── sellerHelp.js          # Seller helper functions
├── middlewares/
│   ├── isBuyerLoggedIn.js     # Buyer authentication middleware
│   └── isSellerLoggedIn.js    # Seller authentication middleware
├── models/
│   ├── buyer-model.js         # Buyer schema
│   ├── seller-model.js        # Seller schema
│   └── product-model.js       # Product schema
├── routes/
│   ├── index.js               # Home route
│   ├── buyerRoutes.js         # Buyer-related routes
│   └── sellerRoutes.js        # Seller-related routes
├── utils/
│   ├── generateBuyerToken.js  # JWT token generation for buyers
│   └── generateSellerToken.js # JWT token generation for sellers
├── views/
│   ├── main.ejs              # Landing page
│   ├── buyerViews/           # Buyer-side templates
│   │   ├── home.ejs
│   │   ├── cart.ejs
│   │   ├── wish.ejs
│   │   ├── profile.ejs
│   │   └── ...
│   └── sellerViews/          # Seller-side templates
│       ├── profile.ejs
│       ├── sell.ejs
│       ├── manageProduct.ejs
│       └── ...
└── public/
    ├── images/               # Static images
    ├── stylesheets/          # CSS files
    └── javascripts/          # Client-side JS
```

## 🎯 Usage Guide

### As a Buyer:
1. Navigate to the home page
2. Click "Looking to Buy Something?" 
3. Sign up or log in
4. Browse products on the home page
5. Click on a product to view details
6. Add products to cart or wishlist
7. Checkout from cart to complete purchase
8. View order history in your profile

### As a Seller:
1. Navigate to the home page
2. Click "Looking to Sell Something?"
3. Sign up or log in with SSN
4. Add new products from your dashboard
5. Manage existing products (edit/delete)
6. Update profile information

## 🔒 Security Features

- Password hashing using bcrypt (12 rounds)
- JWT-based authentication
- Secure session management
- CSRF protection via session secrets
- Separate authentication for buyers and sellers

## 🗄️ Database Schema

### Buyer Model
```javascript
{
  name: String,
  email: String,
  password: String (hashed),
  profile_pic: Buffer,
  wishlist: [Product IDs],
  cart: [Product IDs],
  orders: [Product IDs]
}
```

### Seller Model
```javascript
{
  name: String,
  email: String,
  password: String (hashed),
  profile_pic: Buffer,
  ssn: Number,
  products: [Product IDs]
}
```

### Product Model
```javascript
{
  name: String,
  quantity: Number,
  price: Number,
  discount: Number (default: 0),
  image: Buffer,
  sold_by: Seller ID,
  date: Date (default: Date.now)
}
```

## 🌐 Deployment

This application is configured for Vercel deployment (see `vercel.json`). You can also deploy to:
- Heroku
- Railway
- DigitalOcean
- AWS

**Note**: Make sure to set environment variables on your deployment platform.

## 🧪 Testing the Application

1. **Run the seed script** to populate test data:
   ```bash
   node seed.js
   ```

2. **Login with sample credentials** (see Step 4 in Installation)

3. **Test buyer flow**:
   - Browse products
   - Add to cart/wishlist
   - Update profile
   - Complete checkout

4. **Test seller flow**:
   - Add new products
   - Edit existing products
   - Delete products
   - Update profile

## 📝 API Endpoints

### Buyer Routes (`/buyers`)
- `GET /signup` - Buyer signup page
- `POST /signup` - Create buyer account
- `GET /login` - Buyer login page
- `POST /login` - Authenticate buyer
- `GET /logout` - Logout buyer
- `GET /home` - Browse products
- `GET /cart` - View cart
- `GET /wishlist` - View wishlist
- `GET /profile` - View profile
- `POST /profile/edit` - Update profile

### Seller Routes (`/sellers`)
- `GET /signup` - Seller signup page
- `POST /signup` - Create seller account
- `GET /login` - Seller login page
- `POST /login` - Authenticate seller
- `GET /logout` - Logout seller
- `GET /profile` - View seller dashboard
- `GET /sell` - Add product page
- `POST /sell` - Create product
- `POST /products/:id/edit` - Update product
- `GET /products/:id/delete` - Delete product

## 🤝 Contributing

This is a portfolio project. If you'd like to suggest improvements:
1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Open a Pull Request

## 📄 License

This project is licensed under the ISC License.

## 👨‍💻 Developer

**Ridham Khurana**
- GitHub: [@rmkhurana28](https://github.com/rmkhurana28)
- Repository: [RM-SH](https://github.com/rmkhurana28/RM-SH)

## 🐛 Troubleshooting

### MongoDB Connection Issues
- Ensure MongoDB is running locally: `sudo systemctl start mongod`
- Check MongoDB connection string in `.env`
- For Atlas, ensure IP is whitelisted

### Port Already in Use
- Change port in `app.js` (default: 4000)
- Kill existing process: `lsof -ti:4000 | xargs kill -9`

### Image Upload Issues
- Ensure `multer` is installed
- Check file size limits
- Verify image format (JPEG, PNG)

### JWT Errors
- Verify JWT secrets in `.env`
- Check token expiration
- Clear browser cookies

## 📸 Screenshots

### Home Page
![Home Page](Screenshots/home.png)

### Seller Features

**Seller Signup**
![Seller Signup](Screenshots/Ssignup.png)

**Seller Login**
![Seller Login](Screenshots/Slogin.png)

**Seller Dashboard**
![Seller Dashboard](Screenshots/Sdashboard.png)

**Seller Edit Profile**
![Seller Edit Profile](Screenshots/SeditProfile.png)

**Add Product**
![Add Product](Screenshots/SaddProd.png)

**Manage Product**
![Manage Product](Screenshots/SmanageProd.png)

**Edit Product**
![Edit Product](Screenshots/SeditProd.png)

### Buyer Features

**Buyer Signup**
![Buyer Signup](Screenshots/Bsignup.png)

**Buyer Login**
![Buyer Login](Screenshots/Blogin.png)

**Buyer Home**
![Buyer Home](Screenshots/Bdash.png)

**Product Details**
![Product Details](Screenshots/Bprod.png)

**Buyer Profile**
![Buyer Profile](Screenshots/Bprofile.png)

**Edit Profile**
![Edit Profile](Screenshots/BeditProfile.png)

**Shopping Cart**
![Shopping Cart](Screenshots/Bcart.png)

**Wishlist**
![Wishlist](Screenshots/Bwish.png)

---

**Made by ♠️ Ridham Khurana**

*If you find this project helpful, please consider giving it a ⭐ on GitHub!*
