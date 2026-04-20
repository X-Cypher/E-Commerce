// Admin Functions

async function loadAdminData() {
    showLoading('adminProductsList');
    showLoading('allOrdersList');
    await loadAdminProducts();
    await loadAllOrders();
}

async function loadAdminProducts() {
    const container = document.getElementById('adminProductsList');
    const products = getProducts() || [];

    if (products.length === 0) {
        container.innerHTML = `
            <div class="empty-state">
                <div class="empty-state-icon">📦</div>
                <div class="empty-state-text">No products found</div>
            </div>
        `;
        return;
    }

    container.innerHTML = products.map(product => `
        <div class="admin-product-item">
            <div class="admin-product-info">
                <div class="admin-product-name">${product.name || 'Unknown Product'}</div>
                <div class="admin-product-details">
                    ${product.category || 'Uncategorized'} - ₹${(product.price || 0).toFixed(2)}
                </div>
            </div>
            <div class="admin-product-actions">
                <button class="btn btn-secondary" onclick="openEditProductModal(${product.id})">Edit</button>
                <button class="btn btn-danger" onclick="deleteProduct(${product.id})">Delete</button>
            </div>
        </div>
    `).join('');
}

async function handleAddProduct(e) {
    e.preventDefault();

    const submitButton = e.target.querySelector('button[type="submit"]');
    const originalText = submitButton.textContent;
    submitButton.textContent = 'Adding...';
    submitButton.disabled = true;

    const productData = {
        name: document.getElementById('productName').value,
        description: document.getElementById('productDescription').value,
        price: parseFloat(document.getElementById('productPrice').value),
        category: document.getElementById('productCategory').value,
        imageUrl: document.getElementById('productImageUrl').value || null
    };

    try {
        await apiCall('/products/add', {
            method: 'POST',
            body: JSON.stringify(productData)
        });

        showToast('Product added successfully!', 'success');
        document.getElementById('addProductForm').reset();
        await loadProducts();
        await loadAdminProducts();
    } catch (error) {
        showToast('Failed to add product', 'error');
    } finally {
        submitButton.textContent = originalText;
        submitButton.disabled = false;
    }
}

function openEditProductModal(productId) {
    const products = getProducts();
    const product = products.find(p => p.id === productId);
    if (!product) return;

    document.getElementById('editProductId').value = product.id;
    document.getElementById('editProductName').value = product.name || '';
    document.getElementById('editProductDescription').value = product.description || '';
    document.getElementById('editProductPrice').value = product.price || 0;
    document.getElementById('editProductCategory').value = product.category || '';
    document.getElementById('editProductImageUrl').value = product.imageUrl || '';

    document.getElementById('editProductModal').style.display = 'block';
}

async function handleEditProduct(e) {
    e.preventDefault();

    const submitButton = e.target.querySelector('button[type="submit"]');
    const originalText = submitButton.textContent;
    submitButton.textContent = 'Updating...';
    submitButton.disabled = true;

    const productId = document.getElementById('editProductId').value;
    const productData = {
        name: document.getElementById('editProductName').value,
        description: document.getElementById('editProductDescription').value,
        price: parseFloat(document.getElementById('editProductPrice').value),
        category: document.getElementById('editProductCategory').value,
        imageUrl: document.getElementById('editProductImageUrl').value || null
    };

    try {
        await apiCall(`/products/${productId}`, {
            method: 'PUT',
            body: JSON.stringify(productData)
        });

        showToast('Product updated successfully!', 'success');
        document.getElementById('editProductModal').style.display = 'none';
        document.getElementById('editProductForm').reset();
        await loadProducts();
        await loadAdminProducts();
    } catch (error) {
        showToast('Failed to update product', 'error');
    } finally {
        submitButton.textContent = originalText;
        submitButton.disabled = false;
    }
}

async function deleteProduct(productId) {
    if (!confirm('Are you sure you want to delete this product?')) return;

    try {
        await apiCall(`/products/${productId}`, {
            method: 'DELETE'
        });

        showToast('Product deleted successfully!', 'success');
        await loadProducts();
        await loadAdminProducts();
    } catch (error) {
        showToast('Failed to delete product', 'error');
    }
}

function switchAdminTab(tabId) {
    // Update tab buttons
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.classList.remove('active');
        if (btn.dataset.tab === tabId) {
            btn.classList.add('active');
        }
    });

    // Update tab content
    document.querySelectorAll('.tab-content').forEach(content => {
        content.classList.remove('active');
        if (content.id === tabId) {
            content.classList.add('active');
        }
    });

    // Load tab-specific data
    if (tabId === 'manageProducts') {
        loadAdminProducts();
    } else if (tabId === 'allOrders') {
        loadAllOrders();
    }
}
