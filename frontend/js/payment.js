// Payment Functions

let currentOrderId = null;
const RAZORPAY_KEY = 'rzp_test_SfPanW17XpADff'; // Replace with your Razorpay test key

function initPayment() {
    const payButton = document.getElementById('payButton');
    if (payButton) {
        payButton.addEventListener('click', initiatePayment);
    }
}

function renderPaymentOrderSummary() {
    const container = document.getElementById('paymentOrderItems');
    const totalElement = document.getElementById('paymentTotal');
    
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

async function initiatePayment() {
    const user = getCurrentUser();
    const cart = getCart();
    
    if (!user) {
        showToast('Please login to proceed with payment', 'error');
        navigateTo('login');
        return;
    }
    
    if (!cart || cart.length === 0) {
        showToast('Your cart is empty', 'error');
        return;
    }
    
    const products = getProducts();
    const total = cart.reduce((sum, item) => {
        const product = products.find(p => p.id === item.productId);
        return sum + ((product?.price || 0) * (item.quantity || 0));
    }, 0);
    
    if (total <= 0) {
        showToast('Invalid cart total', 'error');
        return;
    }
    
    try {
        setButtonLoading('payButton', true);
        
        // Create order on backend
        const orderDetails = {
            user: { id: user.id },
            amount: total
        };
        
        const response = await fetch(`${API_BASE_URL}/payment/create`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(orderDetails)
        });
        
        if (!response.ok) {
            throw new Error('Failed to create payment order');
        }
        
        const order = await response.json();
        
        currentOrderId = order.id;
        
        // Open Razorpay checkout
        const options = {
            key: RAZORPAY_KEY,
            amount: order.amount,
            currency: order.currency,
            name: 'MavenMart',
            description: 'Payment for order',
            order_id: order.id,
            handler: function(response) {
                handlePaymentSuccess(response, total);
            },
            prefill: {
                name: user.name,
                email: user.email
            },
            theme: {
                color: '#6366f1'
            },
            modal: {
                ondismiss: function() {
                    console.log('Payment modal dismissed');
                    setButtonLoading('payButton', false);
                }
            }
        };
        
        const rzp = new Razorpay(options);
        rzp.open();
        
    } catch (error) {
        console.error('Payment error:', error);
        showToast('Payment initiation failed', 'error');
    } finally {
        setButtonLoading('payButton', false);
    }
}

async function handlePaymentSuccess(response, total) {
    try {
        const user = getCurrentUser();
        const cart = getCart();
        const products = getProducts();
        
        // Prepare order items for email
        const orderItems = cart.map(item => {
            const product = products.find(p => p.id === item.productId);
            return {
                product: product,
                quantity: item.quantity
            };
        });
        
        // Update order status on backend
        const updateResponse = await fetch(`${API_BASE_URL}/payment/update`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                orderId: currentOrderId,
                status: 'Success',
                orderItems: orderItems
            })
        });
        
        if (!updateResponse.ok) {
            throw new Error('Failed to update payment status');
        }
        
        showToast('Payment successful! Order confirmation sent to your email.', 'success');
        
        // Clear cart and navigate to orders
        clearCart();
        navigateTo('orders');
        
    } catch (error) {
        console.error('Payment success handling error:', error);
        showToast('Payment was successful but order processing failed', 'error');
    }
}

// Initialize payment when section is loaded
document.addEventListener('DOMContentLoaded', () => {
    const payButton = document.getElementById('payButton');
    if (payButton) {
        payButton.addEventListener('click', initiatePayment);
    }
});
