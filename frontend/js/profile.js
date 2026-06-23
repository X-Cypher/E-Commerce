// Profile Functions

async function loadProfile() {
    const user = getCurrentUser();
    if (!user) return;

    // Populate view mode
    document.getElementById('profileViewName').textContent = user.name || 'User';
    document.getElementById('profileViewEmail').textContent = user.email || '';
    document.getElementById('profileViewPhone').textContent = user.phoneNo || 'Not provided';
    document.getElementById('profileViewAddress').textContent = user.address || 'Not provided';
    document.getElementById('profileAvatarInitial').textContent = (user.name || 'U').charAt(0).toUpperCase();
    
    // Format and display createdAt date
    if (user.createdAt) {
        const date = new Date(user.createdAt);
        const formattedDate = date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
        document.getElementById('profileViewJoined').textContent = formattedDate;
    } else {
        document.getElementById('profileViewJoined').textContent = 'Not available';
    }
    
    // Populate edit form
    document.getElementById('profileName').value = user.name || '';
    document.getElementById('profilePhone').value = user.phoneNo || '';
    document.getElementById('profileEmail').value = user.email || '';
    document.getElementById('profileAddress').value = user.address || '';

    // Load statistics
    await loadProfileStatistics();
}

async function loadProfileStatistics() {
    const user = getCurrentUser();
    if (!user) return;

    try {
        // Load orders
        const orders = await apiCall(`/orders/user/${user.id}`);
        document.getElementById('totalOrders').textContent = orders.length || 0;
        
        // Calculate total spent
        const totalSpent = orders.reduce((sum, order) => sum + (order.totalAmount || 0), 0);
        document.getElementById('totalSpent').textContent = `₹${totalSpent.toFixed(2)}`;
    } catch (error) {
        console.error('Failed to load order statistics:', error);
    }

    try {
        // Load wishlist
        const wishlist = await apiCall(`/wishlist/user/${user.id}`);
        document.getElementById('wishlistCount').textContent = wishlist.length || 0;
    } catch (error) {
        console.error('Failed to load wishlist statistics:', error);
    }
}

function toggleEditMode() {
    const profileView = document.getElementById('profileView');
    const profileEdit = document.getElementById('profileEdit');
    
    if (profileEdit.style.display === 'none') {
        profileView.style.display = 'none';
        profileEdit.style.display = 'block';
    } else {
        profileView.style.display = 'block';
        profileEdit.style.display = 'none';
    }
}

function cancelEditMode() {
    const user = getCurrentUser();
    if (!user) return;

    // Reset form to current user data
    document.getElementById('profileName').value = user.name || '';
    document.getElementById('profilePhone').value = user.phoneNo || '';
    document.getElementById('profileEmail').value = user.email || '';
    document.getElementById('profileAddress').value = user.address || '';

    toggleEditMode();
}

async function handleProfileUpdate(e) {
    e.preventDefault();
    const user = getCurrentUser();
    if (!user) {
        showToast('Please login to update profile', 'error');
        return;
    }

    const submitButton = e.target.querySelector('button[type="submit"]');
    const originalText = submitButton.textContent;
    submitButton.textContent = 'Updating...';
    submitButton.disabled = true;

    const userData = {
        name: document.getElementById('profileName').value,
        phoneNo: document.getElementById('profilePhone').value,
        email: document.getElementById('profileEmail').value,
        address: document.getElementById('profileAddress').value
    };

    try {
        const updatedUser = await apiCall(`/users/${user.id}`, {
            method: 'PUT',
            body: JSON.stringify(userData)
        });

        setCurrentUser(updatedUser);
        localStorage.setItem('currentUser', JSON.stringify(updatedUser));
        updateAuthUI();
        loadProfile();
        cancelEditMode();
        showToast('Profile updated successfully!', 'success');
    } catch (error) {
        showToast('Failed to update profile', 'error');
    } finally {
        submitButton.textContent = originalText;
        submitButton.disabled = false;
    }
}

function togglePasswordModal() {
    document.getElementById('changePasswordModal').style.display = 'block';
}

async function handleChangePassword(e) {
    e.preventDefault();
    
    const currentPassword = document.getElementById('currentPassword').value;
    const newPassword = document.getElementById('newPassword').value;
    const confirmPassword = document.getElementById('confirmPassword').value;

    if (newPassword !== confirmPassword) {
        showToast('Passwords do not match', 'error');
        return;
    }

    if (newPassword.length < 6) {
        showToast('Password must be at least 6 characters', 'error');
        return;
    }

    const user = getCurrentUser();
    if (!user) {
        showToast('Please login to change password', 'error');
        return;
    }

    // Verify current password
    try {
        const loginCheck = await apiCall('/users/login', {
            method: 'POST',
            body: JSON.stringify({ email: user.email, password: currentPassword })
        });

        // If current password is correct, update password
        user.password = newPassword;
        const updatedUser = await apiCall(`/users/${user.id}`, {
            method: 'PUT',
            body: JSON.stringify(user)
        });

        setCurrentUser(updatedUser);
        localStorage.setItem('currentUser', JSON.stringify(updatedUser));
        document.getElementById('changePasswordForm').reset();
        document.getElementById('changePasswordModal').style.display = 'none';
        showToast('Password changed successfully!', 'success');
    } catch (error) {
        showToast('Current password is incorrect', 'error');
    }
}
