'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { MapPinIcon, ClockIcon } from '@heroicons/react/24/outline';
import { providersApi } from '@/lib/api';
import { Spinner, Pagination, StarRating, Input } from '@/components/ui';

interface Provider {
  id: string;
  name: string;
  providerProfile: {
    restaurantName: string;
    description?: string;
    address: string;
    openingHours: string;
    closingHours: string;
    imageUrl?: string;
    cuisineType?: string;
  };
  _count: {
    meals: number;
  };
  avgRating: number;
  reviewCount: number;
}

export default function ProvidersPage() {
  const [providers, setProviders] = useState<Provider[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 12,
    total: 0,
    totalPages: 0,
  });

  const fetchProviders = async (page = 1) => {
    setLoading(true);
    try {
      const response = await providersApi.getAll({
        page,
        limit: pagination.limit,
        search: search || undefined,
      });
      setProviders(response.data.data);
      setPagination(response.data.pagination);
    } catch (error) {
      console.error('Failed to fetch providers:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProviders();
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    fetchProviders(1);
  };

  const handlePageChange = (page: number) => {
    fetchProviders(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="page-container">
      <h1 className="page-title">Restaurants</h1>

      {/* Search */}
      <form onSubmit={handleSearch} className="mb-8">
        <div className="flex gap-2 max-w-md">
          <Input
            type="text"
            placeholder="Search restaurants..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <button
            type="submit"
            className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700"
          >
            Search
          </button>
        </div>
      </form>

      {loading ? (
        <Spinner className="py-12" />
      ) : providers.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-500">No restaurants found</p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {providers.map((provider) => (
              <Link key={provider.id} href={`/providers/${provider.id}`}>
                <div className="card group hover:shadow-lg transition-shadow">
                  <div className="relative h-48 bg-gray-200">
                    {provider.providerProfile.imageUrl ? (
                      <Image
                        src={provider.providerProfile.imageUrl}
                        alt={provider.providerProfile.restaurantName}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-4xl">
                        🍽️
                      </div>
                    )}
                  </div>
                  <div className="p-4">
                    <h3 className="font-semibold text-lg text-gray-900 group-hover:text-primary-600 transition-colors">
                      {provider.providerProfile.restaurantName}
                    </h3>

                    {provider.providerProfile.cuisineType && (
                      <p className="text-sm text-primary-600 mb-2">
                        {provider.providerProfile.cuisineType}
                      </p>
                    )}

                    {provider.avgRating > 0 && (
                      <div className="flex items-center gap-2 mb-2">
                        <StarRating
                          rating={provider.avgRating}
                          size="sm"
                          showValue
                        />
                        <span className="text-sm text-gray-500">
                          ({provider.reviewCount})
                        </span>
                      </div>
                    )}

                    <div className="flex items-center text-sm text-gray-500 mb-2">
                      <MapPinIcon className="h-4 w-4 mr-1" />
                      <span className="truncate">
                        {provider.providerProfile.address}
                      </span>
                    </div>

                    <div className="flex items-center justify-between text-sm">
                      <span className="flex items-center text-gray-500">
                        <ClockIcon className="h-4 w-4 mr-1" />
                        {provider.providerProfile.openingHours} -{' '}
                        {provider.providerProfile.closingHours}
                      </span>
                      <span className="text-primary-600 font-medium">
                        {provider._count.meals} items
                      </span>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>

          {pagination.totalPages > 1 && (
            <div className="mt-8">
              <Pagination
                currentPage={pagination.page}
                totalPages={pagination.totalPages}
                onPageChange={handlePageChange}
              />
            </div>
          )}
        </>
      )}
    </div>
  );
}
