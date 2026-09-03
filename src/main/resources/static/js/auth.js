// Authentication Functions

async function handleLogin(e) {
    e.preventDefault();
    const email = document.getElementById('loginPageEmail').value;
    const password = document.getElementById('loginPagePassword').value;

    const submitButton = e.target.querySelector('button[type="submit"]');
    const originalText = submitButton.textContent;
    submitButton.textContent = 'Logging in...';
    submitButton.disabled = true;

    try {
        const response = await apiCall('/auth/login', {
            method: 'POST',
            body: JSON.stringify({ email, password })
        });

        const user = response.user;

        setCurrentUser(user);
        localStorage.setItem('currentUser', JSON.stringify(user));
        updateAuthUI();
        navigateTo('home');
        showToast('Login successful!', 'success');
        document.getElementById('loginPageForm').reset();
    } catch (error) {
        const errorMessage = error.data?.error || error.data || 'Login failed. Please check your credentials.';
        showToast(errorMessage, 'error');
    } finally {
        submitButton.textContent = originalText;
        submitButton.disabled = false;
    }
}

async function handleRegister(e) {
    e.preventDefault();
    const userData = {
        name: document.getElementById('registerPageName').value,
        phoneNo: document.getElementById('registerPagePhone').value,
        email: document.getElementById('registerPageEmail').value,
        password: document.getElementById('registerPagePassword').value
    };

    const submitButton = e.target.querySelector('button[type="submit"]');
    const originalText = submitButton.textContent;
    submitButton.textContent = 'Creating account...';
    submitButton.disabled = true;

    try {
        const response = await apiCall('/auth/register', {
            method: 'POST',
            body: JSON.stringify(userData)
        });

        const user = response.user;

        setCurrentUser(user);
        localStorage.setItem('currentUser', JSON.stringify(user));
        updateAuthUI();
        navigateTo('home');
        showToast('Registration successful!', 'success');
        document.getElementById('registerPageForm').reset();
    } catch (error) {
        const errorMessage = error.data?.error || error.data || 'Registration failed. Please try again.';
        showToast(errorMessage, 'error');
    } finally {
        submitButton.textContent = originalText;
        submitButton.disabled = false;
    }
}

async function handleLogout() {
    try {
        await apiCall('/auth/logout', {
            method: 'POST'
        });
    } catch (error) {
        console.error('Logout error:', error);
    }

    setCurrentUser(null);
    localStorage.removeItem('currentUser');
    setCart([]);
    updateAuthUI();
    updateCartCount();
    showToast('Logged out successfully', 'info');
    navigateTo('home');
}

function checkLoggedInUser() {
    const savedUser = localStorage.getItem('currentUser');
    if (savedUser) {
        setCurrentUser(JSON.parse(savedUser));
        updateAuthUI();
    }
}

function updateAuthUI() {
    const navAuth = document.getElementById('navAuth');
    const navUser = document.getElementById('navUser');
    const user = getCurrentUser();

    if (user) {
        navAuth.style.display = 'none';
        navUser.style.display = 'flex';
        document.getElementById('userName').textContent = user.name || 'User';
    } else {
        navAuth.style.display = 'flex';
        navUser.style.display = 'none';
    }
}
