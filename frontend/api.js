// API Configuration
const API_URL = 'http://localhost:5000/api'; // For local development
// const API_URL = 'https://your-railway-backend.railway.app/api'; // For production

// Helper function to get token
function getToken() {
  return localStorage.getItem('token');
}

// Helper function to set token
function setToken(token) {
  localStorage.setItem('token', token);
}

// Helper function to remove token
function removeToken() {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
}

// Helper function to get current user
function getCurrentUser() {
  const user = localStorage.getItem('user');
  return user ? JSON.parse(user) : null;
}

// Helper function to check if logged in
function isLoggedIn() {
  return !!getToken();
}

// Generic fetch wrapper
async function apiFetch(endpoint, options = {}) {
  const token = getToken();
  
  const config = {
    method: options.method || 'GET',
    headers: {
      'Content-Type': 'application/json',
      ...(token && { 'Authorization': `Bearer ${token}` }),
      ...options.headers
    },
    ...options
  };

  if (options.body && typeof options.body === 'object') {
    config.body = JSON.stringify(options.body);
  }

  try {
    const response = await fetch(`${API_URL}${endpoint}`, config);
    const data = await response.json();

    // Handle unauthorized
    if (response.status === 401) {
      removeToken();
      window.location.href = '/login.html';
      throw new Error('Unauthorized - Please login again');
    }

    if (!response.ok) {
      throw new Error(data.message || data.error || 'Request failed');
    }

    return data;
  } catch (error) {
    console.error('API Error:', error);
    throw error;
  }
}

// ==================== AUTH API ====================

const authAPI = {
  // Register new user
  register: async (name, email, password, phone) => {
    try {
      const response = await apiFetch('/auth/register', {
        method: 'POST',
        body: { name, email, password, phone }
      });

      if (response.success && response.data.token) {
        setToken(response.data.token);
        localStorage.setItem('user', JSON.stringify(response.data));
      }

      return response;
    } catch (error) {
      throw error;
    }
  },

  // Login user
  login: async (email, password) => {
    try {
      const response = await apiFetch('/auth/login', {
        method: 'POST',
        body: { email, password }
      });

      if (response.success && response.data.token) {
        setToken(response.data.token);
        localStorage.setItem('user', JSON.stringify(response.data));
      }

      return response;
    } catch (error) {
      throw error;
    }
  },

  // Get user profile
  getProfile: async () => {
    try {
      return await apiFetch('/auth/profile');
    } catch (error) {
      throw error;
    }
  },

  // Logout
  logout: () => {
    removeToken();
    window.location.href = '/login.html';
  }
};

// ==================== HOTELS API ====================

const hotelsAPI = {
  // Get all hotels
  getAll: async () => {
    try {
      return await apiFetch('/hotels');
    } catch (error) {
      throw error;
    }
  },

  // Get hotel by ID
  getById: async (id) => {
    try {
      return await apiFetch(`/hotels/${id}`);
    } catch (error) {
      throw error;
    }
  },

  // Search hotels
  search: async (city, checkIn, checkOut, guests) => {
    try {
      const params = new URLSearchParams();
      if (city) params.append('city', city);
      if (checkIn) params.append('checkIn', checkIn);
      if (checkOut) params.append('checkOut', checkOut);
      if (guests) params.append('guests', guests);

      return await apiFetch(`/hotels/search?${params.toString()}`);
    } catch (error) {
      throw error;
    }
  },

  // Get featured hotels
  getFeatured: async () => {
    try {
      return await apiFetch('/hotels/featured');
    } catch (error) {
      throw error;
    }
  }
};

// ==================== BOOKINGS API ====================

const bookingsAPI = {
  // Create new booking
  create: async (bookingData) => {
    try {
      return await apiFetch('/bookings', {
        method: 'POST',
        body: bookingData
      });
    } catch (error) {
      throw error;
    }
  },

  // Get my bookings
  getMyBookings: async () => {
    try {
      return await apiFetch('/bookings/my-bookings');
    } catch (error) {
      throw error;
    }
  },

  // Get booking by ID
  getById: async (id) => {
    try {
      return await apiFetch(`/bookings/${id}`);
    } catch (error) {
      throw error;
    }
  },

  // Cancel booking
  cancel: async (id) => {
    try {
      return await apiFetch(`/bookings/${id}/cancel`, {
        method: 'PATCH'
      });
    } catch (error) {
      throw error;
    }
  }
};

// ==================== UTILITY FUNCTIONS ====================

// Check if user is authenticated on page load
function checkAuth() {
  if (!isLoggedIn()) {
    const publicPages = ['login.html', 'index.html', 'hotel.html'];
    const currentPage = window.location.pathname.split('/').pop();
    
    if (!publicPages.includes(currentPage)) {
      window.location.href = '/login.html';
    }
  }
}

// Display user info in navbar
function displayUserInfo() {
  const user = getCurrentUser();
  const userInfoElement = document.getElementById('userInfo');
  
  if (user && userInfoElement) {
    userInfoElement.innerHTML = `
      <span>Welcome, ${user.name}</span>
      <button onclick="authAPI.logout()">Logout</button>
    `;
  }
}

// Show loading spinner
function showLoading(elementId) {
  const element = document.getElementById(elementId);
  if (element) {
    element.innerHTML = '<div class="loading">Loading...</div>';
  }
}

// Show error message
function showError(elementId, message) {
  const element = document.getElementById(elementId);
  if (element) {
    element.innerHTML = `<div class="error">${message}</div>`;
  }
}

// Export for use in other files
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    authAPI,
    hotelsAPI,
    bookingsAPI,
    getCurrentUser,
    isLoggedIn,
    checkAuth,
    displayUserInfo,
    showLoading,
    showError
  };
}