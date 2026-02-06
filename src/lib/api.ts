// import axios, { AxiosResponse } from 'axios';

// const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

// export enum UserRole {
//   CUSTOMER = 'CUSTOMER',
//   PROVIDER = 'PROVIDER',
//   ADMIN = 'ADMIN',
// }

// export enum UserStatus {
//   ACTIVE = 'ACTIVE',
//   SUSPENDED = 'SUSPENDED',
// }

// export enum OrderStatus {
//   PENDING = 'PENDING',
//   CONFIRMED = 'CONFIRMED',
//   PREPARING = 'PREPARING',
//   OUT_FOR_DELIVERY = 'OUT_FOR_DELIVERY',
//   DELIVERED = 'DELIVERED',
//   CANCELLED = 'CANCELLED',
// }

// export interface User {
//   id: string;
//   email: string;
//   name: string;
//   phone?: string;
//   role: UserRole;
//   status: UserStatus;
//   createdAt: string;
//   updatedAt: string;
//   providerProfile?: ProviderProfile;
// }

// export interface ProviderProfile {
//   id: string;
//   userId: string;
//   restaurantName: string;
//   description?: string;
//   address: string;
//   openingHours?: string;
//   closingHours?: string;
//   imageUrl?: string;
//   createdAt: string;
//   updatedAt: string;
// }

// export interface Category {
//   id: string;
//   name: string;
//   description?: string;
//   createdAt: string;
//   updatedAt: string;
// }

// export interface Meal {
//   id: string;
//   providerId: string;
//   categoryId: string;
//   name: string;
//   description: string;
//   price: number;
//   imageUrl?: string;
//   ingredients?: string;
//   isAvailable: boolean;
//   dietaryInfo?: string;
//   createdAt: string;
//   updatedAt: string;
//   category?: Category;
//   provider?: User;
//   averageRating?: number;
//   reviewCount?: number;
// }

// export interface OrderItem {
//   id: string;
//   orderId: string;
//   mealId: string;
//   quantity: number;
//   priceAtOrder: number;
//   createdAt: string;
//   meal?: Meal;
// }

// export interface Order {
//   id: string;
//   customerId: string;
//   providerId: string;
//   status: OrderStatus;
//   deliveryAddress: string;
//   contactPhone: string;
//   orderNotes?: string;
//   totalAmount: number;
//   createdAt: string;
//   updatedAt: string;
//   customer?: User;
//   provider?: User;
//   orderItems?: OrderItem[];
// }

// export interface Review {
//   id: string;
//   customerId: string;
//   mealId: string;
//   orderId: string;
//   rating: number;
//   comment?: string;
//   createdAt: string;
//   updatedAt: string;
//   customer?: User;
//   meal?: Meal;
//   order?: Order;
// }

// // DTOs (Data Transfer Objects)
// export interface RegisterDto {
//   email: string;
//   password: string;
//   name: string;
//   phone?: string;
//   role: UserRole.CUSTOMER | UserRole.PROVIDER;
//   restaurantName?: string;
//   description?: string;
//   address?: string;
// }

// export interface LoginDto {
//   email: string;
//   password: string;
// }

// export interface UpdateProfileDto {
//   name?: string;
//   phone?: string;
//   email?: string;
// }

// export interface UpdateProviderProfileDto {
//   restaurantName?: string;
//   description?: string;
//   address?: string;
//   openingHours?: string;
//   closingHours?: string;
//   imageUrl?: string;
// }

// export interface ChangePasswordDto {
//   currentPassword: string;
//   newPassword: string;
// }

// export interface CreateMealDto {
//   categoryId: string;
//   name: string;
//   description: string;
//   price: number;
//   imageUrl?: string;
//   ingredients?: string;
//   dietaryInfo?: string;
//   isAvailable?: boolean;
// }

// export interface UpdateMealDto {
//   categoryId?: string;
//   name?: string;
//   description?: string;
//   price?: number;
//   imageUrl?: string;
//   ingredients?: string;
//   dietaryInfo?: string;
//   isAvailable?: boolean;
// }

// export interface CreateOrderDto {
//   providerId: string;
//   items: Array<{
//     mealId: string;
//     quantity: number;
//   }>;
//   deliveryAddress: string;
//   contactPhone: string;
//   orderNotes?: string;
// }

// export interface CreateReviewDto {
//   orderId: string;
//   mealId: string;
//   rating: number;
//   comment?: string;
// }

// export interface UpdateReviewDto {
//   rating?: number;
//   comment?: string;
// }

// export interface CreateCategoryDto {
//   name: string;
//   description?: string;
// }

