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
        const user = await apiCall('/users/login', {
            method: 'POST',
            body: JSON.stringify({ email, password })
        });

        setCurrentUser(user);
        localStorage.setItem('currentUser', JSON.stringify(user));
        updateAuthUI();
        navigateTo('home');
        showToast('Login successful!', 'success');
        document.getElementById('loginPageForm').reset();
    } catch (error) {
        showToast('Login failed. Please check your credentials.', 'error');
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
        password: document.getElementById('registerPagePassword').value,
        address: document.getElementById('registerPageAddress').value
    };

    const submitButton = e.target.querySelector('button[type="submit"]');
    const originalText = submitButton.textContent;
    submitButton.textContent = 'Creating account...';
    submitButton.disabled = true;

    try {
        const user = await apiCall('/users/register', {
            method: 'POST',
            body: JSON.stringify(userData)
        });

        setCurrentUser(user);
        localStorage.setItem('currentUser', JSON.stringify(user));
        updateAuthUI();
        navigateTo('home');
        showToast('Registration successful!', 'success');
        document.getElementById('registerPageForm').reset();
    } catch (error) {
        showToast('Registration failed. Please try again.', 'error');
    } finally {
        submitButton.textContent = originalText;
        submitButton.disabled = false;
    }
}

function handleLogout() {
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
