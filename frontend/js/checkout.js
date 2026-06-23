// Checkout Functions

let selectedCheckoutAddressId = null;

function renderCheckoutOrderSummary() {
    const container = document.getElementById('checkoutOrderItems');
    const totalElement = document.getElementById('checkoutTotal');
    
    if (!container || !totalElement) {
        return;
    }
    
    const cart = getCart();
    const products = getProducts();
    
    if (!cart || cart.length === 0) {
        container.innerHTML = '<p class="text-secondary">Your cart is empty</p>';
        totalElement.textContent = '₹0.00';
        return;
    }
    
    if (!products || products.length === 0) {
        container.innerHTML = '<p class="text-secondary">Products not loaded</p>';
        totalElement.textContent = '₹0.00';
        return;
    }
    
    let total = 0;
    container.innerHTML = cart.map(item => {
        const product = products.find(p => p.id === item.productId);
        if (!product) return '';
        
        const itemTotal = (product.price || 0) * (item.quantity || 0);
        total += itemTotal;
        
        return `
            <div class="payment-item">
                <div class="payment-item-name">
                    ${product.name || 'Unknown Product'} x ${item.quantity || 0}
                </div>
                <div class="payment-item-price">₹${itemTotal.toFixed(2)}</div>
            </div>
        `;
    }).join('');
    
    totalElement.textContent = `₹${total.toFixed(2)}`;
}

async function renderCheckoutAddressSelection() {
    const container = document.getElementById('checkoutAddressSelection');
    const user = getCurrentUser();
    
    if (!container || !user) {
        return;
    }
    
    try {
        const addresses = await apiCall(`/address/user/${user.id}`);
        
        if (addresses.length === 0) {
            container.innerHTML = '<p class="text-secondary">No addresses saved. Please add an address.</p>';
            return;
        }
        
        const defaultAddress = addresses.find(a => a.isDefault);
        if (defaultAddress && !selectedCheckoutAddressId) {
            selectedCheckoutAddressId = defaultAddress.id;
        }
        
        container.innerHTML = addresses.map(address => `
            <div class="address-option ${address.id === selectedCheckoutAddressId ? 'selected' : ''}" onclick="selectCheckoutAddress(${address.id})">
                <div class="address-option-info">
                    <strong>${address.isDefault ? 'Default - ' : ''}${address.addressLine1}</strong>
                    ${address.addressLine2 ? `<br>${address.addressLine2}` : ''}
                    <br>${address.city}, ${address.state} ${address.zipCode}
                    <br>${address.country}
                    <br>Phone: ${address.phone}
                </div>
                ${address.id === selectedCheckoutAddressId ? '<div class="address-option-check">✓</div>' : ''}
            </div>
        `).join('');
    } catch (error) {
        container.innerHTML = '<p class="text-secondary">Failed to load addresses</p>';
    }
}

function selectCheckoutAddress(addressId) {
    selectedCheckoutAddressId = addressId;
    renderCheckoutAddressSelection();
}

function proceedToPayment() {
    const user = getCurrentUser();
    const cart = getCart();
    
    if (!user) {
        showToast('Please login to proceed', 'error');
        navigateTo('login');
        return;
    }
    
    if (!cart || cart.length === 0) {
        showToast('Your cart is empty', 'error');
        return;
    }
    
    if (!selectedCheckoutAddressId) {
        showToast('Please select a delivery address', 'error');
        return;
    }
    
    // Store selected address for payment
    setSelectedAddressId(selectedCheckoutAddressId);
    navigateTo('payment');
}

function setSelectedAddressId(addressId) {
    sessionStorage.setItem('selectedAddressId', addressId);
}

function getSelectedAddressId() {
    return sessionStorage.getItem('selectedAddressId');
}

// Initialize checkout when section is loaded
document.addEventListener('DOMContentLoaded', () => {
    const proceedToPaymentBtn = document.getElementById('proceedToPaymentBtn');
    if (proceedToPaymentBtn) {
        proceedToPaymentBtn.addEventListener('click', proceedToPayment);
    }
});
