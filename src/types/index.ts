// export enum Role {
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

// export enum DietaryType {
//   NONE = 'NONE',
//   VEGETARIAN = 'VEGETARIAN',
//   VEGAN = 'VEGAN',
//   GLUTEN_FREE = 'GLUTEN_FREE',
//   DAIRY_FREE = 'DAIRY_FREE',
//   NUT_FREE = 'NUT_FREE',
//   HALAL = 'HALAL',
//   KOSHER = 'KOSHER',
// }

// export interface User {
//   id: string;
//   email: string;
//   name: string;
//   phone?: string;
//   address?: string;
//   role: Role;
//   status: UserStatus;
//   createdAt: string;
//   providerProfile?: ProviderProfile;
// }

// export interface ProviderProfile {
//   id: string;
//   userId: string;
//   restaurantName: string;
//   description?: string;
//   address: string;
//   openingHours: string;
//   closingHours: string;
//   imageUrl?: string;
//   cuisineType?: string;
//   isActive: boolean;
// }

// export interface Category {
//   id: string;
//   name: string;
//   description?: string;
//   imageUrl?: string;
//   _count?: {
//     meals: number;
//   };
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
//   dietaryInfo: DietaryType;
//   prepTime: number;
//   createdAt: string;
//   category?: Category;
//   provider?: {
//     id: string;
//     name: string;
//     providerProfile?: {
//       restaurantName: string;
//       imageUrl?: string;
//     };
//   };
//   avgRating?: number;
//   reviewCount?: number;
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
//   provider?: {
//     id: string;
//     name: string;
//     providerProfile?: ProviderProfile;
//   };
//   orderItems?: OrderItem[];
//   reviews?: Review[];
// }

// export interface OrderItem {
//   id: string;
//   orderId: string;
//   mealId: string;
//   quantity: number;
//   priceAtOrder: number;
//   meal?: Meal;
// }

// export interface Review {
//   id: string;
//   customerId: string;
//   mealId: string;
//   orderId: string;
//   rating: number;
//   comment?: string;
//   createdAt: string;
//   customer?: {
//     id: string;
//     name: string;
//   };
//   meal?: Meal;
// }

// export interface CartItem {
//   meal: Meal;
//   quantity: number;
// }

// export interface ApiResponse<T> {
//   success: boolean;
//   message?: string;
//   data?: T;
//   error?: string;
//   pagination?: {
//     page: number;
//     limit: number;
//     total: number;
//     totalPages: number;
//   };
// }

// export interface PaginationParams {
//   page?: number;
//   limit?: number;
// }

// export interface MealFilters extends PaginationParams {
//   categoryId?: string;
//   providerId?: string;
//   dietaryInfo?: string;
//   minPrice?: number;
//   maxPrice?: number;
//   search?: string;
//   isAvailable?: boolean;
// }

// --------------
export enum Role {
  CUSTOMER = 'CUSTOMER',
  PROVIDER = 'PROVIDER',
  ADMIN = 'ADMIN',
}

export enum UserStatus {
  ACTIVE = 'ACTIVE',
  SUSPENDED = 'SUSPENDED',
}

export enum OrderStatus {
  PENDING = 'PENDING',
  CONFIRMED = 'CONFIRMED',
  PREPARING = 'PREPARING',
  OUT_FOR_DELIVERY = 'OUT_FOR_DELIVERY',
  DELIVERED = 'DELIVERED',
  CANCELLED = 'CANCELLED',
}

export enum DietaryType {
  NONE = 'NONE',
  VEGETARIAN = 'VEGETARIAN',
  VEGAN = 'VEGAN',
  GLUTEN_FREE = 'GLUTEN_FREE',
  DAIRY_FREE = 'DAIRY_FREE',
  NUT_FREE = 'NUT_FREE',
  HALAL = 'HALAL',
  KOSHER = 'KOSHER',
}

export interface User {
  id: string;
  email: string;
  name: string;
  phone?: string;
  address?: string;
  role: Role;
  status: UserStatus;
  createdAt: string;
  providerProfile?: ProviderProfile;
}

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
}

export interface Category {
  id: string;
  name: string;
  description?: string;
  imageUrl?: string;
  _count?: {
    meals: number;
  };
}

export interface Meal {
  id: string;
  providerId: string;
  categoryId: string;
  name: string;
  description: string;
  price: number;
  imageUrl?: string;
  reviews?: Review[];
  ingredients?: string;
  isAvailable: boolean;
  dietaryInfo?: DietaryType;
  prepTime?: number; // Changed to optional
  createdAt: string;
  category?: Category;
  provider?: {
    id: string;
    name: string;
    providerProfile?: {
      restaurantName: string;
      imageUrl?: string;
    };
  };
  avgRating?: number;
  reviewCount?: number;
  // Additional optional fields from Prisma
  isVegetarian?: boolean;
  isVegan?: boolean;
  isGlutenFree?: boolean;
}

export interface Order {
  id: string;
  customerId: string;
  providerId: string;
  status: OrderStatus;
  deliveryAddress: string;
  contactPhone: string;
  orderNotes?: string;
  totalAmount: number;
  createdAt: string;
  updatedAt: string;
  customer?: User;
  provider?: {
    id: string;
    name: string;
    providerProfile?: ProviderProfile;
  };
  orderItems?: OrderItem[];
  reviews?: Review[];
}

export interface OrderItem {
  id: string;
  orderId: string;
  mealId: string;
  quantity: number;
  priceAtOrder: number;
  meal?: Meal;
}

export interface Review {
  id: string;
  customerId: string;
  mealId: string;
  orderId: string;
  rating: number;
  comment?: string;
  createdAt: string;
  customer?: {
    id: string;
    name: string;
  };
  meal?: Meal;
}

export interface CartItem {
  meal: Meal;
  quantity: number;
}

export interface ApiResponse<T> {
  success: boolean;
  message?: string;
  data?: T;
  error?: string;
  pagination?: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface PaginationParams {
  page?: number;
  limit?: number;
}

export interface MealFilters extends PaginationParams {
  categoryId?: string;
  providerId?: string;
  dietaryInfo?: string;
  minPrice?: number;
  maxPrice?: number;
  search?: string;
  isAvailable?: boolean;
}
