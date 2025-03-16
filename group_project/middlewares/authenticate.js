// Authentication Middleware
const authenticate = (req, res, next) => {
    try {
        // Check if userId exists in the session
        if (!req.session || !req.session.userId) {
            console.warn('User is not authenticated. Redirecting to login.');
            return res.redirect('/users/login'); // Redirect to login if not authenticated
        }
        next(); // Proceed to the next middleware/route handler
    } catch (error) {
        console.error('Authentication Error:', error.message);
        res.redirect('/users/login'); // Redirect on any error
    }
};

module.exports = authenticate;
