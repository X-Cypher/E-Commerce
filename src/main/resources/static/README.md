# E-Commerce Frontend

A complete frontend for the E-Commerce backend application built with HTML, CSS, and vanilla JavaScript.

## Features

- **User Authentication**: Login and registration functionality
- **Product Catalog**: Browse and search products with category filtering
- **Shopping Cart**: Add products to cart, manage quantities, and checkout
- **Order Management**: View order history and order details
- **Admin Panel**: Add, delete, and manage products; view all orders
- **Responsive Design**: Works on desktop, tablet, and mobile devices

## Setup Instructions

### Prerequisites

1. Make sure your Spring Boot backend is running on `http://localhost:8080`
2. The backend should have CORS enabled (already configured in your controllers)

### Running the Frontend

1. Navigate to the `frontend` directory:
   ```bash
   cd frontend
   ```

2. Open `index.html` in your web browser:
   - Simply double-click `index.html` file
   - Or use a local server (recommended):
     ```bash
     # Using Python 3
     python -m http.server 8000
     
     # Using Node.js (if you have http-server installed)
     npx http-server
     ```

3. The application will be available at:
   - Direct file: `file:///path/to/frontend/index.html`
   - With local server: `http://localhost:8000`

## API Configuration

The frontend is configured to connect to the backend at `http://localhost:8080`. If your backend runs on a different port or URL, update the `API_BASE_URL` in `js/api.js`:

```javascript
const API_BASE_URL = 'http://localhost:8080'; // Change this if needed
```

## File Structure

```
frontend/
├── index.html          # Main HTML file with all sections
├── style.css           # Complete styling with responsive design
├── js/                 # JavaScript modules directory
│   ├── api.js          # API configuration and base API call function
│   ├── state.js        # State management (currentUser, cart, products, orders)
│   ├── auth.js         # Authentication logic (login, register, logout)
│   ├── products.js     # Product-related logic (load, render, filter)
│   ├── cart.js         # Shopping cart logic (add, remove, checkout)
│   ├── orders.js       # Order-related logic (load user orders, all orders)
│   ├── admin.js        # Admin panel logic (add/delete products, manage orders)
│   ├── ui.js           # UI utilities (navigation, modals, toast notifications)
│   └── main.js         # Main application initialization
└── README.md           # This file
```

### Module Descriptions

- **api.js**: Handles all HTTP requests to the backend API
- **state.js**: Centralized state management for user session, cart, products, and orders
- **auth.js**: User authentication functions including login, registration, and session management
- **products.js**: Product listing, filtering, and rendering functions
- **cart.js**: Shopping cart operations including add, remove, quantity updates, and checkout
- **orders.js**: Order history display and order card rendering
- **admin.js**: Admin panel functionality for product and order management
- **ui.js**: UI components including navigation, modals, and toast notifications
- **main.js**: Application initialization and event setup

## Usage Guide

### For Users

1. **Register**: Click "Register" to create a new account
2. **Login**: Use your credentials to login
3. **Browse Products**: Navigate to "Products" to see all available items
4. **Search & Filter**: Use the search bar and category filter to find products
5. **Add to Cart**: Click "Add to Cart" on any product
6. **Manage Cart**: Go to "Cart" to adjust quantities or remove items
7. **Checkout**: Click "Proceed to Checkout" to place your order
8. **View Orders**: Navigate to "My Orders" to see your order history

### For Admins

1. Navigate to the "Admin" section
2. **Add Product**: Fill in the product details and click "Add Product"
3. **Manage Products**: View and delete existing products
4. **View All Orders**: See orders from all users

## API Endpoints Used

- `POST /users/register` - Register new user
- `POST /users/login` - Login user
- `GET /products` - Get all products
- `POST /products/add` - Add new product
- `DELETE /products/{id}` - Delete product
- `POST /orders/place/{userId}` - Place order
- `GET /orders/user/{userId}` - Get user orders
- `GET /orders/all` - Get all orders

## Browser Compatibility

Works on all modern browsers:
- Chrome/Edge (recommended)
- Firefox
- Safari
- Opera

## Troubleshooting

### CORS Errors
If you see CORS errors in the browser console:
- Ensure your backend controllers have `@CrossOrigin("*")` annotation
- Check that the backend is running on the correct port

### API Connection Failed
- Verify the backend is running on `http://localhost:8080`
- Check browser console for specific error messages
- Ensure no firewall is blocking the connection

### Images Not Loading
- The app uses placeholder images if no image URL is provided
- For product images, provide valid URLs in the admin panel

## Customization

### Changing Colors
Edit the CSS variables in `style.css` to match your brand colors.

### Adding New Features
The modular structure makes it easy to add new sections:
1. Add a new section in `index.html`
2. Add corresponding CSS in `style.css`
3. Add JavaScript logic in `script.js`

## Security Notes

- Passwords are sent over HTTP (consider HTTPS for production)
- User session is stored in localStorage (consider secure cookies for production)
- No CSRF protection implemented (add for production use)

## License

This frontend is part of the E-Commerce project.
