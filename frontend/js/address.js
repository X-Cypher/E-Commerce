// Address Functions

let addresses = [];

async function loadAddresses() {
    const user = getCurrentUser();
    if (!user) return;

    const container = document.getElementById('addressList');
    container.classList.add('loading');
    container.innerHTML = '<div class="loading"><div class="spinner"></div></div>';

    try {
        const addressData = await apiCall(`/address/user/${user.id}`);
        addresses = addressData;
        container.classList.remove('loading');
        renderAddresses();
    } catch (error) {
        container.classList.remove('loading');
        showToast('Failed to load addresses', 'error');
    }
}

function renderAddresses() {
    const container = document.getElementById('addressList');

    if (addresses.length === 0) {
        container.innerHTML = '';
        return;
    }

    container.innerHTML = addresses.map(address => `
        <div class="address-card ${address.isDefault ? 'default' : ''}">
            ${!address.isDefault ? `<button class="btn btn-secondary address-set-default" onclick="setDefaultAddress(${address.id})">Set Default</button>` : ''}
            <div class="address-info">
                <h4>${address.isDefault ? 'Default Address' : 'Address'}</h4>
                <p>${address.addressLine1}</p>
                ${address.addressLine2 ? `<p>${address.addressLine2}</p>` : ''}
                <p>${address.city}, ${address.state} ${address.zipCode}</p>
                <p>${address.country}</p>
                <p>Phone: ${address.phone}</p>
            </div>
            <div class="address-actions">
                <button class="btn btn-primary" onclick="editAddress(${address.id})">Edit</button>
                <button class="btn btn-danger" onclick="deleteAddress(${address.id})">Delete</button>
            </div>
        </div>
    `).join('');
}

function showAddAddressModal() {
    document.getElementById('addressModalTitle').textContent = 'Add Address';
    document.getElementById('addressForm').reset();
    document.getElementById('addressId').value = '';
    document.getElementById('addressModal').style.display = 'block';
}

function editAddress(addressId) {
    const address = addresses.find(a => a.id === addressId);
    if (!address) return;

    document.getElementById('addressModalTitle').textContent = 'Edit Address';
    document.getElementById('addressId').value = address.id;
    document.getElementById('addressLine1').value = address.addressLine1 || '';
    document.getElementById('addressLine2').value = address.addressLine2 || '';
    document.getElementById('city').value = address.city || '';
    document.getElementById('state').value = address.state || '';
    document.getElementById('zipCode').value = address.zipCode || '';
    document.getElementById('country').value = address.country || '';
    document.getElementById('addressPhone').value = address.phone || '';
    document.getElementById('addressModal').style.display = 'block';
}

async function saveAddress(event) {
    event.preventDefault();

    const user = getCurrentUser();
    if (!user) {
        showToast('Please login to save address', 'error');
        return;
    }

    const addressId = document.getElementById('addressId').value;
    const addressData = {
        addressLine1: document.getElementById('addressLine1').value,
        addressLine2: document.getElementById('addressLine2').value,
        city: document.getElementById('city').value,
        state: document.getElementById('state').value,
        zipCode: document.getElementById('zipCode').value,
        country: document.getElementById('country').value,
        phone: document.getElementById('addressPhone').value
    };

    try {
        let response;
        if (addressId) {
            response = await fetch(`${API_BASE_URL}/address/update/${addressId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(addressData)
            });
        } else {
            response = await fetch(`${API_BASE_URL}/address/add/${user.id}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(addressData)
            });
        }

        if (!response.ok) {
            const errorData = await response.json();
            if (response.status === 400 && errorData) {
                // Display validation errors
                const errorMessages = Object.values(errorData).join(', ');
                showToast(errorMessages, 'error');
                return;
            }
            throw new Error('Failed to save address');
        }

        showToast(addressId ? 'Address updated successfully' : 'Address added successfully', 'success');
        document.getElementById('addressModal').style.display = 'none';
        await loadAddresses();
    } catch (error) {
        console.error('Error saving address:', error);
        showToast('Failed to save address', 'error');
    }
}

async function deleteAddress(addressId) {
    if (!confirm('Are you sure you want to delete this address?')) return;

    try {
        await apiCall(`/address/delete/${addressId}`, {
            method: 'DELETE'
        });
        showToast('Address deleted successfully', 'success');
        await loadAddresses();
    } catch (error) {
        showToast('Failed to delete address', 'error');
    }
}

async function setDefaultAddress(addressId) {
    try {
        await fetch(`${API_BASE_URL}/address/set-default/${addressId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            }
        });
        showToast('Default address updated', 'success');
        await loadAddresses();
    } catch (error) {
        showToast('Failed to set default address', 'error');
    }
}

// Initialize address form
document.addEventListener('DOMContentLoaded', () => {
    const addressForm = document.getElementById('addressForm');
    if (addressForm) {
        addressForm.addEventListener('submit', saveAddress);
    }
});
