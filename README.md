# Home-Decor-and-furniture-store
full stack project 

# Home Decor and Furniture Store

Welcome to the Home Decor and Furniture Store project! This web application is designed to manage an online store for home decor and furniture items. It provides functionalities to view, add, modify, and delete products from the store using a modern web interface.

## Features

- **Product Listing**: Browse all products available in the store.
- **CRUD Operations**: Add, modify, and delete products with ease.
- **Product Categories**: Filter products by category such as living room, bedroom, office, etc.
- **Shopping Cart**: Add products to your cart for easy checkout.
- **User Authentication**: Secure login and registration for users to manage their accounts.
- **Order Management**: Place and view previous orders.

## Tech Stack

- **Frontend**: HTML, CSS, JavaScript (EJS templates)
- **Backend**: Node.js, Express.js
- **Database**: MongoDB
- **Authentication**: Passport.js
- **Testing**: Jest

## Installation

### Prerequisites

Make sure you have the following installed:

- [Node.js](https://nodejs.org/)
- [MongoDB](https://www.mongodb.com/try/download/community) or [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)

### Steps

1. Clone the repository:

    ```bash
    git clone https://github.com/Jaspreet911924/Home-Decor-and-furniture-store.git
    cd Home-Decor-and-furniture-store
    ```

2. Install the dependencies:

    ```bash
    npm install
    ```

3. Set up the environment variables (you can create a `.env` file):

    ```bash
    MONGO_URI=your_mongodb_connection_string
    SECRET_KEY=your_secret_key
    ```

4. Start the application:

    ```bash
    npm start
    ```

The application will be running at `http://localhost:3000`.

## Usage

- Navigate to `http://localhost:3000` to start browsing the store.
- Users can sign up, log in, and manage their profiles.
- Admin users can manage the product listings and orders.

## Contributing

1. Fork the repository.
2. Create a new branch (`git checkout -b feature-branch`).
3. Make your changes.
4. Commit your changes (`git commit -am 'Add new feature'`).
5. Push to the branch (`git push origin feature-branch`).
6. Create a new Pull Request.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

