'use client';

import Image from 'next/image';
import Link from 'next/link';
import { ShoppingCartIcon } from '@heroicons/react/24/outline';
import { Meal, Role } from '@/types';
import { useCartStore, useAuthStore } from '@/lib/store';
import { Badge, StarRating } from '@/components/ui';
import toast from 'react-hot-toast';

interface MealCardProps {
  meal: Meal;
}

export default function MealCard({ meal }: MealCardProps) {
  const { addItem, items } = useCartStore();
  const { isAuthenticated, user } = useAuthStore();

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    // Check if adding from different provider
    if (items.length > 0 && items[0].meal.providerId !== meal.providerId) {
      if (
        !confirm('Adding this item will clear your current cart. Continue?')
      ) {
        return;
      }
    }

    addItem(meal);
    toast.success('Added to cart!');
  };

  const showAddToCart = !isAuthenticated || user?.role === Role.CUSTOMER;

  const getDietaryBadge = () => {
    const badges: Record<
      string,
      { label: string; variant: 'success' | 'info' | 'warning' }
    > = {
      VEGETARIAN: { label: '🥬 Vegetarian', variant: 'success' },
      VEGAN: { label: '🌱 Vegan', variant: 'success' },
      GLUTEN_FREE: { label: '🌾 Gluten-Free', variant: 'info' },
      HALAL: { label: '☪️ Halal', variant: 'info' },
    };
    return badges[meal.dietaryInfo];
  };

  const dietaryBadge = getDietaryBadge();

  return (
    <Link href={`/meals/${meal.id}`}>
      <div className="card group hover:shadow-lg transition-shadow duration-300">
        {/* Image */}
        <div className="relative h-48 bg-gray-200">
          {meal.imageUrl ? (
            <Image
              src={meal.imageUrl}
              alt={meal.name}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-300"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-gray-400">
              <span className="text-4xl">🍽️</span>
            </div>
          )}
          {!meal.isAvailable && (
            <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
              <span className="text-white font-semibold">Unavailable</span>
            </div>
          )}
          {dietaryBadge && (
            <div className="absolute top-2 left-2">
              <Badge variant={dietaryBadge.variant}>{dietaryBadge.label}</Badge>
            </div>
          )}
        </div>

        {/* Content */}
        <div className="p-4">
          <div className="flex justify-between items-start mb-2">
            <h3 className="font-semibold text-gray-900 group-hover:text-primary-600 transition-colors">
              {meal.name}
            </h3>
            <span className="font-bold text-primary-600">
              ${meal.price.toFixed(2)}
            </span>
          </div>

          {meal.provider?.providerProfile && (
            <p className="text-sm text-gray-500 mb-2">
              {meal.provider.providerProfile.restaurantName}
            </p>
          )}

          <p className="text-sm text-gray-600 line-clamp-2 mb-3">
            {meal.description}
          </p>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              {meal.avgRating !== undefined && meal.avgRating > 0 && (
                <StarRating rating={meal.avgRating} size="sm" showValue />
              )}
              {meal.reviewCount !== undefined && meal.reviewCount > 0 && (
                <span className="text-xs text-gray-500">
                  ({meal.reviewCount})
                </span>
              )}
            </div>

            {showAddToCart && meal.isAvailable && (
              <button
                onClick={handleAddToCart}
                className="p-2 rounded-full bg-primary-100 text-primary-600 hover:bg-primary-200 transition-colors"
              >
                <ShoppingCartIcon className="h-5 w-5" />
              </button>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
}
