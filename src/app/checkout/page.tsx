'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { TrashIcon, MinusIcon, PlusIcon, ShoppingBagIcon } from '@heroicons/react/24/outline';
import { useCartStore, useAuthStore } from '@/lib/store';
import { Button, EmptyState } from '@/components/ui';
import { Role } from '@/types';

export default function CartPage() {
  const router = useRouter();
  const { items, updateQuantity, removeItem, getTotal, clearCart } = useCartStore();
  const { isAuthenticated, user } = useAuthStore();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  const handleCheckout = () => {
    if (!isAuthenticated) {
      router.push('/login');
      return;
    }
    router.push('/checkout');
  };

  if (items.length === 0) {
    return (
      <div className="page-container">
        <EmptyState
          icon={<ShoppingBagIcon className="h-12 w-12" />}
          title="Your cart is empty"
          description="Browse our delicious meals and add something to your cart"
          action={
            <Link href="/meals">
              <Button variant="primary">Browse Meals</Button>
            </Link>
          }
        />
      </div>
    );
  }

  const provider = items[0].meal.provider;

  return (
    <div className="page-container">
      <h1 className="page-title">Shopping Cart</h1>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Cart Items */}
        <div className="lg:col-span-2">
          {/* Provider Info */}
          {provider?.providerProfile && (
            <div className="bg-white rounded-lg shadow-sm p-4 mb-4">
              <p className="text-sm text-gray-500">Ordering from</p>
              <Link
                href={`/providers/${items[0].meal.providerId}`}
                className="font-semibold text-primary-600 hover:underline"
              >
                {provider.providerProfile.restaurantName}
              </Link>
            </div>
          )}

          <div className="bg-white rounded-lg shadow-sm divide-y">
            {items.map((item) => (
              <div key={item.meal.id} className="p-4 flex gap-4">
                <div className="relative w-24 h-24 rounded-lg overflow-hidden bg-gray-200 flex-shrink-0">
                  {item.meal.imageUrl ? (
                    <Image
                      src={item.meal.imageUrl}
                      alt={item.meal.name}
                      fill
                      className="object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-2xl">
                      🍽️
                    </div>
                  )}
                </div>

                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900">{item.meal.name}</h3>
                  <p className="text-sm text-gray-500 line-clamp-1">{item.meal.description}</p>
                  <p className="text-primary-600 font-semibold mt-1">
                    ${item.meal.price.toFixed(2)}
                  </p>
                </div>

                <div className="flex flex-col items-end justify-between">
                  <button
                    onClick={() => removeItem(item.meal.id)}
                    className="text-gray-400 hover:text-red-600"
                  >
                    <TrashIcon className="h-5 w-5" />
                  </button>

                  <div className="flex items-center border rounded-lg">
                    <button
                      onClick={() => updateQuantity(item.meal.id, item.quantity - 1)}
                      className="p-1 hover:bg-gray-100"
                    >
                      <MinusIcon className="h-4 w-4" />
                    </button>
                    <span className="px-3 py-1 font-semibold text-sm">{item.quantity}</span>
                    <button
                      onClick={() => updateQuantity(item.meal.id, item.quantity + 1)}
                      className="p-1 hover:bg-gray-100"
                    >
                      <PlusIcon className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-4">
            <button
              onClick={clearCart}
              className="text-red-600 hover:text-red-700 text-sm font-medium"
            >
              Clear Cart
            </button>
          </div>
        </div>

        {/* Order Summary */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg shadow-sm p-6 sticky top-24">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Order Summary</h2>

            <div className="space-y-3 mb-4">
              {items.map((item) => (
                <div key={item.meal.id} className="flex justify-between text-sm">
                  <span className="text-gray-600">
                    {item.quantity}x {item.meal.name}
                  </span>
                  <span>${(item.meal.price * item.quantity).toFixed(2)}</span>
                </div>
              ))}
            </div>

            <div className="border-t pt-4">
              <div className="flex justify-between font-semibold text-lg">
                <span>Total</span>
                <span className="text-primary-600">${getTotal().toFixed(2)}</span>
              </div>
              <p className="text-xs text-gray-500 mt-1">Cash on Delivery</p>
            </div>

            <Button
              variant="primary"
              size="lg"
              className="w-full mt-6"
              onClick={handleCheckout}
            >
              {isAuthenticated ? 'Proceed to Checkout' : 'Login to Checkout'}
            </Button>

            <Link href="/meals" className="block text-center mt-4 text-primary-600 hover:underline text-sm">
              Continue Shopping
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}