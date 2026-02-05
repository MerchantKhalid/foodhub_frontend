'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Image from 'next/image';
import { MapPinIcon, ClockIcon, PhoneIcon } from '@heroicons/react/24/outline';
import { providersApi } from '@/lib/api';
import MealCard from '@/components/meals/MealCard';
import { Spinner, StarRating, Badge } from '@/components/ui';

export default function ProviderDetailPage() {
  const { id } = useParams();
  const [provider, setProvider] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  useEffect(() => {
    const fetchProvider = async () => {
      try {
        const response = await providersApi.getById(id as string);
        setProvider(response.data.data);
      } catch (error) {
        console.error('Failed to fetch provider:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchProvider();
  }, [id]);

  if (loading) {
    return <Spinner className="min-h-screen" />;
  }

  if (!provider) {
    return (
      <div className="page-container text-center py-12">
        <h1 className="text-2xl font-bold text-gray-900">
          Restaurant not found
        </h1>
      </div>
    );
  }

  const categories = [
    ...new Set(
      provider.meals.map((m: any) => m.category?.name).filter(Boolean),
    ),
  ];
  const filteredMeals =
    selectedCategory === 'all'
      ? provider.meals
      : provider.meals.filter(
          (m: any) => m.category?.name === selectedCategory,
        );

  return (
    <div>
      {/* Header */}
      <div className="relative h-64 md:h-80 bg-gray-200">
        {provider.providerProfile?.imageUrl ? (
          <Image
            src={provider.providerProfile.imageUrl}
            alt={provider.providerProfile.restaurantName}
            fill
            className="object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-primary-100">
            <span className="text-8xl">🍽️</span>
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
      </div>

      <div className="page-container -mt-16 relative z-10">
        {/* Info Card */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
          <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                {provider.providerProfile?.restaurantName}
              </h1>

              {provider.providerProfile?.cuisineType && (
                <Badge variant="info" size="md" className="mb-3">
                  {provider.providerProfile.cuisineType}
                </Badge>
              )}

              {provider.avgRating > 0 && (
                <div className="flex items-center gap-2 mb-4">
                  <StarRating rating={provider.avgRating} showValue />
                  <span className="text-gray-500">
                    ({provider.reviewCount} reviews)
                  </span>
                </div>
              )}

              {provider.providerProfile?.description && (
                <p className="text-gray-600 mb-4 max-w-2xl">
                  {provider.providerProfile.description}
                </p>
              )}
            </div>

            <div className="text-sm text-gray-500 space-y-2">
              <div className="flex items-center">
                <MapPinIcon className="h-5 w-5 mr-2" />
                {provider.providerProfile?.address}
              </div>
              <div className="flex items-center">
                <ClockIcon className="h-5 w-5 mr-2" />
                {provider.providerProfile?.openingHours} -{' '}
                {provider.providerProfile?.closingHours}
              </div>
            </div>
          </div>
        </div>

        {/* Menu */}
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Menu</h2>

          {/* Category Filter */}
          {categories.length > 1 && (
            <div className="flex flex-wrap gap-2 mb-6">
              <button
                onClick={() => setSelectedCategory('all')}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                  selectedCategory === 'all'
                    ? 'bg-primary-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                All
              </button>
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                    selectedCategory === cat
                      ? 'bg-primary-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          )}

          {filteredMeals.length === 0 ? (
            <p className="text-gray-500 text-center py-8">No items available</p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredMeals.map((meal: any) => (
                <MealCard key={meal.id} meal={meal} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
