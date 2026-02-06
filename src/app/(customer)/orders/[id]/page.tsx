'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { format } from 'date-fns';
import toast from 'react-hot-toast';
import { ordersApi } from '@/lib/api';
import { Order, OrderStatus, Role } from '@/types';
import AuthGuard from '@/components/providers/AuthGuard';
import OrderStatusBadge from '@/components/orders/OrderStatusBadge';
import OrderStatusTracker from '@/components/orders/OrderStatusTracker';
import { Button, Spinner } from '@/components/ui';
import { MapPinIcon, PhoneIcon } from '@heroicons/react/24/outline';

export default function OrderDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [cancelling, setCancelling] = useState(false);

  const fetchOrder = async () => {
    try {
      const response = await ordersApi.getById(id as string);
      setOrder(response.data.data);
    } catch (error) {
      console.error('Failed to fetch order:', error);
      toast.error('Failed to load order');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrder();
  }, [id]);

  const handleCancelOrder = async () => {
    if (!confirm('Are you sure you want to cancel this order?')) return;

    setCancelling(true);
    try {
      await ordersApi.cancel(id as string);
      toast.success('Order cancelled');
      fetchOrder();
    } catch (error: any) {
      toast.error(error.response?.data?.error || 'Failed to cancel order');
    } finally {
      setCancelling(false);
    }
  };

  if (loading) {
    return <Spinner className="min-h-screen" />;
  }

  if (!order) {
    return (
      <div className="page-container text-center py-12">
        <h1 className="text-2xl font-bold text-gray-900">Order not found</h1>
        <Link
          href="/orders"
          className="text-primary-600 hover:underline mt-4 inline-block"
        >
          View all orders
        </Link>
      </div>
    );
  }

  const canReview = order.status === OrderStatus.DELIVERED;
  const canCancel = order.status === OrderStatus.PENDING;

  return (
    <AuthGuard allowedRoles={[Role.CUSTOMER]}>
      <div className="page-container">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              Order #{order.id.slice(0, 8).toUpperCase()}
            </h1>
            <p className="text-gray-500">
              Placed on{' '}
              {format(new Date(order.createdAt), 'MMMM d, yyyy • h:mm a')}
            </p>
          </div>
          <OrderStatusBadge status={order.status} />
        </div>

        {/* Status Tracker */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <OrderStatusTracker currentStatus={order.status} />
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Order Items */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">
                Order Items
              </h2>

              <div className="divide-y">
                {order.orderItems?.map((item) => (
                  <div key={item.id} className="py-4 flex gap-4">
                    <div className="relative w-20 h-20 rounded-lg overflow-hidden bg-gray-200 flex-shrink-0">
                      {item.meal?.imageUrl ? (
                        <Image
                          src={item.meal.imageUrl}
                          alt={item.meal.name}
                          fill
                          className="object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-xl">
                          🍽️
                        </div>
                      )}
                    </div>

                    <div className="flex-1">
                      <h3 className="font-medium text-gray-900">
                        {item.meal?.name}
                      </h3>
                      <p className="text-sm text-gray-500">
                        ${item.priceAtOrder.toFixed(2)} × {item.quantity}
                      </p>
                    </div>

                    <div className="text-right">
                      <p className="font-semibold">
                        ${(item.priceAtOrder * item.quantity).toFixed(2)}
                      </p>

                      {canReview &&
                        !order.reviews?.some(
                          (r) => r.mealId === item.mealId,
                        ) && (
                          <Link
                            href={`/reviews/new?orderId=${order.id}&mealId=${item.mealId}`}
                            className="text-sm text-primary-600 hover:underline"
                          >
                            Leave Review
                          </Link>
                        )}
                    </div>
                  </div>
                ))}
              </div>

              <div className="border-t mt-4 pt-4">
                <div className="flex justify-between text-lg font-semibold">
                  <span>Total</span>
                  <span className="text-primary-600">
                    ${order.totalAmount.toFixed(2)}
                  </span>
                </div>
                <p className="text-sm text-gray-500 mt-1">Cash on Delivery</p>
              </div>
            </div>
          </div>

          {/* Delivery Info */}
          <div className="space-y-6">
            {/* Restaurant */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">
                Restaurant
              </h2>
              <Link
                href={`/providers/${order.providerId}`}
                className="text-primary-600 hover:underline font-medium"
              >
                {order.provider?.providerProfile?.restaurantName}
              </Link>
            </div>

            {/* Delivery Details */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">
                Delivery Details
              </h2>

              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <MapPinIcon className="h-5 w-5 text-gray-400 mt-0.5" />
                  <p className="text-gray-600">{order.deliveryAddress}</p>
                </div>
                <div className="flex items-center gap-3">
                  <PhoneIcon className="h-5 w-5 text-gray-400" />
                  <p className="text-gray-600">{order.contactPhone}</p>
                </div>
                {order.orderNotes && (
                  <div className="pt-3 border-t">
                    <p className="text-sm text-gray-500">Notes:</p>
                    <p className="text-gray-600">{order.orderNotes}</p>
                  </div>
                )}
              </div>
            </div>

            {/* Actions */}
            {canCancel && (
              <Button
                variant="danger"
                className="w-full"
                onClick={handleCancelOrder}
                isLoading={cancelling}
              >
                Cancel Order
              </Button>
            )}
          </div>
        </div>
      </div>
    </AuthGuard>
  );
}
