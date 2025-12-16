const express = require('express');
const app = express()
const port = 4000;

const path = require('path');

const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser');

// middlewares
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({extended : true}));
app.use(express.static(path.join(__dirname , "public")));

require('dotenv').config();

// setting up view-engine
app.set("view engine" , "ejs");

app.set("views", path.join(__dirname, "views"));

// using req.flash
const expressSession = require('express-session');
const flash = require('connect-flash');

app.use(
    expressSession({
        resave : false,
        saveUninitialized : false,
        secret : process.env.EXPRESS_SESSION_SECRET,
    })
)
app.use(flash());


// importing database
const db = require('./config/mongoose-connection')

//importing all models
const sellerModel = require('./models/seller-model');
const buyerModel = require('./models/buyer-model');

// importing all routes
const sellersRoutes = require('./routes/sellerRoutes');
const buyersRoutes = require('./routes/buyerRoutes');
const index = require('./routes/index');

// setting up all routes
app.use('/' , index);
app.use('/sellers' , sellersRoutes);
app.use('/buyers' , buyersRoutes);

app.listen(port);