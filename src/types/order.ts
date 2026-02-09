// Order Status Types
export type OrderStatus =
  | 'PENDING'
  | 'CONFIRMED'
  | 'PREPARING'
  | 'READY_FOR_PICKUP'
  | 'OUT_FOR_DELIVERY'
  | 'DELIVERED'
  | 'CANCELLED';

// Order Status History
export interface OrderStatusHistory {
  id: string;
  orderId: string;
  status: OrderStatus;
  note?: string;
  createdAt: string;
}

// Payment Types
export type PaymentMethod = 'CASH_ON_DELIVERY' | 'CARD' | 'ONLINE';
export type PaymentStatus = 'PENDING' | 'PAID' | 'FAILED' | 'REFUNDED';

// Order Item
export interface OrderItem {
  id: string;
  orderId: string;
  mealId: string;
  quantity: number;
  priceAtOrder: number;
  createdAt: string;
  meal?: Meal;
}

// Order
export interface Order {
  id: string;
  customerId: string;
  providerId: string;
  status: OrderStatus;
  deliveryAddress: string;
  contactPhone: string;
  orderNotes?: string;
  totalAmount: number;
  paymentMethod: string;
  paymentStatus: string;
  estimatedDeliveryTime?: string;
  actualDeliveryTime?: string;
  cancellationReason?: string;
  createdAt: string;
  updatedAt: string;
  orderItems?: OrderItem[];
  statusHistory?: OrderStatusHistory[];
  customer?: User;
  provider?: User;
}

// User Types
export type Role = 'CUSTOMER' | 'PROVIDER' | 'ADMIN';
export type UserStatus = 'ACTIVE' | 'SUSPENDED';

export interface User {
  id: string;
  email: string;
  name: string;
  phone?: string;
  address?: string;
  role: Role;
  status: UserStatus;
  createdAt: string;
  updatedAt: string;
  providerProfile?: ProviderProfile;
}

// Provider Profile
export interface ProviderProfile {
  id: string;
  userId: string;
  restaurantName: string;
  description?: string;
  address: string;
  openingHours: string;
  closingHours: string;
  imageUrl?: string;
  cuisineType?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

// Dietary Types
export type DietaryType =
  | 'NONE'
  | 'VEGETARIAN'
  | 'VEGAN'
  | 'GLUTEN_FREE'
  | 'DAIRY_FREE'
  | 'NUT_FREE'
  | 'HALAL'
  | 'KOSHER';

// Meal
export interface Meal {
  id: string;
  providerId: string;
  categoryId: string;
  name: string;
  description: string;
  price: number;
  imageUrl?: string;
  ingredients?: string;
  isAvailable: boolean;
  dietaryInfo: DietaryType;
  prepTime: number;
  createdAt: string;
  updatedAt: string;
  provider?: User;
  category?: Category;
}

// Category
export interface Category {
  id: string;
  name: string;
  description?: string;
  imageUrl?: string;
  createdAt: string;
  updatedAt: string;
}

// Review
export interface Review {
  id: string;
  customerId: string;
  mealId: string;
  orderId: string;
  rating: number;
  comment?: string;
  createdAt: string;
  updatedAt: string;
  customer?: User;
  meal?: Meal;
}

// API Response Types
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}
