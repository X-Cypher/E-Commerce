// Wishlist Functions

async function loadWishlist() {
    const user = getCurrentUser();
    if (!user) return;

    showLoading('wishlistItems');
    try {
        const wishlistData = await apiCall(`/wishlist/user/${user.id}`);
        setWishlist(wishlistData);
        renderWishlist();
    } catch (error) {
        showToast('Failed to load wishlist', 'error');
    }
}

async function addToWishlist(productId) {
    const user = getCurrentUser();
    if (!user) {
        showToast('Please login to add to wishlist', 'error');
        navigateTo('login');
        return;
    }

    try {
        await apiCall(`/wishlist/add/${user.id}/${productId}`, {
            method: 'POST'
        });
        showToast('Added to wishlist', 'success');
        await loadWishlist();
    } catch (error) {
        showToast('Failed to add to wishlist', 'error');
    }
}

async function removeFromWishlist(productId) {
    const user = getCurrentUser();
    if (!user) return;

    try {
        await apiCall(`/wishlist/remove/${user.id}/${productId}`, {
            method: 'DELETE'
        });
        showToast('Removed from wishlist', 'success');
        await loadWishlist();
    } catch (error) {
        showToast('Failed to remove from wishlist', 'error');
    }
}

function renderWishlist() {
    const container = document.getElementById('wishlistItems');
    const wishlist = getWishlist();
    const products = getProducts();
    
    if (wishlist.length === 0) {
        container.className = '';
        container.innerHTML = `
            <div class="empty-state">
                <div class="empty-state-icon">❤️</div>
                <div class="empty-state-text">Your wishlist is empty</div>
            </div>
        `;
        return;
    }

    container.className = 'products-grid';
    container.innerHTML = wishlist.map(wishlistItem => {
        const product = products.find(p => p.id === wishlistItem.product.id);
        if (!product) return '';
        
        const imageUrl = product.imageUrl || 'https://via.placeholder.com/280x200?text=No+Image';
        return `
            <div class="product-card">
                <img src="${imageUrl}" alt="${product.name}" class="product-image" onerror="this.src='https://via.placeholder.com/280x200?text=No+Image'">
                <div class="product-info">
                    <h3 class="product-name">${product.name || 'Unknown Product'}</h3>
                    <p class="product-description">${product.description || 'No description available'}</p>
                    <span class="product-category">${product.category || 'Uncategorized'}</span>
                    <div class="product-price">₹${(product.price || 0).toFixed(2)}</div>
                    <div class="product-actions">
                        <button class="btn btn-primary" onclick="addToCart(${product.id})">Add to Cart</button>
                        <button class="btn btn-danger" onclick="removeFromWishlist(${product.id})">Remove</button>
                    </div>
                </div>
            </div>
        `;
    }).join('');
}