// export interface UpdateCategoryDto {
//   name?: string;
//   description?: string;
// }

// // Filter types
// export interface MealFilters {
//   categoryId?: string;
//   minPrice?: number;
//   maxPrice?: number;
//   dietaryInfo?: string;
//   search?: string;
//   providerId?: string;
//   isAvailable?: boolean;
//   page?: number;
//   limit?: number;
// }

// export interface OrderFilters {
//   status?: OrderStatus;
//   providerId?: string;
//   customerId?: string;
//   page?: number;
//   limit?: number;
// }

// export interface ReviewFilters {
//   mealId?: string;
//   customerId?: string;
//   rating?: number;
//   page?: number;
//   limit?: number;
// }

// export interface UserFilters {
//   role?: UserRole;
//   status?: UserStatus;
//   search?: string;
//   page?: number;
//   limit?: number;
// }

// export interface ProviderFilters {
//   search?: string;
//   page?: number;
//   limit?: number;
// }

// export interface UpdateUserStatusDto {
//   status: UserStatus;
// }

// export interface UpdateOrderStatusDto {
//   status: OrderStatus;
// }

// // Response types
// export interface ApiResponse<T> {
//   success: boolean;
//   data: T;
//   message?: string;
// }

// export interface AuthResponse {
//   success: boolean;
//   data: {
//     user: User;
//     token: string;
//   };
//   message?: string;
// }

// export interface PaginatedResponse<T> {
//   success: boolean;
//   data: T[];
//   pagination: {
//     page: number;
//     limit: number;
//     total: number;
//     totalPages: number;
//   };
// }

// export interface ProviderStats {
//   totalOrders: number;
//   totalRevenue: number;
//   pendingOrders: number;
//   completedOrders: number;
//   totalMeals: number;
//   averageRating: number;
//   popularMeals: Array<{
//     meal: Meal;
//     orderCount: number;
//   }>;
// }

// export interface AdminStats {
//   totalUsers: number;
//   totalCustomers: number;
//   totalProviders: number;
//   totalOrders: number;
//   totalRevenue: number;
//   activeProviders: number;
//   recentOrders: Order[];
// }

// // ============================================
// // Axios Instance
// // ============================================

// const api = axios.create({
//   baseURL: API_URL,
//   headers: {
//     'Content-Type': 'application/json',
//   },
// });

// // Request interceptor to add auth token
// api.interceptors.request.use(
//   (config) => {
//     if (typeof window !== 'undefined') {
//       const token = localStorage.getItem('token');
//       if (token) {
//         config.headers.Authorization = `Bearer ${token}`;
//       }
//     }
//     return config;
//   },
//   (error) => Promise.reject(error),
// );

// // Response interceptor to handle errors
// api.interceptors.response.use(
//   (response) => response,
//   (error) => {
//     if (error.response?.status === 401) {
//       if (typeof window !== 'undefined') {
//         localStorage.removeItem('token');
//         localStorage.removeItem('user');
//         window.location.href = '/login';
//       }
//     }
//     return Promise.reject(error);
//   },
// );

// export default api;

// // ============================================
// // Auth API
// // ============================================

// export const authApi = {
//   register: (data: RegisterDto): Promise<AxiosResponse<AuthResponse>> =>
//     api.post('/auth/register', data),

//   login: (data: LoginDto): Promise<AxiosResponse<AuthResponse>> =>
//     api.post('/auth/login', data),

//   getMe: (): Promise<AxiosResponse<ApiResponse<User>>> => api.get('/auth/me'),

//   updateProfile: (
//     data: UpdateProfileDto,
//   ): Promise<AxiosResponse<ApiResponse<User>>> =>
//     api.put('/auth/profile', data),

//   updateProviderProfile: (
//     data: UpdateProviderProfileDto,
//   ): Promise<AxiosResponse<ApiResponse<User>>> =>
//     api.put('/auth/provider-profile', data),

//   changePassword: (
//     data: ChangePasswordDto,
//   ): Promise<AxiosResponse<ApiResponse<void>>> =>
//     api.put('/auth/change-password', data),
// };

// // ============================================
// // Meals API
// // ============================================

// export const mealsApi = {
//   getAll: (
//     params?: MealFilters,
//   ): Promise<AxiosResponse<PaginatedResponse<Meal>>> =>
//     api.get('/meals', { params }),

//   getById: (id: string): Promise<AxiosResponse<ApiResponse<Meal>>> =>
//     api.get(`/meals/${id}`),

//   getByProvider: (
//     providerId: string,
//   ): Promise<AxiosResponse<ApiResponse<Meal[]>>> =>
//     api.get(`/meals/provider/${providerId}`),
// };

