'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter, useSearchParams } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import api from '@/lib/api';
import { OrderStatusTracker } from '@/components/orders/OrderStatusTracker';
import OrderStatusBadge from '@/components/orders/OrderStatusBadge';
import { Button, Spinner } from '@/components/ui';
import { useAuthStore } from '@/lib/store';
import { OrderStatus } from '@/types';
import {
  MapPinIcon,
  PhoneIcon,
  ClockIcon,
  CreditCardIcon,
  ChevronLeftIcon,
  CheckCircleIcon,
  XMarkIcon,
  ExclamationTriangleIcon,
} from '@heroicons/react/24/outline';
import toast from 'react-hot-toast';

interface Order {
  id: string;
  status: OrderStatus;
  totalAmount: number;
  deliveryAddress: string;
  contactPhone: string;
  orderNotes?: string;
  paymentMethod: string;
  paymentStatus: string;
  estimatedDeliveryTime?: string;
  actualDeliveryTime?: string;
  createdAt: string;
  provider: {
    id: string;
    name: string;
    phone: string;
    providerProfile: {
      restaurantName: string;
      address: string;
    };
  };
  customer: {
    name: string;
    phone: string;
  };
  orderItems: Array<{
    id: string;
    quantity: number;
    priceAtOrder: number;
    meal: {
      id: string;
      name: string;
      description: string;
      imageUrl?: string;
    };
  }>;
  statusHistory: Array<{
    id: string;
    status: OrderStatus;
    note?: string;
    createdAt: string;
  }>;
}

