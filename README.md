# E-Commerce Store

A full-stack e-commerce application built with Express.js, MongoDB, and vanilla JavaScript.

## Features

### Backend (Express.js + MongoDB)
- User authentication with JWT tokens
- Product management with categories and search
- Shopping cart functionality
- Order processing and management
- RESTful API endpoints
- Input validation and error handling

### Frontend (HTML, CSS, JavaScript)
- Responsive design for all devices
- Product listing with filtering and search
- Shopping cart with real-time updates
- User authentication (login/register)
- Checkout process with order placement
- Modern UI with smooth animations

## Prerequisites

Before running this application, make sure you have:
- Node.js (v14 or higher)
- MongoDB (running locally or MongoDB Atlas)
- A modern web browser

## Installation

1. Clone or download the project files
2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up environment variables:
   - Copy `.env` file and update the values if needed
   - Default MongoDB URI: `mongodb://localhost:27017/ecommerce`
   - Default JWT Secret: `your_super_secret_jwt_key_here_change_in_production`

4. Start MongoDB service on your system

5. Seed the database with sample data:
   ```bash
   npm run seed
   ```

6. Start the development server:
   ```bash
   npm run dev
   ```

7. Open your browser and navigate to `http://localhost:5000`

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user profile
- `PUT /api/auth/profile` - Update user profile

### Products
- `GET /api/products` - Get all products (with filtering, search, pagination)
- `GET /api/products/:id` - Get single product
- `GET /api/products/featured/list` - Get featured products
- `POST /api/products` - Create product (Admin only)
- `PUT /api/products/:id` - Update product (Admin only)
- `DELETE /api/products/:id` - Delete product (Admin only)

### Shopping Cart
- `GET /api/cart` - Get user's cart
- `POST /api/cart/add` - Add item to cart
- `PUT /api/cart/update` - Update item quantity
- `DELETE /api/cart/remove/:productId` - Remove item from cart
- `DELETE /api/cart/clear` - Clear entire cart

### Orders
- `POST /api/orders` - Create new order
- `GET /api/orders` - Get user's orders
- `GET /api/orders/:id` - Get single order
- `PUT /api/orders/:id/cancel` - Cancel order

## Default Login Credentials

After running the seed script, you can use these credentials:

**Admin Account:**
- Email: admin@ecommerce.com
- Password: admin123

**User Account:**
- Email: user@example.com
- Password: user123

## Project Structure

```
├── models/           # Database models
│   ├── User.js
│   ├── Product.js
│   ├── Cart.js
│   └── Order.js
├── routes/           # API routes
│   ├── auth.js
│   ├── products.js
│   ├── cart.js
│   └── orders.js
├── middleware/       # Custom middleware
│   └── auth.js
├── scripts/          # Utility scripts
│   └── seedData.js
├── index.html        # Main HTML file
├── styles.css        # Stylesheet
├── script.js         # Frontend JavaScript
├── server.js         # Express server
└── package.json      # Dependencies
```

## Usage

1. **Browse Products**: Visit the home page to see featured products or go to the Products page to see all items
2. **Search & Filter**: Use the search bar or category filters to find specific products
3. **User Account**: Register a new account or login with existing credentials
4. **Shopping Cart**: Add items to cart, update quantities, and proceed to checkout
5. **Place Orders**: Fill in shipping information and place orders
6. **Admin Features**: Login as admin to manage products (add, edit, delete)

## Technologies Used

- **Backend**: Node.js, Express.js, MongoDB, Mongoose
- **Authentication**: JWT (JSON Web Tokens), bcryptjs
- **Validation**: express-validator
- **Frontend**: HTML5, CSS3, Vanilla JavaScript
- **Styling**: CSS Grid, Flexbox, CSS Variables
- **Icons**: Font Awesome

## Features Implemented

✅ Product catalog with categories
✅ User registration and authentication
✅ Shopping cart functionality
✅ Order processing
✅ Responsive design
✅ Search and filtering
✅ Admin product management
✅ Real-time cart updates
✅ Form validation
✅ Error handling
✅ Toast notifications

## Future Enhancements

- Payment gateway integration (Stripe, PayPal)
- Product reviews and ratings
- Wishlist functionality
- Order tracking
- Email notifications
- Product image upload
- Inventory management
- Sales analytics
- Multi-language support

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is licensed under the MIT License.
