'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useCartStore, useAuthStore } from '@/lib/store';
import { Button, Input, Spinner } from '@/components/ui';
import api from '@/lib/api';
import {
  ShoppingBagIcon,
  MapPinIcon,
  PhoneIcon,
  CreditCardIcon,
  ClockIcon,
  CheckCircleIcon,
} from '@heroicons/react/24/outline';

export default function CheckoutPage() {
  const router = useRouter();
  const { items, getTotal, clearCart } = useCartStore();
  const { user, isAuthenticated } = useAuthStore();

  const [formData, setFormData] = useState({
    deliveryAddress: user?.address || '',
    contactPhone: user?.phone || '',
    orderNotes: '',
  });

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [mounted, setMounted] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [orderId, setOrderId] = useState('');
  const [orderPlaced, setOrderPlaced] = useState(false); // NEW FLAG

  useEffect(() => {
    setMounted(true);

    // Redirect if not authenticated
    if (mounted && !isAuthenticated) {
      router.push('/login?redirect=/checkout');
      return;
    }

    // Only redirect to cart if empty AND order hasn't been placed
    if (mounted && items.length === 0 && !orderPlaced) {
      router.push('/cart');
      return;
    }
  }, [mounted, isAuthenticated, items.length, orderPlaced, router]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    setError('');
  };

  const validateForm = () => {
    if (!formData.deliveryAddress.trim()) {
      setError('Delivery address is required');
      return false;
    }
    if (!formData.contactPhone.trim()) {
      setError('Contact phone is required');
      return false;
    }
    if (formData.contactPhone.length < 10) {
      setError('Please enter a valid phone number');
      return false;
    }
    return true;
  };

  const handlePlaceOrder = async () => {
    if (!validateForm()) return;

    setIsLoading(true);
    setError('');

    try {
      const orderData = {
        items: items.map((item) => ({
          mealId: item.meal.id,
          quantity: item.quantity,
        })),
        deliveryAddress: formData.deliveryAddress,
        contactPhone: formData.contactPhone,
        orderNotes: formData.orderNotes || undefined,
        paymentMethod: 'CASH_ON_DELIVERY',
      };

      const response = await api.post('/orders', orderData);

      if (response.data.success) {
        const newOrderId = response.data.data.id;
        setOrderId(newOrderId);
        setOrderPlaced(true); // SET FLAG TO TRUE

        // Show success message
        setShowSuccess(true);

        // Clear cart
        clearCart();

        // Redirect after 2 seconds
        setTimeout(() => {
          router.push(`/orders/${newOrderId}?new=true`);
        }, 2000);
      }
    } catch (err: any) {
      console.error('Order placement error:', err);
      setError(
        err.response?.data?.message ||
          'Failed to place order. Please try again.',
      );
      setIsLoading(false);
    }
  };

  if (!mounted) {
    return null;
  }

  if (!isAuthenticated) {
    return null;
  }

  // Only show loading if cart is empty but order hasn't been placed
  if (items.length === 0 && !orderPlaced) {
    return null;
  }

  const provider = items[0]?.meal?.provider;
  const totalAmount = getTotal();
  const estimatedDeliveryTime = '30-45 minutes';

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => router.back()}
            className="text-primary-600 hover:text-primary-700 mb-4 flex items-center gap-2"
            disabled={isLoading}
          >
            ← Back to Cart
          </button>
          <h1 className="text-3xl font-bold text-gray-900">Checkout</h1>
          <p className="text-gray-600 mt-2">
            Review your order and provide delivery details
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Left Side - Forms */}
          <div className="lg:col-span-2 space-y-6">
            {/* Delivery Information */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <MapPinIcon className="h-6 w-6 text-primary-600" />
                Delivery Information
              </h2>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Delivery Address *
                  </label>
                  <Input
                    name="deliveryAddress"
                    value={formData.deliveryAddress}
                    onChange={handleInputChange}
                    placeholder="Enter your complete delivery address"
                    className="w-full"
                    disabled={isLoading}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Contact Phone *
                  </label>
                  <Input
                    name="contactPhone"
                    value={formData.contactPhone}
                    onChange={handleInputChange}
                    placeholder="Your phone number"
                    type="tel"
                    className="w-full"
                    disabled={isLoading}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Order Notes (Optional)
                  </label>
                  <textarea
                    name="orderNotes"
                    value={formData.orderNotes}
                    onChange={handleInputChange}
                    placeholder="Any special instructions? (e.g., extra spicy, no onions, gate code)"
                    rows={3}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    disabled={isLoading}
                  />
                </div>
              </div>
            </div>

            {/* Payment Method */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <CreditCardIcon className="h-6 w-6 text-primary-600" />
                Payment Method
              </h2>

              <div className="border-2 border-primary-200 bg-primary-50 rounded-lg p-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center">
                    💵
                  </div>
                  <div className="flex-1">
                    <p className="font-semibold text-gray-900">
                      Cash on Delivery
                    </p>
                    <p className="text-sm text-gray-600">
                      Pay with cash when your order arrives
                    </p>
                  </div>
                  <div className="w-6 h-6 bg-primary-600 rounded-full flex items-center justify-center">
                    <svg
                      className="w-4 h-4 text-white"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                </div>
              </div>

              <p className="text-xs text-gray-500 mt-3">
                💡 Please keep exact change ready for faster delivery
              </p>
            </div>

            {/* Order Items Summary */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <ShoppingBagIcon className="h-6 w-6 text-primary-600" />
                Order Items ({items.length})
              </h2>

              {provider?.providerProfile && (
                <div className="mb-4 pb-4 border-b">
                  <p className="text-sm text-gray-500">Ordering from</p>
                  <p className="font-semibold text-gray-900">
                    {provider.providerProfile.restaurantName}
                  </p>
                </div>
              )}

              <div className="space-y-3">
                {items.map((item) => (
                  <div
                    key={item.meal.id}
                    className="flex justify-between items-center"
                  >
                    <div className="flex-1">
                      <p className="font-medium text-gray-900">
                        {item.meal.name}
                      </p>
                      <p className="text-sm text-gray-500">
                        Qty: {item.quantity}
                      </p>
                    </div>
                    <p className="font-semibold text-gray-900">
                      ${(item.meal.price * item.quantity).toFixed(2)}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Side - Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm p-6 sticky top-24">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                Order Summary
              </h2>

              <div className="space-y-3 mb-4">
                <div className="flex justify-between text-gray-600">
                  <span>Subtotal</span>
                  <span>${totalAmount.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Delivery Fee</span>
                  <span className="text-green-600 font-medium">FREE</span>
                </div>
                <div className="border-t pt-3">
                  <div className="flex justify-between text-lg font-bold text-gray-900">
                    <span>Total</span>
                    <span className="text-primary-600">
                      ${totalAmount.toFixed(2)}
                    </span>
                  </div>
                </div>
              </div>

              {/* Estimated Delivery Time */}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-4">
                <div className="flex items-start gap-2">
                  <ClockIcon className="h-5 w-5 text-blue-600 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-blue-900">
                      Estimated Delivery
                    </p>
                    <p className="text-sm text-blue-700">
                      {estimatedDeliveryTime}
                    </p>
                  </div>
                </div>
              </div>

              {/* Error Message */}
              {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-4">
                  <p className="text-sm">{error}</p>
                </div>
              )}

              {/* Place Order Button */}
              <Button
                variant="primary"
                size="lg"
                className="w-full"
                onClick={handlePlaceOrder}
                disabled={isLoading}
              >
                {isLoading ? (
                  <span className="flex items-center justify-center gap-2">
                    <Spinner size="sm" />
                    Placing Order...
                  </span>
                ) : (
                  'Place Order'
                )}
              </Button>

              <p className="text-xs text-gray-500 text-center mt-3">
                By placing an order, you agree to our terms and conditions
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Success Modal Overlay */}
      {showSuccess && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white rounded-lg shadow-2xl p-8 max-w-md w-full mx-4 text-center">
            {/* Success Icon */}
            <div className="flex justify-center mb-4">
              <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center">
                <CheckCircleIcon className="h-12 w-12 text-green-600" />
              </div>
            </div>

            {/* Success Message */}
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              Order Placed Successfully! 🎉
            </h2>
            <p className="text-gray-600 mb-2">
              Your order has been sent to the restaurant.
            </p>
            <p className="text-sm text-gray-500 mb-6">
              Order ID: #{orderId.slice(0, 8)}
            </p>

            {/* Loading Indicator */}
            <div className="flex items-center justify-center gap-2 text-primary-600">
              <Spinner size="sm" />
              <span className="text-sm">Redirecting to order details...</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