// // ============================================
// // Providers API
// // ============================================

// export const providersApi = {
//   getAll: (
//     params?: ProviderFilters,
//   ): Promise<AxiosResponse<PaginatedResponse<User>>> =>
//     api.get('/providers', { params }),

//   getById: (id: string): Promise<AxiosResponse<ApiResponse<User>>> =>
//     api.get(`/providers/${id}`),
// };

// // ============================================
// // Categories API
// // ============================================

// export const categoriesApi = {
//   getAll: (): Promise<AxiosResponse<ApiResponse<Category[]>>> =>
//     api.get('/categories'),

//   getById: (id: string): Promise<AxiosResponse<ApiResponse<Category>>> =>
//     api.get(`/categories/${id}`),
// };

// // ============================================
// // Orders API (Customer)
// // ============================================

// export const ordersApi = {
//   create: (data: CreateOrderDto): Promise<AxiosResponse<ApiResponse<Order>>> =>
//     api.post('/orders', data),

//   getAll: (
//     params?: OrderFilters,
//   ): Promise<AxiosResponse<PaginatedResponse<Order>>> =>
//     api.get('/orders', { params }),

//   getById: (id: string): Promise<AxiosResponse<ApiResponse<Order>>> =>
//     api.get(`/orders/${id}`),

//   cancel: (id: string): Promise<AxiosResponse<ApiResponse<Order>>> =>
//     api.patch(`/orders/${id}/cancel`),
// };

// // ============================================
// // Reviews API
// // ============================================

// export const reviewsApi = {
//   create: (
//     data: CreateReviewDto,
//   ): Promise<AxiosResponse<ApiResponse<Review>>> => api.post('/reviews', data),

//   getMealReviews: (
//     mealId: string,
//     params?: ReviewFilters,
//   ): Promise<AxiosResponse<PaginatedResponse<Review>>> =>
//     api.get(`/reviews/meal/${mealId}`, { params }),

//   getMyReviews: (): Promise<AxiosResponse<ApiResponse<Review[]>>> =>
//     api.get('/reviews/my-reviews'),

//   update: (
//     id: string,
//     data: UpdateReviewDto,
//   ): Promise<AxiosResponse<ApiResponse<Review>>> =>
//     api.put(`/reviews/${id}`, data),

//   delete: (id: string): Promise<AxiosResponse<ApiResponse<void>>> =>
//     api.delete(`/reviews/${id}`),
// };

// // ============================================
// // Provider API
// // ============================================

// export const providerApi = {
//   // Meals
//   getMeals: (
//     params?: MealFilters,
//   ): Promise<AxiosResponse<PaginatedResponse<Meal>>> =>
//     api.get('/provider/meals', { params }),

//   createMeal: (
//     data: CreateMealDto,
//   ): Promise<AxiosResponse<ApiResponse<Meal>>> =>
//     api.post('/provider/meals', data),

//   updateMeal: (
//     id: string,
//     data: UpdateMealDto,
//   ): Promise<AxiosResponse<ApiResponse<Meal>>> =>
//     api.put(`/provider/meals/${id}`, data),

//   deleteMeal: (id: string): Promise<AxiosResponse<ApiResponse<void>>> =>
//     api.delete(`/provider/meals/${id}`),

//   toggleAvailability: (id: string): Promise<AxiosResponse<ApiResponse<Meal>>> =>
//     api.patch(`/provider/meals/${id}/toggle-availability`),

//   // Orders
//   getOrders: (
//     params?: OrderFilters,
//   ): Promise<AxiosResponse<PaginatedResponse<Order>>> =>
//     api.get('/provider/orders', { params }),

//   getOrderById: (id: string): Promise<AxiosResponse<ApiResponse<Order>>> =>
//     api.get(`/provider/orders/${id}`),

//   updateOrderStatus: (
//     id: string,
//     status: UpdateOrderStatusDto,
//   ): Promise<AxiosResponse<ApiResponse<Order>>> =>
//     api.patch(`/provider/orders/${id}/status`, status),

//   // Stats
//   getStats: (): Promise<AxiosResponse<ApiResponse<ProviderStats>>> =>
//     api.get('/provider/stats'),

//   getReviews: (
//     params?: ReviewFilters,
//   ): Promise<AxiosResponse<PaginatedResponse<Review>>> =>
//     api.get('/provider/reviews', { params }),
// };

// // ============================================
// // Admin API
// // ============================================

// export const adminApi = {
//   // Users
//   getUsers: (
//     params?: UserFilters,
//   ): Promise<AxiosResponse<PaginatedResponse<User>>> =>
//     api.get('/admin/users', { params }),

