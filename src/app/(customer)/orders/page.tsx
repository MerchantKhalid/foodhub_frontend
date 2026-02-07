'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { format } from 'date-fns';
import { ordersApi } from '@/lib/api';
import { Order, Role } from '@/types';
import AuthGuard from '@/components/providers/AuthGuard';
import OrderStatusBadge from '@/components/orders/OrderStatusBadge';
import { Spinner, EmptyState, Pagination } from '@/components/ui';
import { ShoppingBagIcon } from '@heroicons/react/24/outline';

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0,
  });

  const fetchOrders = async (page = 1) => {
    setLoading(true);
    try {
      const response = await ordersApi.getAll({
        page,
        limit: pagination.limit,
      });
      setOrders(response.data.data);
      setPagination(response.data.pagination);
    } catch (error) {
      console.error('Failed to fetch orders:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  return (
    <AuthGuard allowedRoles={[Role.CUSTOMER]}>
      <div className="page-container">
        <h1 className="page-title">My Orders</h1>

        {loading ? (
          <Spinner className="py-12" />
        ) : orders.length === 0 ? (
          <EmptyState
            icon={<ShoppingBagIcon className="h-12 w-12" />}
            title="No orders yet"
            description="Start ordering delicious meals!"
            action={
              <Link href="/meals">
                <button className="btn-primary">Browse Meals</button>
              </Link>
            }
          />
        ) : (
          <>
            <div className="space-y-4">
              {orders.map((order) => (
                <Link key={order.id} href={`/orders/${order.id}`}>
                  <div className="bg-white rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                      <div>
                        <p className="text-sm text-gray-500">
                          Order #{order.id.slice(0, 8).toUpperCase()}
                        </p>
                        <p className="font-semibold text-gray-900">
                          {order.provider?.providerProfile?.restaurantName ||
                            'Restaurant'}
                        </p>
                        <p className="text-sm text-gray-500">
                          {format(
                            new Date(order.createdAt),
                            'MMM d, yyyy • h:mm a',
                          )}
                        </p>
                      </div>

                      <div className="flex items-center gap-4">
                        <OrderStatusBadge status={order.status} />
                        <p className="font-semibold text-primary-600">
                          ${order.totalAmount.toFixed(2)}
                        </p>
                      </div>
                    </div>

                    {order.orderItems && (
                      <div className="mt-4 pt-4 border-t">
                        <p className="text-sm text-gray-600">
                          {order.orderItems
                            .map(
                              (item) => `${item.quantity}x ${item.meal?.name}`,
                            )
                            .join(', ')}
                        </p>
                      </div>
                    )}
                  </div>
                </Link>
              ))}
            </div>

            {pagination.totalPages > 1 && (
              <div className="mt-8">
                <Pagination
                  currentPage={pagination.page}
                  totalPages={pagination.totalPages}
                  onPageChange={fetchOrders}
                />
              </div>
            )}
          </>
        )}
      </div>
    </AuthGuard>
  );
}
