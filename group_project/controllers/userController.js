const User = require('../models/userModel');

module.exports = {
    // Render Registration Page
    getRegisterPage: (req, res) => {
        res.render('users/register');
    },

    // Handle User Registration
    registerUser: async (req, res) => {
        const { username, email, password } = req.body;

        try {
            // Validate required fields
            if (!username || !email || !password) {
                return res.status(400).send('All fields are required');
            }

            // Check if user already exists
            const existingUser = await User.findOne({ email });
            if (existingUser) {
                return res.status(400).send('User already exists with this email');
            }

            // Create and save a new user
            const newUser = await User.create({ username, email, password });
            res.redirect('/users/login'); // Redirect to login after successful registration
        } catch (error) {
            console.error('Error registering user:', error);
            res.status(500).send('Internal server error');
        }
    },

    // Render Login Page
    getLoginPage: (req, res) => {
        res.render('users/login');
    },

    // Handle User Login
    loginUser: async (req, res) => {
        const { email, password } = req.body;

        try {
            // Validate required fields
            if (!email || !password) {
                return res.status(400).send('All fields are required');
            }

            // Find user by email
            const user = await User.findOne({ email });
            if (!user || user.password !== password) {
                return res.status(401).send('Invalid credentials');
            }

            // Save user ID in session
            req.session.userId = user._id;

            res.redirect('/account'); // Redirect to account page after login
        } catch (error) {
            console.error('Error logging in user:', error);
            res.status(500).send('Internal server error');
        }
    },

    // Handle User Logout
    logoutUser: (req, res) => {
        req.session.destroy(() => {
            res.redirect('/users/login'); // Redirect to login after logout
        });
    },

    // Render User Account Page
    getAccountPage: async (req, res) => {
        try {
            const user = await User.findById(req.session.userId);
            if (!user) {
                return res.redirect('/users/login');
            }
            res.render('users/profile', { user });
        } catch (error) {
            console.error('Error loading account page:', error);
            res.status(500).send('Internal server error');
        }
    }
};
