// Product Functions

async function loadProducts() {
    showLoading('featuredProducts');
    showLoading('productsGrid');
    try {
        const productsData = await apiCall('/products');
        setProducts(productsData || []);
        renderFeaturedProducts();
        renderProducts();
        populateCategoryFilter();
    } catch (error) {
        showToast('Failed to load products', 'error');
    }
}

function renderFeaturedProducts() {
    const container = document.getElementById('featuredProducts');
    const products = getProducts();
    const featured = (products || []).slice(0, 4);
    container.innerHTML = featured.map(product => createProductCard(product)).join('');
}

function renderProducts() {
    const container = document.getElementById('productsGrid');
    const products = getProducts();
    container.innerHTML = (products || []).map(product => createProductCard(product)).join('');
}

function createProductCard(product) {
    const imageUrl = product.imageUrl || 'https://via.placeholder.com/280x200?text=No+Image';
    const wishlist = getWishlist();
    const isInWishlist = wishlist.some(item => item.id === product.id);
    
    const heartIcon = isInWishlist 
        ? `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="#ef4444" stroke="#ef4444" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path></svg>`
        : `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#64748b" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path></svg>`;
    
    return `
        <div class="product-card" onclick="viewProductDetails(${product.id})" style="cursor: pointer;">
            <div class="wishlist-icon" onclick="event.stopPropagation(); addToWishlist(${product.id})">${heartIcon}</div>
            <img src="${imageUrl}" alt="${product.name || 'Product'}" class="product-image" onerror="this.src='https://via.placeholder.com/280x200?text=No+Image'">
            <div class="product-info">
                <h3 class="product-name">${product.name || 'Unknown Product'}</h3>
                <p class="product-description">${product.description || 'No description available'}</p>
                <span class="product-category">${product.category || 'Uncategorized'}</span>
                <div class="product-price">₹${(product.price || 0).toFixed(2)}</div>
                <div class="product-actions">
                    <button class="btn btn-primary" onclick="event.stopPropagation(); addToCart(${product.id})">Add to Cart</button>
                </div>
            </div>
        </div>
    `;
}

function filterProducts() {
    const searchTerm = document.getElementById('searchInput').value.toLowerCase();
    const category = document.getElementById('categoryFilter').value;
    const sortOption = document.getElementById('sortFilter').value;
    const products = getProducts();

    let filtered = (products || []).filter(product => {
        const name = (product.name || '').toLowerCase();
        const description = (product.description || '').toLowerCase();
        const productCategory = product.category || '';
        
        const matchesSearch = name.includes(searchTerm) || description.includes(searchTerm);
        const matchesCategory = !category || productCategory === category;
        return matchesSearch && matchesCategory;
    });

    // Apply sorting
    if (sortOption === 'price-low') {
        filtered.sort((a, b) => (a.price || 0) - (b.price || 0));
    } else if (sortOption === 'price-high') {
        filtered.sort((a, b) => (b.price || 0) - (a.price || 0));
    } else if (sortOption === 'name') {
        filtered.sort((a, b) => (a.name || '').localeCompare(b.name || ''));
    }

    const container = document.getElementById('productsGrid');
    container.innerHTML = filtered.map(product => createProductCard(product)).join('');
}

function populateCategoryFilter() {
    const products = getProducts();
    const categories = [...new Set((products || []).map(p => p.category).filter(c => c))];
    const select = document.getElementById('categoryFilter');
    
    categories.forEach(category => {
        const option = document.createElement('option');
        option.value = category;
        option.textContent = category;
        select.appendChild(option);
    });
}

// Add event listener for sort filter
document.addEventListener('DOMContentLoaded', () => {
    const sortFilter = document.getElementById('sortFilter');
    if (sortFilter) {
        sortFilter.addEventListener('change', filterProducts);
    }
});

// Product Details Functions
async function loadProductDetails(productId) {
    if (!productId || productId === 0) {
        showToast('Invalid product ID', 'error');
        navigateTo('products');
        return;
    }
    
    let product = null;
    
    // First try to find in local products array
    const products = getProducts();
    product = products.find(p => p.id === productId);
    
    // If not found locally, fetch from backend
    if (!product) {
        try {
            product = await apiCall(`/products/${productId}`);
        } catch (error) {
            console.error('Error fetching product:', error);
            showToast('Product not found or has been deleted', 'error');
            navigateTo('products');
            return;
        }
    }
    
    if (!product) {
        showToast('Product not found', 'error');
        navigateTo('products');
        return;
    }

    renderProductDetails(product);
}

function renderProductDetails(product) {
    const container = document.getElementById('productDetailContent');
    const imageUrl = product.imageUrl || 'https://via.placeholder.com/400x400?text=No+Image';
    
    container.innerHTML = `
        <div class="product-detail">
            <div class="product-detail-image">
                <img src="${imageUrl}" alt="${product.name}" onerror="this.src='https://via.placeholder.com/400x400?text=No+Image'">
            </div>
            <div class="product-detail-info">
                <h1 class="product-detail-name">${product.name || 'Unknown Product'}</h1>
                <span class="product-detail-category">${product.category || 'Uncategorized'}</span>
                <div class="product-detail-price">₹${(product.price || 0).toFixed(2)}</div>
                <p class="product-detail-description">${product.description || 'No description available'}</p>
                <div class="product-detail-actions">
                    <button class="btn btn-primary btn-large" onclick="addToCart(${product.id})">Add to Cart</button>
                    <button class="btn btn-secondary" onclick="addToWishlist(${product.id})">❤️ Add to Wishlist</button>
                </div>
            </div>
        </div>
    `;
}

function viewProductDetails(productId) {
    loadProductDetails(productId);
    navigateTo('productDetails');
}
