'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { format } from 'date-fns';
import { adminApi } from '@/lib/api';
import { Order, Role } from '@/types';
import AuthGuard from '@/components/providers/AuthGuard';
import OrderStatusBadge from '@/components/orders/OrderStatusBadge';
import OrderStatusTracker from '@/components/orders/OrderStatusTracker';
import { Spinner } from '@/components/ui';
import {
  MapPinIcon,
  PhoneIcon,
  UserIcon,
  BuildingStorefrontIcon,
} from '@heroicons/react/24/outline';

export default function AdminOrderDetailPage() {
  const { id } = useParams();
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const response = await adminApi.getOrderById(id as string);
        setOrder(response.data.data);
      } catch (error) {
        console.error('Failed to fetch order:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchOrder();
  }, [id]);

  if (loading) {
    return <Spinner className="min-h-screen" />;
  }

  if (!order) {
    return (
      <div className="page-container text-center py-12">
        <h1 className="text-2xl font-bold text-gray-900">Order not found</h1>
      </div>
    );
  }

  return (
    <AuthGuard allowedRoles={[Role.ADMIN]}>
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
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Customer Info */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">
                Customer
              </h2>
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <UserIcon className="h-5 w-5 text-gray-400" />
                  <div>
                    <p className="font-medium text-gray-900">
                      {order.customer?.name}
                    </p>
                    <p className="text-sm text-gray-500">
                      {order.customer?.email}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <PhoneIcon className="h-5 w-5 text-gray-400" />
                  <span className="text-gray-600">{order.contactPhone}</span>
                </div>
                <div className="flex items-start gap-3">
                  <MapPinIcon className="h-5 w-5 text-gray-400 mt-0.5" />
                  <span className="text-gray-600">{order.deliveryAddress}</span>
                </div>
              </div>
            </div>

            {/* Provider Info */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">
                Provider
              </h2>
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <BuildingStorefrontIcon className="h-5 w-5 text-gray-400" />
                  <div>
                    <p className="font-medium text-gray-900">
                      {order.provider?.providerProfile?.restaurantName ||
                        order.provider?.name}
                    </p>
                    <Link
                      href={`/providers/${order.providerId}`}
                      className="text-sm text-primary-600 hover:underline"
                    >
                      View Restaurant
                    </Link>
                  </div>
                </div>
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
        </div>
      </div>
    </AuthGuard>
  );
}
