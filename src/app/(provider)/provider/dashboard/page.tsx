'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  CurrencyDollarIcon,
  ShoppingBagIcon,
  ClockIcon,
  StarIcon,
  ArrowTrendingUpIcon,
} from '@heroicons/react/24/outline';
import { providerApi } from '@/lib/api';
import { Role, OrderStatus } from '@/types';
import AuthGuard from '@/components/providers/AuthGuard';
import OrderStatusBadge from '@/components/orders/OrderStatusBadge';
import { Spinner } from '@/components/ui';
import { format } from 'date-fns';

interface Stats {
  totalOrders: number;
  pendingOrders: number;
  completedOrders: number;
  totalRevenue: number;
  totalMeals: number;
  avgRating: number;
  recentOrders: any[];
  topMeals: any[];
}

export default function ProviderDashboardPage() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await providerApi.getStats();
        setStats(response.data.data);
      } catch (error) {
        console.error('Failed to fetch stats:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (loading) {
    return <Spinner className="min-h-screen" />;
  }

  const statCards = [
    {
      title: 'Total Revenue',
      value: `$${stats?.totalRevenue?.toFixed(2) || '0.00'}`,
      icon: CurrencyDollarIcon,
      color: 'bg-green-500',
    },
    {
      title: 'Total Orders',
      value: stats?.totalOrders || 0,
      icon: ShoppingBagIcon,
      color: 'bg-blue-500',
    },
    {
      title: 'Pending Orders',
      value: stats?.pendingOrders || 0,
      icon: ClockIcon,
      color: 'bg-yellow-500',
    },
    {
      title: 'Average Rating',
      value: stats?.avgRating?.toFixed(1) || '0.0',
      icon: StarIcon,
      color: 'bg-purple-500',
    },
  ];

  return (
    <AuthGuard allowedRoles={[Role.PROVIDER]}>
      <div className="page-container">
        <h1 className="page-title">Dashboard</h1>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {statCards.map((stat) => (
            <div key={stat.title} className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">{stat.title}</p>
                  <p className="text-2xl font-bold text-gray-900 mt-1">
                    {stat.value}
                  </p>
                </div>
                <div className={`${stat.color} p-3 rounded-lg`}>
                  <stat.icon className="h-6 w-6 text-white" />
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="grid lg:grid-cols-2 gap-6">
          {/* Recent Orders */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-900">
                Recent Orders
              </h2>
              <Link
                href="/provider/orders"
                className="text-primary-600 hover:underline text-sm"
              >
                View All
              </Link>
            </div>

            {stats?.recentOrders && stats.recentOrders.length > 0 ? (
              <div className="space-y-4">
                {stats.recentOrders.map((order: any) => (
                  <Link key={order.id} href={`/provider/orders/${order.id}`}>
                    <div className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 transition-colors">
                      <div>
                        <p className="font-medium text-gray-900">
                          {order.customer?.name || 'Customer'}
                        </p>
                        <p className="text-sm text-gray-500">
                          {order.itemCount} items •{' '}
                          {format(new Date(order.createdAt), 'MMM d, h:mm a')}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold text-gray-900">
                          ${order.totalAmount.toFixed(2)}
                        </p>
                        <OrderStatusBadge status={order.status} />
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 text-center py-4">No recent orders</p>
            )}
          </div>

          {/* Top Selling Meals */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-900">
                Top Selling Meals
              </h2>
              <Link
                href="/provider/menu"
                className="text-primary-600 hover:underline text-sm"
              >
                Manage Menu
              </Link>
            </div>

            {stats?.topMeals && stats.topMeals.length > 0 ? (
              <div className="space-y-4">
                {stats.topMeals.map((meal: any, index: number) => (
                  <div key={meal.id} className="flex items-center gap-4">
                    <div className="w-8 h-8 rounded-full bg-primary-100 flex items-center justify-center font-semibold text-primary-600">
                      {index + 1}
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-gray-900">{meal.name}</p>
                      <p className="text-sm text-gray-500">
                        ${meal.price?.toFixed(2)}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-gray-900">
                        {meal.totalSold}
                      </p>
                      <p className="text-sm text-gray-500">sold</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 text-center py-4">
                No sales data yet
              </p>
            )}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="mt-8 bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            Quick Actions
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <Link
              href="/provider/menu/add"
              className="p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-primary-500 hover:bg-primary-50 transition-colors text-center"
            >
              <span className="text-2xl mb-2 block">➕</span>
              <span className="font-medium text-gray-900">Add New Meal</span>
            </Link>
            <Link
              href="/provider/orders?status=PENDING"
              className="p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-primary-500 hover:bg-primary-50 transition-colors text-center"
            >
              <span className="text-2xl mb-2 block">📋</span>
              <span className="font-medium text-gray-900">Pending Orders</span>
            </Link>
            <Link
              href="/provider/reviews"
              className="p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-primary-500 hover:bg-primary-50 transition-colors text-center"
            >
              <span className="text-2xl mb-2 block">⭐</span>
              <span className="font-medium text-gray-900">View Reviews</span>
            </Link>
          </div>
        </div>
      </div>
    </AuthGuard>
  );
}
