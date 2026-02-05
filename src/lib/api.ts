import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('token');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => Promise.reject(error),
);

// Response interceptor to handle errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      if (typeof window !== 'undefined') {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  },
);

export default api;

// Auth API
export const authApi = {
  register: (data: any) => api.post('/auth/register', data),
  login: (data: { email: string; password: string }) =>
    api.post('/auth/login', data),
  getMe: () => api.get('/auth/me'),
  updateProfile: (data: any) => api.put('/auth/profile', data),
  updateProviderProfile: (data: any) => api.put('/auth/provider-profile', data),
  changePassword: (data: { currentPassword: string; newPassword: string }) =>
    api.put('/auth/change-password', data),
};

// Meals API
export const mealsApi = {
  getAll: (params?: any) => api.get('/meals', { params }),
  getById: (id: string) => api.get(`/meals/${id}`),
  getByProvider: (providerId: string) =>
    api.get(`/meals/provider/${providerId}`),
};

// Providers API
export const providersApi = {
  getAll: (params?: any) => api.get('/providers', { params }),
  getById: (id: string) => api.get(`/providers/${id}`),
};

// Categories API
export const categoriesApi = {
  getAll: () => api.get('/categories'),
  getById: (id: string) => api.get(`/categories/${id}`),
};

// Orders API (Customer)
export const ordersApi = {
  create: (data: any) => api.post('/orders', data),
  getAll: (params?: any) => api.get('/orders', { params }),
  getById: (id: string) => api.get(`/orders/${id}`),
  cancel: (id: string) => api.patch(`/orders/${id}/cancel`),
};

// Reviews API
export const reviewsApi = {
  create: (data: any) => api.post('/reviews', data),
  getMealReviews: (mealId: string, params?: any) =>
    api.get(`/reviews/meal/${mealId}`, { params }),
  getMyReviews: () => api.get('/reviews/my-reviews'),
  update: (id: string, data: any) => api.put(`/reviews/${id}`, data),
  delete: (id: string) => api.delete(`/reviews/${id}`),
};

// Provider API
export const providerApi = {
  // Meals
  getMeals: (params?: any) => api.get('/provider/meals', { params }),
  createMeal: (data: any) => api.post('/provider/meals', data),
  updateMeal: (id: string, data: any) => api.put(`/provider/meals/${id}`, data),
  deleteMeal: (id: string) => api.delete(`/provider/meals/${id}`),
  toggleAvailability: (id: string) =>
    api.patch(`/provider/meals/${id}/toggle-availability`),
  // Orders
  getOrders: (params?: any) => api.get('/provider/orders', { params }),
  getOrderById: (id: string) => api.get(`/provider/orders/${id}`),
  updateOrderStatus: (id: string, status: string) =>
    api.patch(`/provider/orders/${id}/status`, { status }),
  // Stats
  getStats: () => api.get('/provider/stats'),
  getReviews: (params?: any) => api.get('/provider/reviews', { params }),
};

// Admin API
export const adminApi = {
  // Users
  getUsers: (params?: any) => api.get('/admin/users', { params }),
  getUserById: (id: string) => api.get(`/admin/users/${id}`),
  updateUserStatus: (id: string, status: string) =>
    api.patch(`/admin/users/${id}/status`, { status }),
  deleteUser: (id: string) => api.delete(`/admin/users/${id}`),
  // Orders
  getOrders: (params?: any) => api.get('/admin/orders', { params }),
  getOrderById: (id: string) => api.get(`/admin/orders/${id}`),
  // Categories
  createCategory: (data: any) => api.post('/admin/categories', data),
  updateCategory: (id: string, data: any) =>
    api.put(`/admin/categories/${id}`, data),
  deleteCategory: (id: string) => api.delete(`/admin/categories/${id}`),
  // Reviews
  getReviews: (params?: unknown) => api.get('/admin/reviews', { params }),
  deleteReview: (id: string) => api.delete(`/admin/reviews/${id}`),
  // Stats
  getStats: () => api.get('/admin/stats'),
};
