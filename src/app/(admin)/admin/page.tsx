'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  UsersIcon,
  ShoppingBagIcon,
  CurrencyDollarIcon,
  BuildingStorefrontIcon,
  TagIcon,
  StarIcon,
} from '@heroicons/react/24/outline';
import { adminApi } from '@/lib/api';
import { Role } from '@/types';
import AuthGuard from '@/components/providers/AuthGuard';
import OrderStatusBadge from '@/components/orders/OrderStatusBadge';
import { Spinner } from '@/components/ui';
import { format } from 'date-fns';

interface PlatformStats {
  users: {
    total: number;
    customers: number;
    providers: number;
    active: number;
    suspended: number;
  };
  orders: {
    total: number;
    pending: number;
    delivered: number;
    cancelled: number;
  };
  revenue: number;
  meals: number;
  categories: number;
  reviews: number;
  recentOrders: any[];
  topProviders: any[];
}

export default function AdminDashboardPage() {
  const [stats, setStats] = useState<PlatformStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await adminApi.getStats();
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
      title: 'Total Users',
      value: stats?.users.total || 0,
      subtitle: `${stats?.users.customers || 0} customers, ${stats?.users.providers || 0} providers`,
      icon: UsersIcon,
      color: 'bg-blue-500',
      link: '/admin/users',
    },
    {
      title: 'Total Orders',
      value: stats?.orders.total || 0,
      subtitle: `${stats?.orders.pending || 0} pending`,
      icon: ShoppingBagIcon,
      color: 'bg-green-500',
      link: '/admin/orders',
    },
    {
      title: 'Total Revenue',
      value: `$${stats?.revenue?.toFixed(2) || '0.00'}`,
      subtitle: `${stats?.orders.delivered || 0} delivered orders`,
      icon: CurrencyDollarIcon,
      color: 'bg-yellow-500',
      link: '/admin/orders',
    },
    {
      title: 'Active Providers',
      value: stats?.users.providers || 0,
      subtitle: `${stats?.meals || 0} total meals`,
      icon: BuildingStorefrontIcon,
      color: 'bg-purple-500',
      link: '/admin/users?role=PROVIDER',
    },
    {
      title: 'Categories',
      value: stats?.categories || 0,
      subtitle: 'Food categories',
      icon: TagIcon,
      color: 'bg-pink-500',
      link: '/admin/categories',
    },
    {
      title: 'Reviews',
      value: stats?.reviews || 0,
      subtitle: 'Customer reviews',
      icon: StarIcon,
      color: 'bg-orange-500',
      link: '/admin/reviews',
    },
  ];

  return (
    <AuthGuard allowedRoles={[Role.ADMIN]}>
      <div className="page-container">
        <h1 className="page-title">Admin Dashboard</h1>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {statCards.map((stat) => (
            <Link key={stat.title} href={stat.link}>
              <div className="bg-white rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-500">{stat.title}</p>
                    <p className="text-2xl font-bold text-gray-900 mt-1">
                      {stat.value}
                    </p>
                    <p className="text-xs text-gray-400 mt-1">
                      {stat.subtitle}
                    </p>
                  </div>
                  <div className={`${stat.color} p-3 rounded-lg`}>
                    <stat.icon className="h-6 w-6 text-white" />
                  </div>
                </div>
              </div>
            </Link>
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
                href="/admin/orders"
                className="text-primary-600 hover:underline text-sm"
              >
                View All
              </Link>
            </div>

            {stats?.recentOrders && stats.recentOrders.length > 0 ? (
              <div className="space-y-4">
                {stats.recentOrders.slice(0, 5).map((order: any) => (
                  <Link key={order.id} href={`/admin/orders/${order.id}`}>
                    <div className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 transition-colors">
                      <div>
                        <p className="font-medium text-gray-900">
                          #{order.id.slice(0, 8).toUpperCase()}
                        </p>
                        <p className="text-sm text-gray-500">
                          {order.customer?.name} →{' '}
                          {order.provider?.providerProfile?.restaurantName ||
                            'Restaurant'}
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

          {/* Top Providers */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-900">
                Top Providers
              </h2>
              <Link
                href="/admin/users?role=PROVIDER"
                className="text-primary-600 hover:underline text-sm"
              >
                View All
              </Link>
            </div>

            {stats?.topProviders && stats.topProviders.length > 0 ? (
              <div className="space-y-4">
                {stats.topProviders.map((provider: any, index: number) => (
                  <div key={provider.id} className="flex items-center gap-4">
                    <div className="w-8 h-8 rounded-full bg-primary-100 flex items-center justify-center font-semibold text-primary-600">
                      {index + 1}
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-gray-900">
                        {provider.providerProfile?.restaurantName ||
                          'Restaurant'}
                      </p>
                      <p className="text-sm text-gray-500">
                        {provider.totalOrders} orders
                      </p>
                    </div>
                    <p className="font-semibold text-green-600">
                      ${provider.totalRevenue?.toFixed(2) || '0.00'}
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 text-center py-4">No provider data</p>
            )}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="mt-8 bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            Quick Actions
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
            <Link
              href="/admin/users"
              className="p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-primary-500 hover:bg-primary-50 transition-colors text-center"
            >
              <UsersIcon className="h-8 w-8 mx-auto mb-2 text-gray-400" />
              <span className="font-medium text-gray-900">Manage Users</span>
            </Link>
            <Link
              href="/admin/categories"
              className="p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-primary-500 hover:bg-primary-50 transition-colors text-center"
            >
              <TagIcon className="h-8 w-8 mx-auto mb-2 text-gray-400" />
              <span className="font-medium text-gray-900">Categories</span>
            </Link>
            <Link
              href="/admin/orders"
              className="p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-primary-500 hover:bg-primary-50 transition-colors text-center"
            >
              <ShoppingBagIcon className="h-8 w-8 mx-auto mb-2 text-gray-400" />
              <span className="font-medium text-gray-900">View Orders</span>
            </Link>
            <Link
              href="/admin/reviews"
              className="p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-primary-500 hover:bg-primary-50 transition-colors text-center"
            >
              <StarIcon className="h-8 w-8 mx-auto mb-2 text-gray-400" />
              <span className="font-medium text-gray-900">
                Moderate Reviews
              </span>
            </Link>
          </div>
        </div>
      </div>
    </AuthGuard>
  );
}