//   getUserById: (id: string): Promise<AxiosResponse<ApiResponse<User>>> =>
//     api.get(`/admin/users/${id}`),

//   updateUserStatus: (
//     id: string,
//     data: UpdateUserStatusDto,
//   ): Promise<AxiosResponse<ApiResponse<User>>> =>
//     api.patch(`/admin/users/${id}/status`, data),

//   deleteUser: (id: string): Promise<AxiosResponse<ApiResponse<void>>> =>
//     api.delete(`/admin/users/${id}`),

//   // Orders
//   getOrders: (
//     params?: OrderFilters,
//   ): Promise<AxiosResponse<PaginatedResponse<Order>>> =>
//     api.get('/admin/orders', { params }),

//   getOrderById: (id: string): Promise<AxiosResponse<ApiResponse<Order>>> =>
//     api.get(`/admin/orders/${id}`),

//   // Categories
//   createCategory: (
//     data: CreateCategoryDto,
//   ): Promise<AxiosResponse<ApiResponse<Category>>> =>
//     api.post('/admin/categories', data),

//   updateCategory: (
//     id: string,
//     data: UpdateCategoryDto,
//   ): Promise<AxiosResponse<ApiResponse<Category>>> =>
//     api.put(`/admin/categories/${id}`, data),

//   deleteCategory: (id: string): Promise<AxiosResponse<ApiResponse<void>>> =>
//     api.delete(`/admin/categories/${id}`),

//   // Reviews
//   getReviews: (
//     params?: ReviewFilters,
//   ): Promise<AxiosResponse<PaginatedResponse<Review>>> =>
//     api.get('/admin/reviews', { params }),

//   deleteReview: (id: string): Promise<AxiosResponse<ApiResponse<void>>> =>
//     api.delete(`/admin/reviews/${id}`),

//   // Stats
//   getStats: (): Promise<AxiosResponse<ApiResponse<AdminStats>>> =>
//     api.get('/admin/stats'),
// };

// -----------------------

import axios from 'axios';
import {
  Meal,
  Category,
  Order,
  Review,
  User,
  Role,
  UserStatus,
  OrderStatus,
  DietaryType,
} from '@/types';

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

// Types for API requests
export interface RegisterData {
  email: string;
  password: string;
  name: string;
  phone?: string;
  role: Role;
  restaurantName?: string;
  description?: string;
  address?: string;
  openingHours?: string;
  closingHours?: string;
}

export interface LoginData {
  email: string;
  password: string;
}

export interface UpdateProfileData {
  name?: string;
  phone?: string;
  email?: string;
}

export interface UpdateProviderProfileData {
  restaurantName?: string;
  description?: string;
  address?: string;
  openingHours?: string;
  closingHours?: string;
  imageUrl?: string;
}

export interface ChangePasswordData {
  currentPassword: string;
  newPassword: string;
}

export interface MealQueryParams {
  category?: string;
  categoryId?: string;
  search?: string;
  minPrice?: number;
  maxPrice?: number;
  isVegetarian?: boolean;
  isVegan?: boolean;
  isGlutenFree?: boolean;
  isAvailable?: boolean;
  page?: number;
  limit?: number;
}

export interface ProviderQueryParams {
  search?: string;
  page?: number;
  limit?: number;
}

export interface CreateMealData {
  name: string;
  description: string;
  price: number;
  categoryId: string;
  imageUrl?: string;
  ingredients?: string;
  isVegetarian?: boolean;
  isVegan?: boolean;
  isGlutenFree?: boolean;
  isAvailable?: boolean;
  dietaryInfo?: DietaryType;
}

export interface UpdateMealData {
  name?: string;
  description?: string;
  price?: number;
  categoryId?: string;
  imageUrl?: string;
  ingredients?: string;
  isVegetarian?: boolean;
  isVegan?: boolean;
  isGlutenFree?: boolean;
  isAvailable?: boolean;
  dietaryInfo?: DietaryType;
}

export interface OrderItem {
  mealId: string;
  quantity: number;
  priceAtOrder: number;
}

export interface CreateOrderData {
  providerId: string;
  items: OrderItem[];
  deliveryAddress: string;
  contactPhone: string;
  orderNotes?: string;
  totalAmount: number;
}

export interface OrderQueryParams {
  status?: string;
  startDate?: string;
  endDate?: string;
  page?: number;
  limit?: number;
}

export interface CreateReviewData {
  mealId: string;
  orderId: string;
  rating: number;
  comment?: string;
}

export interface UpdateReviewData {
  rating?: number;
  comment?: string;
}

