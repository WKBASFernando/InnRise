// ===================== TOKEN MANAGEMENT =====================
class TokenManager {
    constructor() {
        this.accessToken = localStorage.getItem('token');
        this.refreshToken = localStorage.getItem('refreshToken');
        this.isRefreshing = false;
        this.failedQueue = [];
    }

    // Get current access token
    getAccessToken() {
        return this.accessToken;
    }

    // Get current refresh token
    getRefreshToken() {
        return this.refreshToken;
    }

    // Set tokens after login
    setTokens(accessToken, refreshToken) {
        this.accessToken = accessToken;
        this.refreshToken = refreshToken;
        localStorage.setItem('token', accessToken);
        localStorage.setItem('refreshToken', refreshToken);
    }

    // Clear tokens on logout
    clearTokens() {
        this.accessToken = null;
        this.refreshToken = null;
        localStorage.removeItem('token');
        localStorage.removeItem('refreshToken');
    }

    // Check if user is authenticated
    isAuthenticated() {
        return !!(this.accessToken && this.refreshToken);
    }

    // Refresh access token using refresh token
    async refreshAccessToken() {
        if (this.isRefreshing) {
            // If already refreshing, wait for it to complete
            return new Promise((resolve, reject) => {
                this.failedQueue.push({ resolve, reject });
            });
        }

        if (!this.refreshToken) {
            throw new Error('No refresh token available');
        }

        this.isRefreshing = true;

        try {
            const response = await $.ajax({
                url: 'http://localhost:8080/auth/refresh',
                type: 'POST',
                contentType: 'application/json',
                data: JSON.stringify({ refreshToken: this.refreshToken })
            });

            if (response.data && response.data.accessToken) {
                this.setTokens(response.data.accessToken, response.data.refreshToken);
                
                // Process failed queue
                this.failedQueue.forEach(({ resolve }) => resolve(response.data.accessToken));
                this.failedQueue = [];
                
                return response.data.accessToken;
            } else {
                throw new Error('Invalid refresh response');
            }
        } catch (error) {
            // Process failed queue with error
            this.failedQueue.forEach(({ reject }) => reject(error));
            this.failedQueue = [];
            
            // Clear tokens on refresh failure
            this.clearTokens();
            window.location.href = 'signin.html';
            throw error;
        } finally {
            this.isRefreshing = false;
        }
    }

    // Logout user
    async logout() {
        try {
            if (this.refreshToken) {
                await $.ajax({
                    url: 'http://localhost:8080/auth/logout',
                    type: 'POST',
                    contentType: 'application/json',
                    data: JSON.stringify({ refreshToken: this.refreshToken })
                });
            }
        } catch (error) {
            console.error('Logout error:', error);
        } finally {
            this.clearTokens();
            window.location.href = 'signin.html';
        }
    }

    // Make authenticated request with automatic token refresh
    async makeAuthenticatedRequest(options) {
        const originalRequest = () => {
            return $.ajax({
                ...options,
                headers: {
                    ...options.headers,
                    'Authorization': `Bearer ${this.accessToken}`,
                    'Content-Type': 'application/json'
                }
            });
        };

        try {
            return await originalRequest();
        } catch (error) {
            if (error.status === 401 && this.refreshToken) {
                // Token expired, try to refresh
                try {
                    await this.refreshAccessToken();
                    // Retry original request with new token
                    return await originalRequest();
                } catch (refreshError) {
                    console.error('Token refresh failed:', refreshError);
                    this.clearTokens();
                    window.location.href = 'signin.html';
                    throw refreshError;
                }
            } else {
                throw error;
            }
        }
    }
}

// Create global instance
window.tokenManager = new TokenManager();

