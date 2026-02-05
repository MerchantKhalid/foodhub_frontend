import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { User, CartItem, Meal } from '@/types';

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  setAuth: (user: User, token: string) => void;
  logout: () => void;
  updateUser: (user: Partial<User>) => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      setAuth: (user, token) => {
        localStorage.setItem('token', token);
        set({ user, token, isAuthenticated: true });
      },
      logout: () => {
        localStorage.removeItem('token');
        set({ user: null, token: null, isAuthenticated: false });
      },
      updateUser: (userData) =>
        set((state) => ({
          user: state.user ? { ...state.user, ...userData } : null,
        })),
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({
        user: state.user,
        token: state.token,
        isAuthenticated: state.isAuthenticated,
      }),
    },
  ),
);

interface CartState {
  items: CartItem[];
  addItem: (meal: Meal) => void;
  removeItem: (mealId: string) => void;
  updateQuantity: (mealId: string, quantity: number) => void;
  clearCart: () => void;
  getTotal: () => number;
  getItemCount: () => number;
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      addItem: (meal) => {
        const items = get().items;
        const existingItem = items.find((item) => item.meal.id === meal.id);

        if (existingItem) {
          set({
            items: items.map((item) =>
              item.meal.id === meal.id
                ? { ...item, quantity: item.quantity + 1 }
                : item,
            ),
          });
        } else {
          // Check if adding item from different provider
          if (
            items.length > 0 &&
            items[0].meal.providerId !== meal.providerId
          ) {
            // Clear cart if different provider
            set({ items: [{ meal, quantity: 1 }] });
          } else {
            set({ items: [...items, { meal, quantity: 1 }] });
          }
        }
      },
      removeItem: (mealId) => {
        set({ items: get().items.filter((item) => item.meal.id !== mealId) });
      },
      updateQuantity: (mealId, quantity) => {
        if (quantity <= 0) {
          get().removeItem(mealId);
          return;
        }
        set({
          items: get().items.map((item) =>
            item.meal.id === mealId ? { ...item, quantity } : item,
          ),
        });
      },
      clearCart: () => set({ items: [] }),
      getTotal: () => {
        return get().items.reduce(
          (total, item) => total + item.meal.price * item.quantity,
          0,
        );
      },
      getItemCount: () => {
        return get().items.reduce((count, item) => count + item.quantity, 0);
      },
    }),
    {
      name: 'cart-storage',
    },
  ),
);
