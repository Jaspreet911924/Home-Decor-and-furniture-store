const express = require('express');
const mongoose = require('mongoose');
const session = require('express-session');
const bodyParser = require('body-parser');
const path = require('path');

// Models
const User = require('./models/userModel');
const Product = require('./models/productModel');

// Initialize App
const app = express();

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
// Serve static files from the 'public' folder
app.use(express.static(path.join(__dirname, 'public')));
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Session Configuration
app.use(
    session({
        secret: 'your_secret_key',
        resave: false,
        saveUninitialized: true,
    })
);

// Connect to MongoDB
mongoose.connect('mongodb://127.0.0.1:27017/home_decor_store', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});
mongoose.connection.on('connected', () => console.log('Connected to MongoDB'));
mongoose.connection.on('error', (err) => console.error('MongoDB connection error:', err));

// Authentication Middleware
const authenticate = (req, res, next) => {
    if (!req.session.userId) {
        return res.redirect('/users/login');
    }
    next();
};

// Routes

// Home Page
app.get('/', async (req, res) => {
    try {
        const products = await Product.find();
        res.render('home', { products });
    } catch (error) {
        res.status(500).send('Error loading products');
    }
});

// User Registration
app.get('/users/register', (req, res) => res.render('users/register'));

app.post('/users/register', async (req, res) => {
    const { username, email, password } = req.body;
    try {
        await User.create({ username, email, password }); // Plaintext password stored for simplicity
        res.redirect('/users/login');
    } catch (error) {
        res.status(500).send('Error registering user');
    }
});

// User Login
app.get('/users/login', (req, res) => res.render('users/login'));

app.post('/users/login', async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await User.findOne({ email, password }); // Matching plaintext password
        if (!user) return res.status(401).send('Invalid credentials');
        req.session.userId = user._id; // Store user ID in session
        res.redirect('/account');
    } catch (error) {
        res.status(500).send('Error logging in');
    }
});

// User Account
app.get('/account', authenticate, async (req, res) => {
    try {
        const user = await User.findById(req.session.userId);
        const products = await Product.find({ userId: req.session.userId });
        res.render('users/profile', { user, products });
    } catch (error) {
        res.status(500).send('Error loading account');
    }
});

// Logout
app.get('/logout', (req, res) => {
    req.session.destroy(() => {
        res.redirect('/');
    });
});

app.get('/products', async (req, res) => {
    try {
        const products = await Product.find(); // Fetch all products from the database
        res.render('products/products', { products }); // Render the products page
    } catch (error) {
        res.status(500).send('Error fetching products');
    }
});



// Add Product (GET & POST)
app.get('/products/add', authenticate, (req, res) => {
    res.render('products/addProduct');
});

app.post('/products/add', authenticate, async (req, res) => {
    const { name, category, price, description, stock } = req.body;
    try {
        await Product.create({
            name,
            category,
            price,
            description,
            stock,
            userId: req.session.userId, // Store user ID to associate the product
        });
        res.redirect('/products'); // Redirect to products list
    } catch (error) {
        console.error(error);
        res.status(500).send('Error adding product');
    }
});


// Edit Product
app.get('/products/edit/:id', authenticate, async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        res.render('products/editProduct', { product });
    } catch (error) {
        res.status(500).send('Error loading product');
    }
});

app.post('/products/edit/:id', authenticate, async (req, res) => {
    const { name, category, price, description, stock } = req.body;
    try {
        console.log('Editing product with ID:', req.params.id);
        console.log('Request body:', req.body);

        const updatedProduct = await Product.findByIdAndUpdate(req.params.id, {
            name,
            category,
            price,
            description,
            stock,
        });

        if (!updatedProduct) {
            console.log('Product not found');
            return res.status(404).send('Product not found');
        }

        console.log('Updated product:', updatedProduct);
        res.redirect('/products');
    } catch (error) {
        console.error('Error editing product:', error);
        res.status(500).send('Error editing product');
    }
});


// Delete Product
app.post('/products/delete/:id', authenticate, async (req, res) => {
    try {
        await Product.findByIdAndDelete(req.params.id);
        res.redirect('/products');
    } catch (error) {
        res.status(500).send('Error deleting product');
    }
});

//order page 
app.get('/products/order', authenticate, (req, res) => {
    res.render('products/order'); // Render the order confirmation page
});

app.post('/products/order', authenticate, async (req, res) => {
    try {
        // Mark all products for the logged-in user as ordered
        await Product.updateMany(
            { userId: req.session.userId, isOrdered: false },
            { $set: { isOrdered: true } }
        );

        // Redirect to the order success page
        res.redirect('/products/order');
    } catch (error) {
        console.error('Error placing order:', error);
        res.status(500).send('Internal server error');
    }
});


// Start Server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
