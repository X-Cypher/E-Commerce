// UI Utilities

// DOM Elements
const navLinks = document.querySelectorAll('.nav-link');
const sections = document.querySelectorAll('.section');
const editProductModal = document.getElementById('editProductModal');
const editProductForm = document.getElementById('editProductForm');
const toast = document.getElementById('toast');

// Navigation
function setupNavigation() {
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const section = link.dataset.section;
            navigateTo(section);
        });
    });
}

function navigateTo(sectionId) {
    const user = getCurrentUser();
    
    // Update active nav link
    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.dataset.section === sectionId) {
            link.classList.add('active');
        }
    });

    // Show corresponding section
    sections.forEach(section => {
        section.classList.remove('active');
        if (section.id === sectionId) {
            section.classList.add('active');
        }
    });

    // Load section-specific data
    if (sectionId === 'products') {
        renderProducts();
    } else if (sectionId === 'cart') {
        renderCart();
    } else if (sectionId === 'payment') {
        if (typeof renderPaymentOrderSummary === 'function') {
            setTimeout(renderPaymentOrderSummary, 50);
        }
    } else if (sectionId === 'orders') {
        if (user) {
            loadUserOrders();
        } else {
            showToast('Please login to view your orders', 'error');
            navigateTo('home');
        }
    } else if (sectionId === 'profile') {
        if (user) {
            loadProfile();
        } else {
            showToast('Please login to view your profile', 'error');
            navigateTo('home');
        }
    } else if (sectionId === 'wishlist') {
        if (user) {
            if (typeof loadWishlist === 'function') {
                loadWishlist();
            } else {
                console.error('loadWishlist function not found');
            }
        } else {
            showToast('Please login to view your wishlist', 'error');
            navigateTo('home');
        }
    } else if (sectionId === 'productDetails') {
        // Product details are loaded separately via viewProductDetails function
    } else if (sectionId === 'admin') {
        loadAdminData();
    }
}

// Modals
function setupModals() {
    // Close modals
    document.querySelectorAll('.close').forEach(closeBtn => {
        closeBtn.addEventListener('click', () => {
            editProductModal.style.display = 'none';
            document.getElementById('changePasswordModal').style.display = 'none';
        });
    });

    // Close modal on outside click
    window.addEventListener('click', (e) => {
        if (e.target === editProductModal) {
            editProductModal.style.display = 'none';
        }
        if (e.target === document.getElementById('changePasswordModal')) {
            document.getElementById('changePasswordModal').style.display = 'none';
        }
    });
}

// Forms
function setupForms() {
    document.getElementById('loginPageForm').addEventListener('submit', handleLogin);
    document.getElementById('registerPageForm').addEventListener('submit', handleRegister);
    document.getElementById('addProductForm').addEventListener('submit', handleAddProduct);
    editProductForm.addEventListener('submit', handleEditProduct);
    document.getElementById('profileForm').addEventListener('submit', handleProfileUpdate);
    document.getElementById('changePasswordForm').addEventListener('submit', handleChangePassword);
}

// Event Listeners
function setupEventListeners() {
    document.getElementById('logoutBtn').addEventListener('click', handleLogout);
    document.getElementById('checkoutBtn').addEventListener('click', handleCheckout);
    document.getElementById('searchInput').addEventListener('input', filterProducts);
    document.getElementById('categoryFilter').addEventListener('change', filterProducts);

    // Admin tabs
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const tabId = e.target.dataset.tab;
            switchAdminTab(tabId);
        });
    });
}

// Toast Notifications
function showToast(message, type = 'info') {
    toast.textContent = message;
    toast.className = `toast ${type}`;
    toast.style.display = 'block';

    setTimeout(() => {
        toast.style.display = 'none';
    }, 3000);
}

// Loading State Helpers
function showLoading(containerId) {
    const container = document.getElementById(containerId);
    if (container) {
        container.innerHTML = `
            <div class="loading">
                <div class="spinner"></div>
            </div>
        `;
    }
}

function hideLoading(containerId, content = '') {
    const container = document.getElementById(containerId);
    if (container && content) {
        container.innerHTML = content;
    }
}

function setButtonLoading(buttonId, isLoading) {
    const button = document.getElementById(buttonId);
    if (button) {
        if (isLoading) {
            button.classList.add('loading');
            button.disabled = true;
        } else {
            button.classList.remove('loading');
            button.disabled = false;
        }
    }
}
