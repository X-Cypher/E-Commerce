// Main Application Initialization

// Initialize App
document.addEventListener('DOMContentLoaded', () => {
    initializeApp();
});

function initializeApp() {
    setupNavigation();
    setupModals();
    setupForms();
    setupEventListeners();
    loadProducts();
    checkLoggedInUser();
    populateCategoryFilter();
}
