// API Configuration
const API_BASE_URL = ''; // Empty string for relative paths since frontend is served from backend

// Helper function to get CSRF token from cookie
function getCsrfToken() {
    const cookies = document.cookie.split(';');
    for (let cookie of cookies) {
        const [name, value] = cookie.trim().split('=');
        if (name === 'XSRF-TOKEN') {
            return decodeURIComponent(value);
        }
    }
    return null;
}

// API Call Function
async function apiCall(endpoint, options = {}) {
    try {
        const headers = {
            'Content-Type': 'application/json',
            ...options.headers
        };

        // Add CSRF token for state-changing requests
        if (options.method && ['POST', 'PUT', 'DELETE', 'PATCH'].includes(options.method.toUpperCase())) {
            const csrfToken = getCsrfToken();
            if (csrfToken) {
                headers['X-XSRF-TOKEN'] = csrfToken;
            }
        }

        const response = await fetch(`${API_BASE_URL}${endpoint}`, {
            headers: headers,
            credentials: 'include', // Include cookies for httpOnly JWT and CSRF
            ...options
        });

        if (!response.ok) {
            // Try to parse error response for validation errors
            let errorData = null;
            try {
                errorData = await response.json();
            } catch (e) {
                // If response is not JSON, use status text
            }

            const error = new Error(`HTTP error! status: ${response.status}`);
            error.status = response.status;
            error.data = errorData;
            throw error;
        }

        // Handle DELETE requests that return no body
        if (options.method === 'DELETE') {
            return null;
        }

        // Check if response is JSON
        const contentType = response.headers.get('content-type');
        if (contentType && contentType.includes('application/json')) {
            return await response.json();
        } else {
            // Return text response for non-JSON responses
            return await response.text();
        }
    } catch (error) {
        console.error('API Error:', error);
        throw error;
    }
}
