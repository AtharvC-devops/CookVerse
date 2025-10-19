// CookVerse API Integration
// This file handles all API calls to the backend

class CookVerseAPI {
  constructor() {
    // Simple configuration that works on all devices
    this.baseURL = '/api';
    this.token = localStorage.getItem('cookverse_token');
  }

  // Set authentication token
  setToken(token) {
    this.token = token;
    localStorage.setItem('cookverse_token', token);
  }

  // Remove authentication token
  removeToken() {
    this.token = null;
    localStorage.removeItem('cookverse_token');
  }

  // Get headers for API requests
  getHeaders() {
    const headers = {
      'Content-Type': 'application/json',
    };
    
    if (this.token) {
      headers['Authorization'] = `Bearer ${this.token}`;
    }
    
    return headers;
  }

  // Make API request
  async makeRequest(endpoint, options = {}) {
    const url = `${this.baseURL}${endpoint}`;
    const config = {
      headers: this.getHeaders(),
      ...options,
    };

    try {
      const response = await fetch(url, config);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'API request failed');
      }

      return data;
    } catch (error) {
      console.error('API Error:', error);
      throw error;
    }
  }

  // Authentication methods
  async register(userData) {
    return this.makeRequest('/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
  }

  async login(credentials) {
    const response = await this.makeRequest('/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    });
    
    if (response.token) {
      this.setToken(response.token);
    }
    
    return response;
  }

  async logout() {
    try {
      await this.makeRequest('/auth/logout', { method: 'POST' });
    } finally {
      this.removeToken();
    }
  }

  async getCurrentUser() {
    return this.makeRequest('/auth/me');
  }

  // Recipe methods
  async getRecipes(params = {}) {
    const queryString = new URLSearchParams(params).toString();
    return this.makeRequest(`/recipes${queryString ? `?${queryString}` : ''}`);
  }

  async getFeaturedRecipes() {
    return this.makeRequest('/recipes/featured');
  }

  async getRecipesByCategory(category, params = {}) {
    const queryString = new URLSearchParams(params).toString();
    return this.makeRequest(`/recipes/category/${category}${queryString ? `?${queryString}` : ''}`);
  }

  async getRecipe(id) {
    return this.makeRequest(`/recipes/${id}`);
  }

  async searchRecipes(query, filters = {}) {
    return this.makeRequest('/recipes/search', {
      method: 'POST',
      body: JSON.stringify({ query, filters }),
    });
  }

  // User methods
  async getUserProfile() {
    return this.makeRequest('/user/profile');
  }

  async updateUserProfile(profileData) {
    return this.makeRequest('/user/profile', {
      method: 'PUT',
      body: JSON.stringify(profileData),
    });
  }

  async getFavorites() {
    return this.makeRequest('/user/favorites');
  }

  async addToFavorites(recipeId) {
    return this.makeRequest(`/user/favorites/${recipeId}`, {
      method: 'POST',
    });
  }

  async removeFromFavorites(recipeId) {
    return this.makeRequest(`/user/favorites/${recipeId}`, {
      method: 'DELETE',
    });
  }

  async changePassword(passwordData) {
    return this.makeRequest('/user/password', {
      method: 'PUT',
      body: JSON.stringify(passwordData),
    });
  }

  // Subscription methods
  async getSubscriptionPlans() {
    return this.makeRequest('/subscriptions/plans');
  }

  async getSubscriptionStatus() {
    return this.makeRequest('/subscriptions/status');
  }

  async upgradeSubscription(plan) {
    return this.makeRequest('/subscriptions/upgrade', {
      method: 'POST',
      body: JSON.stringify({ plan }),
    });
  }

  async getSubscriptionFeatures() {
    return this.makeRequest('/subscriptions/features');
  }

  // Notification methods
  async getNotifications(params = {}) {
    const queryString = new URLSearchParams(params).toString();
    return this.makeRequest(`/notifications${queryString ? `?${queryString}` : ''}`);
  }

  async markNotificationAsRead(notificationId) {
    return this.makeRequest(`/notifications/${notificationId}/read`, {
      method: 'PUT',
    });
  }

  async markAllNotificationsAsRead() {
    return this.makeRequest('/notifications/read-all', {
      method: 'PUT',
    });
  }

  async getUnreadCount() {
    return this.makeRequest('/notifications/unread-count');
  }

  // Health check
  async healthCheck() {
    return this.makeRequest('/health');
  }
}

// Create global API instance
const api = new CookVerseAPI();

// Utility functions for common operations
const AuthUtils = {
  // Check if user is logged in
  isLoggedIn() {
    return !!api.token;
  },

  // Get user info from token (basic check)
  getCurrentUser() {
    if (!api.token) return null;
    
    try {
      const payload = JSON.parse(atob(api.token.split('.')[1]));
      return payload;
    } catch (error) {
      return null;
    }
  },

  // Redirect to login if not authenticated
  requireAuth() {
    if (!this.isLoggedIn()) {
      window.location.href = 'login.html';
      return false;
    }
    return true;
  }
};

// UI Helper functions
const UIHelpers = {
  // Show loading state
  showLoading(element) {
    if (element) {
      element.innerHTML = '<div class="loading">Loading...</div>';
    }
  },

  // Show error message
  showError(element, message) {
    if (element) {
      element.innerHTML = `<div class="error">${message}</div>`;
    }
  },

  // Show success message
  showSuccess(element, message) {
    if (element) {
      element.innerHTML = `<div class="success">${message}</div>`;
    }
  },

  // Format date
  formatDate(dateString) {
    return new Date(dateString).toLocaleDateString();
  },

  // Format time
  formatTime(minutes) {
    if (minutes < 60) {
      return `${minutes}m`;
    }
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return mins > 0 ? `${hours}h ${mins}m` : `${hours}h`;
  }
};

// Export for use in other files
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { CookVerseAPI, api, AuthUtils, UIHelpers };
}
