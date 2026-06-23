// State Management
let currentUser = null;
let cart = [];
let products = [];
let allOrders = [];
let wishlist = [];

// Getters and Setters
function getCurrentUser() {
    return currentUser;
}

function setCurrentUser(user) {
    currentUser = user;
}

function getCart() {
    return cart;
}

function setCart(newCart) {
    cart = newCart;
}

function getProducts() {
    return products;
}

function setProducts(newProducts) {
    products = newProducts;
}

function getAllOrders() {
    return allOrders;
}

function setAllOrders(newOrders) {
    allOrders = newOrders;
}

function getWishlist() {
    return wishlist;
}

function setWishlist(newWishlist) {
    wishlist = newWishlist;
}