export default function OrderDetailPage() {
  const params = useParams();
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user } = useAuthStore();

  const orderId = params.id as string;
  const isNewOrder = searchParams.get('new') === 'true';

  const [order, setOrder] = useState<Order | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [showSuccess, setShowSuccess] = useState(isNewOrder);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [cancelReason, setCancelReason] = useState('');
  const [isCancelling, setIsCancelling] = useState(false);

  // Predefined cancellation reasons
  const cancellationReasons = [
    'Changed my mind',
    'Ordered by mistake',
    'Found a better price elsewhere',
    'Delivery taking too long',
    'Wrong items ordered',
    'Other',
  ];

  // Fetch order details - initial load only
  useEffect(() => {
    const fetchOrder = async () => {
      try {
        setIsLoading(true);
        setError('');
        const response = await api.get(`/orders/${orderId}`);

        if (response.data.success) {
          setOrder(response.data.data);
        } else {
          setError('Failed to load order');
        }
      } catch (err: any) {
        console.error('Error fetching order:', err);
        setError(err.response?.data?.message || 'Failed to load order details');
      } finally {
        setIsLoading(false);
      }
    };

    if (orderId) {
      fetchOrder();
    }
  }, [orderId]);

  // Auto-refresh every 30 seconds for active orders
  useEffect(() => {
    if (!order) return;

    // Don't refresh if order is in final state
    if (order.status === 'DELIVERED' || order.status === 'CANCELLED') {
      return;
    }

    const interval = setInterval(async () => {
      try {
        const response = await api.get(`/orders/${orderId}`);
        if (response.data.success) {
          setOrder(response.data.data);
        }
      } catch (err) {
        console.error('Error refreshing order:', err);
      }
    }, 30000);

    return () => clearInterval(interval);
  }, [orderId, order?.status]);

  // Hide success message after 5 seconds
  useEffect(() => {
    if (showSuccess) {
      const timeout = setTimeout(() => setShowSuccess(false), 5000);
      return () => clearTimeout(timeout);
    }
  }, [showSuccess]);

  const handleOpenCancelModal = () => {
    setShowCancelModal(true);
    setCancelReason('');
  };

  const handleCloseCancelModal = () => {
    setShowCancelModal(false);
    setCancelReason('');
  };

  const handleConfirmCancel = async () => {
    if (!cancelReason) {
      toast.error('Please select a reason for cancellation', {
        icon: '⚠️',
      });
      return;
    }

    setIsCancelling(true);

    // Show loading toast
    const loadingToast = toast.loading('Cancelling your order...');

    try {
      const response = await api.patch(`/orders/${orderId}/cancel`, {
        reason: cancelReason,
      });

      if (response.data.success) {
        setOrder(response.data.data);
        setShowCancelModal(false);

        // Dismiss loading toast and show success
        toast.success('Order cancelled successfully!', {
          id: loadingToast,
          icon: '✅',
          duration: 4000,
          style: {
            background: '#10b981',
            color: '#fff',
            padding: '16px',
            borderRadius: '8px',
          },
        });

        // Auto redirect after 3 seconds
        setTimeout(() => {
          router.push('/meals');
        }, 3000);
      }
    } catch (err: any) {
      // Dismiss loading toast and show error
      toast.error(
        err.response?.data?.message ||
          'Failed to cancel order. Please try again.',
        {
          id: loadingToast,
          icon: '❌',
          duration: 5000,
        },
      );
    } finally {
      setIsCancelling(false);
    }
  };

  const canCancelOrder =
    order?.status === 'PENDING' || order?.status === 'CONFIRMED';

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Spinner size="lg" />
          <p className="text-gray-600 mt-4">Loading order details...</p>
        </div>
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 mb-4">{error || 'Order not found'}</p>
          <Button onClick={() => router.push('/orders')}>
            View All Orders
          </Button>
        </div>
      </div>
    );
  }

  const formattedEstimatedTime = order.estimatedDeliveryTime
    ? new Date(order.estimatedDeliveryTime).toLocaleTimeString([], {
        hour: '2-digit',
        minute: '2-digit',
      })
    : null;

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Success Message */}
        {showSuccess && (
          <div className="mb-6 bg-green-50 border border-green-200 rounded-lg p-4 flex items-start gap-3">
            <CheckCircleIcon className="h-6 w-6 text-green-600 flex-shrink-0 mt-0.5" />
            <div className="flex-1">
              <h3 className="text-green-900 font-semibold">
                Order Placed Successfully!
              </h3>
              <p className="text-green-700 text-sm mt-1">
                Your order has been sent to the restaurant. They will confirm it
                shortly.
              </p>
            </div>
          </div>
        )}

        {/* Header */}
        <div className="mb-6">
          <button
            onClick={() => router.push('/orders')}
            className="text-primary-600 hover:text-primary-700 mb-4 flex items-center gap-2"
          >
            <ChevronLeftIcon className="h-5 w-5" />
            Back to Orders
          </button>

          <div className="flex items-start justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Order Details
              </h1>
              <p className="text-gray-600 mt-1">
                Order ID: #{order.id.slice(0, 8)}
              </p>
            </div>
            <OrderStatusBadge status={order.status} />
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Left Column */}
          <div className="lg:col-span-2 space-y-6">
            {/* Order Status Tracker */}
            <OrderStatusTracker
              currentStatus={order.status}
              statusHistory={order.statusHistory || []}
              estimatedDeliveryTime={formattedEstimatedTime || undefined}
              isCancelled={order.status === 'CANCELLED'}
            />

            {/* Order Items */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Order Items ({order.orderItems?.length || 0})
              </h3>

              <div className="space-y-4">
                {order.orderItems && order.orderItems.length > 0 ? (
                  order.orderItems.map((item) => (
                    <div
                      key={item.id}
                      className="flex gap-4 pb-4 border-b last:border-0"
                    >
                      <div className="relative w-20 h-20 rounded-lg overflow-hidden bg-gray-200 flex-shrink-0">
                        {item.meal?.imageUrl ? (
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
                        <h4 className="font-semibold text-gray-900">
                          {item.meal?.name || 'Unknown Item'}
                        </h4>
                        <p className="text-sm text-gray-600 line-clamp-1 mt-1">
                          {item.meal?.description || ''}
                        </p>
                        <p className="text-sm text-gray-500 mt-1">
                          Quantity: {item.quantity}
                        </p>
                      </div>

                      <div className="text-right">
                        <p className="font-semibold text-gray-900">
                          ${(item.priceAtOrder * item.quantity).toFixed(2)}
                        </p>
                        <p className="text-sm text-gray-500">
                          ${item.priceAtOrder.toFixed(2)} each
                        </p>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-gray-500 text-center py-4">
                    No items found
                  </p>
                )}
              </div>
            </div>

            {/* Delivery & Contact Info */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Delivery Information
              </h3>

              <div className="space-y-4">
                <div className="flex gap-3">
                  <MapPinIcon className="h-5 w-5 text-gray-400 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-gray-700">
                      Delivery Address
                    </p>
                    <p className="text-gray-900 mt-1">
                      {order.deliveryAddress}
                    </p>
                  </div>
                </div>

                <div className="flex gap-3">
                  <PhoneIcon className="h-5 w-5 text-gray-400 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-gray-700">
                      Contact Phone
                    </p>
                    <p className="text-gray-900 mt-1">{order.contactPhone}</p>
                  </div>
                </div>

                {order.orderNotes && (
                  <div className="flex gap-3">
                    <div className="h-5 w-5 flex-shrink-0 mt-0.5 text-gray-400">
                      📝
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-700">
                        Order Notes
                      </p>
                      <p className="text-gray-900 mt-1">{order.orderNotes}</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Right Column */}
          <div className="lg:col-span-1 space-y-6">
            {/* Restaurant Info */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Restaurant
              </h3>

              <div className="space-y-3">
                <div>
                  <p className="text-sm text-gray-500">Name</p>
                  <Link
                    href={`/providers/${order.provider?.id}`}
                    className="font-medium text-primary-600 hover:underline"
                  >
                    {order.provider?.providerProfile?.restaurantName ||
                      'Unknown Restaurant'}
                  </Link>
                </div>

                <div>
                  <p className="text-sm text-gray-500">Address</p>
                  <p className="text-gray-900">
                    {order.provider?.providerProfile?.address || 'N/A'}
                  </p>
                </div>

                <div>
                  <p className="text-sm text-gray-500">Phone</p>
                  <a
                    href={`tel:${order.provider?.phone}`}
                    className="text-primary-600 hover:underline"
                  >
                    {order.provider?.phone || 'N/A'}
                  </a>
                </div>
              </div>
            </div>

            {/* Order Summary */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Payment Summary
              </h3>

              <div className="space-y-3">
                <div className="flex justify-between text-gray-600">
                  <span>Subtotal</span>
                  <span>${order.totalAmount.toFixed(2)}</span>
                </div>

                <div className="flex justify-between text-gray-600">
                  <span>Delivery Fee</span>
                  <span className="text-green-600 font-medium">FREE</span>
                </div>

                <div className="border-t pt-3">
                  <div className="flex justify-between text-lg font-bold">
                    <span>Total</span>
                    <span className="text-primary-600">
                      ${order.totalAmount.toFixed(2)}
                    </span>
                  </div>
                </div>

                <div className="mt-4 pt-4 border-t">
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <CreditCardIcon className="h-4 w-4" />
                    <span>Payment Method:</span>
                  </div>
                  <p className="font-medium text-gray-900 mt-1">
                    {order.paymentMethod === 'CASH_ON_DELIVERY'
                      ? 'Cash on Delivery'
                      : order.paymentMethod}
                  </p>
                  <p className="text-sm text-gray-500 mt-1">
                    Status:{' '}
                    {order.paymentStatus === 'PAID' ? '✅ Paid' : '⏳ Pending'}
                  </p>
                </div>

                <div className="mt-4 pt-4 border-t">
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <ClockIcon className="h-4 w-4" />
                    <span>Order Time:</span>
                  </div>
                  <p className="text-gray-900 mt-1">
                    {new Date(order.createdAt).toLocaleString()}
                  </p>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            {canCancelOrder && user?.role === 'CUSTOMER' && (
              <Button
                variant="danger"
                className="w-full"
                onClick={handleOpenCancelModal}
              >
                Cancel Order
              </Button>
            )}

            {order.status === 'DELIVERED' && (
              <Link href={`/reviews/new?orderId=${order.id}`}>
                <Button variant="primary" className="w-full">
                  Write a Review
                </Button>
              </Link>
            )}

            <Link href="/meals">
              <Button variant="secondary" className="w-full">
                Order Again
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* Cancel Order Modal */}
      {showCancelModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex min-h-screen items-center justify-center p-4">
            {/* Backdrop */}
            <div
              className="fixed inset-0 bg-black bg-opacity-50 transition-opacity"
              onClick={handleCloseCancelModal}
            />

            {/* Modal */}
            <div className="relative bg-white rounded-lg shadow-xl max-w-md w-full p-6">
              {/* Close Button */}
              <button
                onClick={handleCloseCancelModal}
                className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
              >
                <XMarkIcon className="h-6 w-6" />
              </button>

              {/* Icon */}
              <div className="flex items-center justify-center w-12 h-12 bg-red-100 rounded-full mb-4">
                <ExclamationTriangleIcon className="h-6 w-6 text-red-600" />
              </div>

              {/* Title */}
              <h3 className="text-xl font-bold text-gray-900 mb-2">
                Cancel Order?
              </h3>
              <p className="text-gray-600 mb-6">
                Are you sure you want to cancel this order? This action cannot
                be undone.
              </p>

              {/* Cancellation Reasons */}
              <div className="space-y-3 mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Please select a reason for cancellation:
                </label>
                {cancellationReasons.map((reason) => (
                  <label
                    key={reason}
                    className="flex items-center gap-3 p-3 border rounded-lg cursor-pointer hover:bg-gray-50 transition-colors"
                  >
                    <input
                      type="radio"
                      name="cancelReason"
                      value={reason}
                      checked={cancelReason === reason}
                      onChange={(e) => setCancelReason(e.target.value)}
                      className="w-4 h-4 text-primary-600 focus:ring-primary-500"
                    />
                    <span className="text-gray-700">{reason}</span>
                  </label>
                ))}
              </div>

              {/* Buttons */}
              <div className="flex gap-3">
                <Button
                  variant="secondary"
                  className="flex-1"
                  onClick={handleCloseCancelModal}
                  disabled={isCancelling}
                >
                  Keep Order
                </Button>
                <Button
                  variant="danger"
                  className="flex-1"
                  onClick={handleConfirmCancel}
                  isLoading={isCancelling}
                  disabled={!cancelReason}
                >
                  {isCancelling ? 'Cancelling...' : 'Yes, Cancel Order'}
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
