// Order Functions

async function loadUserOrders() {
    const user = getCurrentUser();
    if (!user) return;

    showLoading('ordersList');
    try {
        const orders = await apiCall(`/orders/user/${user.id}`);
        renderOrders(orders, 'ordersList');
    } catch (error) {
        console.log(error);
        showToast('Failed to load orders', 'error');
    }
}

async function loadAllOrders() {
    showLoading('allOrdersList');
    try {
        const orders = await apiCall('/orders/all');
        setAllOrders(orders);
        renderOrders(orders, 'allOrdersList', true);
    } catch (error) {
        showToast('Failed to load all orders', 'error');
    }
}

function renderOrders(orders, containerId, isAdmin = false) {
    const container = document.getElementById(containerId);
    
    if (!orders || orders.length === 0) {
        container.innerHTML = `
            <div class="empty-state">
                <div class="empty-state-icon">📦</div>
                <div class="empty-state-text">No orders found</div>
            </div>
        `;
        return;
    }

    container.innerHTML = orders.map(order => createOrderCard(order, isAdmin)).join('');
}

function createOrderCard(order, isAdmin = false) {
    const orderDate = order.orderDate ? new Date(order.orderDate).toLocaleDateString('en-GB') : 'N/A';
    const statusClass = order.status ? order.status.toLowerCase() : 'unknown';
    
    const itemsHtml = (order.orderItems || []).map(item => {
        const imageUrl = item.imageUrl || 'https://via.placeholder.com/80x80?text=No+Image';
        const onClickAttr = item.productId ? `onclick="viewProductDetails(${item.productId})"` : '';
        const cursorStyle = item.productId ? 'cursor: pointer;' : '';
        return `
        <div class="order-item" ${onClickAttr} style="${cursorStyle}">
            <img src="${imageUrl}" alt="${item.productName}" class="order-item-image" onerror="this.src='https://via.placeholder.com/80x80?text=No+Image'">
            <div class="order-item-details">
                <span class="order-item-name">${item.productName || 'Unknown Product'}</span>
                <span class="order-item-price">${item.quantity || 0} x ₹${(item.productPrice || 0).toFixed(2)}</span>
            </div>
        </div>
    `}).join('');

    let actionsHtml = '';
    if (isAdmin) {
        actionsHtml = `
            <div class="order-status-update">
                <select class="status-select" onchange="updateOrderStatus(${order.id}, this.value)">
                    <option value="Pending" ${order.status === 'Pending' ? 'selected' : ''}>Pending</option>
                    <option value="Shipped" ${order.status === 'Shipped' ? 'selected' : ''}>Shipped</option>
                    <option value="Delivered" ${order.status === 'Delivered' ? 'selected' : ''}>Delivered</option>
                    <option value="Cancelled" ${order.status === 'Cancelled' ? 'selected' : ''}>Cancelled</option>
                </select>
            </div>
        `;
    } else {
        const cancelButton = order.status === 'Pending' ? 
            `<button class="btn btn-danger" onclick="cancelOrder(${order.id})">Cancel Order</button>` : '';
        actionsHtml = cancelButton;
    }

    return `
        <div class="order-card">
            <div class="order-header">
                <div>
                    <div class="order-id">Order #${order.id}</div>
                    <div class="order-date">${orderDate}</div>
                </div>
                <span class="order-status ${statusClass}">${order.status}</span>
            </div>
            <div class="order-items">
                ${itemsHtml}
            </div>
            <div class="order-total">
                <span>Total:</span>
                <span>₹${(order.totalAmount || 0).toFixed(2)}</span>
            </div>
            <div class="order-actions">
                ${actionsHtml}
            </div>
        </div>
    `;
}

async function cancelOrder(orderId) {
    if (!confirm('Are you sure you want to cancel this order?')) return;

    try {
        await apiCall(`/orders/${orderId}`, {
            method: 'DELETE'
        });
        showToast('Order cancelled successfully', 'success');
        const user = getCurrentUser();
        if (user) {
            await loadUserOrders();
        }
    } catch (error) {
        showToast('Failed to cancel order', 'error');
    }
}

async function updateOrderStatus(orderId, newStatus) {
    try {
        await apiCall(`/orders/${orderId}/status`, {
            method: 'PUT',
            body: JSON.stringify(newStatus),
            headers: {
                'Content-Type': 'text/plain'
            }
        });
        showToast('Order status updated successfully', 'success');
        await loadAllOrders();
    } catch (error) {
        showToast('Failed to update order status', 'error');
    }
}
