'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import { format } from 'date-fns';
import toast from 'react-hot-toast';
import { providerApi } from '@/lib/api';
import { Order, OrderStatus, Role } from '@/types';
import AuthGuard from '@/components/providers/AuthGuard';
import OrderStatusBadge from '@/components/orders/OrderStatusBadge';
import { Button, Spinner, Select } from '@/components/ui';
import { MapPinIcon, PhoneIcon, UserIcon } from '@heroicons/react/24/outline';

export default function ProviderOrderDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);

  const fetchOrder = async () => {
    try {
      const response = await providerApi.getOrderById(id as string);
      setOrder(response.data.data);
    } catch (error) {
      console.error('Failed to fetch order:', error);
      toast.error('Failed to load order');
      router.push('/provider/orders');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrder();
  }, [id]);

  const getNextStatuses = (
    currentStatus: OrderStatus,
  ): { value: string; label: string }[] => {
    const transitions: Record<string, string[]> = {
      PENDING: ['CONFIRMED', 'CANCELLED'],
      CONFIRMED: ['PREPARING', 'CANCELLED'],
      PREPARING: ['OUT_FOR_DELIVERY', 'CANCELLED'],
      OUT_FOR_DELIVERY: ['DELIVERED'],
      DELIVERED: [],
      CANCELLED: [],
    };

    const labels: Record<string, string> = {
      CONFIRMED: '✅ Confirm Order',
      PREPARING: '👨‍🍳 Start Preparing',
      OUT_FOR_DELIVERY: '🚗 Out for Delivery',
      DELIVERED: '✔️ Mark as Delivered',
      CANCELLED: '❌ Cancel Order',
    };

    return (
      transitions[currentStatus]?.map((status) => ({
        value: status,
        label: labels[status],
      })) || []
    );
  };

  const handleStatusUpdate = async (newStatus: string) => {
    if (!newStatus) return;

    const confirmMessage =
      newStatus === 'CANCELLED'
        ? 'Are you sure you want to cancel this order?'
        : `Update order status to ${newStatus.replace(/_/g, ' ')}?`;

    if (!confirm(confirmMessage)) return;

    setUpdating(true);
    try {
      await providerApi.updateOrderStatus(id as string, newStatus);
      toast.success('Order status updated');
      fetchOrder();
    } catch (error: any) {
      toast.error(error.response?.data?.error || 'Failed to update status');
    } finally {
      setUpdating(false);
    }
  };

  if (loading) {
    return <Spinner className="min-h-screen" />;
  }

  if (!order) {
    return null;
  }

  const nextStatuses = getNextStatuses(order.status);

  return (
    <AuthGuard allowedRoles={[Role.PROVIDER]}>
      <div className="page-container">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              Order #{order.id.slice(0, 8).toUpperCase()}
            </h1>
            <p className="text-gray-500">
              {format(new Date(order.createdAt), 'MMMM d, yyyy • h:mm a')}
            </p>
          </div>
          <OrderStatusBadge status={order.status} />
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Order Details */}
          <div className="lg:col-span-2 space-y-6">
            {/* Order Items */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">
                Order Items
              </h2>
              <div className="divide-y">
                {order.orderItems?.map((item) => (
                  <div key={item.id} className="py-4 flex gap-4">
                    <div className="relative w-16 h-16 rounded-lg overflow-hidden bg-gray-200 flex-shrink-0">
                      {item.meal?.imageUrl ? (
                        <Image
                          src={item.meal.imageUrl}
                          alt={item.meal.name}
                          fill
                          className="object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
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
                    <p className="font-semibold">
                      ${(item.priceAtOrder * item.quantity).toFixed(2)}
                    </p>
                  </div>
                ))}
              </div>
              <div className="border-t mt-4 pt-4 flex justify-between text-lg font-semibold">
                <span>Total</span>
                <span className="text-primary-600">
                  ${order.totalAmount.toFixed(2)}
                </span>
              </div>
            </div>

            {/* Order Notes */}
            {order.orderNotes && (
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-2">
                  Order Notes
                </h2>
                <p className="text-gray-600">{order.orderNotes}</p>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Update Status */}
            {nextStatuses.length > 0 && (
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">
                  Update Status
                </h2>
                <div className="space-y-2">
                  {nextStatuses.map((status) => (
                    <Button
                      key={status.value}
                      variant={
                        status.value === 'CANCELLED' ? 'danger' : 'primary'
                      }
                      className="w-full"
                      onClick={() => handleStatusUpdate(status.value)}
                      isLoading={updating}
                    >
                      {status.label}
                    </Button>
                  ))}
                </div>
              </div>
            )}

            {/* Customer Info */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">
                Customer
              </h2>
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <UserIcon className="h-5 w-5 text-gray-400" />
                  <span className="text-gray-900">{order.customer?.name}</span>
                </div>
                <div className="flex items-center gap-3">
                  <PhoneIcon className="h-5 w-5 text-gray-400" />
                  <a
                    href={`tel:${order.contactPhone}`}
                    className="text-primary-600 hover:underline"
                  >
                    {order.contactPhone}
                  </a>
                </div>
                <div className="flex items-start gap-3">
                  <MapPinIcon className="h-5 w-5 text-gray-400 mt-0.5" />
                  <span className="text-gray-600">{order.deliveryAddress}</span>
                </div>
              </div>
            </div>

            {/* Order Timeline */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">
                Timeline
              </h2>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 mt-2 rounded-full bg-green-500" />
                  <div>
                    <p className="font-medium text-gray-900">Order Placed</p>
                    <p className="text-sm text-gray-500">
                      {format(
                        new Date(order.createdAt),
                        'MMM d, yyyy • h:mm a',
                      )}
                    </p>
                  </div>
                </div>
                {order.updatedAt !== order.createdAt && (
                  <div className="flex items-start gap-3">
                    <div className="w-2 h-2 mt-2 rounded-full bg-blue-500" />
                    <div>
                      <p className="font-medium text-gray-900">Last Updated</p>
                      <p className="text-sm text-gray-500">
                        {format(
                          new Date(order.updatedAt),
                          'MMM d, yyyy • h:mm a',
                        )}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </AuthGuard>
  );
}