export interface ReviewQueryParams {
  page?: number;
  limit?: number;
  rating?: number;
}

export interface UserQueryParams {
  role?: Role;
  status?: UserStatus;
  search?: string;
  page?: number;
  limit?: number;
}

export interface CreateCategoryData {
  name: string;
  description?: string;
}

export interface UpdateCategoryData {
  name?: string;
  description?: string;
}

// Auth API
export const authApi = {
  register: (data: RegisterData) => api.post('/auth/register', data),
  login: (data: LoginData) => api.post('/auth/login', data),
  getMe: () => api.get('/auth/me'),
  updateProfile: (data: UpdateProfileData) => api.put('/auth/profile', data),
  updateProviderProfile: (data: UpdateProviderProfileData) =>
    api.put('/auth/provider-profile', data),
  changePassword: (data: ChangePasswordData) =>
    api.put('/auth/change-password', data),
};

// Meals API
export const mealsApi = {
  getAll: (params?: MealQueryParams) => api.get('/meals', { params }),
  getById: (id: string) => api.get(`/meals/${id}`),
  getByProvider: (providerId: string) =>
    api.get(`/meals/provider/${providerId}`),
};

// Providers API
export const providersApi = {
  getAll: (params?: ProviderQueryParams) => api.get('/providers', { params }),
  getById: (id: string) => api.get(`/providers/${id}`),
};

// Categories API
export const categoriesApi = {
  getAll: () => api.get('/categories'),
  getById: (id: string) => api.get(`/categories/${id}`),
};

// Orders API (Customer)
export const ordersApi = {
  create: (data: CreateOrderData) => api.post('/orders', data),
  getAll: (params?: OrderQueryParams) => api.get('/orders', { params }),
  getById: (id: string) => api.get(`/orders/${id}`),
  cancel: (id: string) => api.patch(`/orders/${id}/cancel`),
};

// Reviews API
export const reviewsApi = {
  create: (data: CreateReviewData) => api.post('/reviews', data),
  getMealReviews: (mealId: string, params?: ReviewQueryParams) =>
    api.get(`/reviews/meal/${mealId}`, { params }),
  getMyReviews: () => api.get('/reviews/my-reviews'),
  update: (id: string, data: UpdateReviewData) =>
    api.put(`/reviews/${id}`, data),
  delete: (id: string) => api.delete(`/reviews/${id}`),
};

// Provider API
export const providerApi = {
  // Meals
  getMeals: (params?: MealQueryParams) =>
    api.get('/provider/meals', { params }),
  createMeal: (data: CreateMealData) => api.post('/provider/meals', data),
  updateMeal: (id: string, data: UpdateMealData) =>
    api.put(`/provider/meals/${id}`, data),
  deleteMeal: (id: string) => api.delete(`/provider/meals/${id}`),
  toggleAvailability: (id: string) =>
    api.patch(`/provider/meals/${id}/toggle-availability`),
  // Orders
  getOrders: (params?: OrderQueryParams) =>
    api.get('/provider/orders', { params }),
  getOrderById: (id: string) => api.get(`/provider/orders/${id}`),
  updateOrderStatus: (id: string, status: string) =>
    api.patch(`/provider/orders/${id}/status`, { status }),
  // Stats
  getStats: () => api.get('/provider/stats'),
  getReviews: (params?: ReviewQueryParams) =>
    api.get('/provider/reviews', { params }),
};

// Admin API
export const adminApi = {
  // Users
  getUsers: (params?: UserQueryParams) => api.get('/admin/users', { params }),
  getUserById: (id: string) => api.get(`/admin/users/${id}`),
  updateUserStatus: (id: string, status: UserStatus) =>
    api.patch(`/admin/users/${id}/status`, { status }),
  deleteUser: (id: string) => api.delete(`/admin/users/${id}`),
  // Orders
  getOrders: (params?: OrderQueryParams) =>
    api.get('/admin/orders', { params }),
  getOrderById: (id: string) => api.get(`/admin/orders/${id}`),
  // Categories
  createCategory: (data: CreateCategoryData) =>
    api.post('/admin/categories', data),
  updateCategory: (id: string, data: UpdateCategoryData) =>
    api.put(`/admin/categories/${id}`, data),
  deleteCategory: (id: string) => api.delete(`/admin/categories/${id}`),
  // Reviews
  getReviews: (params?: ReviewQueryParams) =>
    api.get('/admin/reviews', { params }),
  deleteReview: (id: string) => api.delete(`/admin/reviews/${id}`),
  // Stats
  getStats: () => api.get('/admin/stats'),
};
