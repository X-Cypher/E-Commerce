// Cart Functions

function addToCart(productId) {
    const products = getProducts() || [];
    const product = products.find(p => p.id === productId);
    if (!product) return;

    const cart = getCart() || [];
    const existingItem = cart.find(item => item.productId === productId);
    
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({
            productId: product.id,
            name: product.name || 'Unknown Product',
            price: product.price || 0,
            imageUrl: product.imageUrl || null,
            quantity: 1
        });
    }

    setCart(cart);
    updateCartCount();
    showToast(`${product.name || 'Product'} added to cart`, 'success');
}

function removeFromCart(productId) {
    const cart = getCart() || [];
    setCart(cart.filter(item => item.productId !== productId));
    updateCartCount();
    renderCart();
}

function updateCartQuantity(productId, change) {
    const cart = getCart() || [];
    const item = cart.find(item => item.productId === productId);
    
    if (item) {
        item.quantity += change;
        if (item.quantity <= 0) {
            removeFromCart(productId);
        } else {
            setCart(cart);
            renderCart();
        }
    }
    updateCartCount();
}

function clearCart() {
    setCart([]);
    updateCartCount();
}

function updateCartCount() {
    const cart = getCart() || [];
    const count = cart.reduce((sum, item) => sum + (item.quantity || 0), 0);
    document.getElementById('cartCount').textContent = `(${count})`;
}

function renderCart() {
    const container = document.getElementById('cartItems');
    const cart = getCart() || [];
    
    if (cart.length === 0) {
        container.innerHTML = `
            <div class="empty-state">
                <div class="empty-state-icon">🛒</div>
                <div class="empty-state-text">Your cart is empty</div>
            </div>
        `;
        document.getElementById('cartTotal').textContent = '₹0.00';
        return;
    }

    container.innerHTML = cart.map(item => {
        const imageUrl = item.imageUrl || 'https://via.placeholder.com/100?text=No+Image';
        return `
            <div class="cart-item">
                <img src="${imageUrl}" alt="${item.name || 'Product'}" class="cart-item-image" onerror="this.src='https://via.placeholder.com/100?text=No+Image'">
                <div class="cart-item-info">
                    <div class="cart-item-name">${item.name || 'Unknown Product'}</div>
                    <div class="cart-item-price">₹${(item.price || 0).toFixed(2)}</div>
                    <div class="cart-item-quantity">
                        <button class="quantity-btn" onclick="updateCartQuantity(${item.productId}, -1)">-</button>
                        <span>${item.quantity}</span>
                        <button class="quantity-btn" onclick="updateCartQuantity(${item.productId}, 1)">+</button>
                    </div>
                </div>
                <button class="cart-item-remove" onclick="removeFromCart(${item.productId})">Remove</button>
            </div>
        `;
    }).join('');

    const total = cart.reduce((sum, item) => sum + ((item.price || 0) * (item.quantity || 0)), 0);
    document.getElementById('cartTotal').textContent = `₹${total.toFixed(2)}`;
}

async function handleCheckout() {
    const user = getCurrentUser();
    const cart = getCart() || [];

    if (!user) {
        showToast('Please login to checkout', 'error');
        navigateTo('login');
        return;
    }

    if (cart.length === 0) {
        showToast('Your cart is empty', 'error');
        return;
    }

    navigateTo('payment');
}
