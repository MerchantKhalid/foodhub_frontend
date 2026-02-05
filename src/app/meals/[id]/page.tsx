'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import {
  ClockIcon,
  ShoppingCartIcon,
  MinusIcon,
  PlusIcon,
} from '@heroicons/react/24/outline';
import toast from 'react-hot-toast';
import { mealsApi } from '@/lib/api';
import { Meal, Role } from '@/types';
import { useCartStore, useAuthStore } from '@/lib/store';
import { Button, Badge, Spinner, StarRating } from '@/components/ui';
import { format } from 'date-fns';

export default function MealDetailPage() {
  const { id } = useParams();
  const [meal, setMeal] = useState<Meal | null>(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const { addItem, items, updateQuantity } = useCartStore();
  const { isAuthenticated, user } = useAuthStore();

  useEffect(() => {
    const fetchMeal = async () => {
      try {
        const response = await mealsApi.getById(id as string);
        setMeal(response.data.data);
      } catch (error) {
        console.error('Failed to fetch meal:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchMeal();
  }, [id]);

  if (loading) {
    return <Spinner className="min-h-screen" />;
  }

  if (!meal) {
    return (
      <div className="page-container text-center py-12">
        <h1 className="text-2xl font-bold text-gray-900">Meal not found</h1>
        <Link
          href="/meals"
          className="text-primary-600 hover:underline mt-4 inline-block"
        >
          Browse all meals
        </Link>
      </div>
    );
  }

  const handleAddToCart = () => {
    if (items.length > 0 && items[0].meal.providerId !== meal.providerId) {
      if (
        !confirm('Adding this item will clear your current cart. Continue?')
      ) {
        return;
      }
    }

    for (let i = 0; i < quantity; i++) {
      addItem(meal);
    }
    toast.success(`Added ${quantity} ${meal.name} to cart`);
    setQuantity(1);
  };

  const showAddToCart =
    (!isAuthenticated || user?.role === Role.CUSTOMER) && meal.isAvailable;

  const getDietaryLabel = (type: string) => {
    const labels: Record<string, string> = {
      VEGETARIAN: '🥬 Vegetarian',
      VEGAN: '🌱 Vegan',
      GLUTEN_FREE: '🌾 Gluten-Free',
      DAIRY_FREE: '🥛 Dairy-Free',
      NUT_FREE: '🥜 Nut-Free',
      HALAL: '☪️ Halal',
      KOSHER: '✡️ Kosher',
    };
    return labels[type] || type;
  };

  return (
    <div className="page-container">
      <div className="grid lg:grid-cols-2 gap-8">
        {/* Image */}
        <div className="relative aspect-square rounded-2xl overflow-hidden bg-gray-200">
          {meal.imageUrl ? (
            <Image
              src={meal.imageUrl}
              alt={meal.name}
              fill
              className="object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-6xl">
              🍽️
            </div>
          )}
          {!meal.isAvailable && (
            <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
              <span className="text-white text-2xl font-bold">
                Currently Unavailable
              </span>
            </div>
          )}
        </div>

        {/* Details */}
        <div>
          <div className="flex items-start justify-between mb-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                {meal.name}
              </h1>
              {meal.provider?.providerProfile && (
                <Link
                  href={`/providers/${meal.providerId}`}
                  className="text-primary-600 hover:underline"
                >
                  {meal.provider.providerProfile.restaurantName}
                </Link>
              )}
            </div>
            <span className="text-3xl font-bold text-primary-600">
              ${meal.price.toFixed(2)}
            </span>
          </div>

          {/* Rating */}
          {meal.avgRating !== undefined && meal.avgRating > 0 && (
            <div className="flex items-center gap-2 mb-4">
              <StarRating rating={meal.avgRating} showValue />
              <span className="text-gray-500">
                ({meal.reviewCount} reviews)
              </span>
            </div>
          )}

          {/* Badges */}
          <div className="flex flex-wrap gap-2 mb-6">
            {meal.dietaryInfo && meal.dietaryInfo !== 'NONE' && (
              <Badge variant="success">
                {getDietaryLabel(meal.dietaryInfo)}
              </Badge>
            )}
            <Badge variant="info">
              <ClockIcon className="h-4 w-4 mr-1" />
              {meal.prepTime} mins
            </Badge>
            {meal.category && <Badge>{meal.category.name}</Badge>}
          </div>

          {/* Description */}
          <p className="text-gray-600 mb-6">{meal.description}</p>

          {/* Ingredients */}
          {meal.ingredients && (
            <div className="mb-6">
              <h3 className="font-semibold text-gray-900 mb-2">Ingredients</h3>
              <p className="text-gray-600">{meal.ingredients}</p>
            </div>
          )}

          {/* Add to Cart */}
          {showAddToCart && (
            <div className="flex items-center gap-4">
              <div className="flex items-center border rounded-lg">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="p-2 hover:bg-gray-100"
                >
                  <MinusIcon className="h-5 w-5" />
                </button>
                <span className="px-4 py-2 font-semibold">{quantity}</span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="p-2 hover:bg-gray-100"
                >
                  <PlusIcon className="h-5 w-5" />
                </button>
              </div>
              <Button
                variant="primary"
                size="lg"
                onClick={handleAddToCart}
                className="flex-1"
              >
                <ShoppingCartIcon className="h-5 w-5 mr-2" />
                Add to Cart - ${(meal.price * quantity).toFixed(2)}
              </Button>
            </div>
          )}
        </div>
      </div>

      {/* Reviews Section */}
      {meal.reviews && meal.reviews.length > 0 && (
        <div className="mt-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            Customer Reviews
          </h2>
          <div className="space-y-4">
            {meal.reviews.map((review: any) => (
              <div
                key={review.id}
                className="bg-white rounded-lg shadow-sm p-6"
              >
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <p className="font-semibold text-gray-900">
                      {review.customer?.name}
                    </p>
                    <StarRating rating={review.rating} size="sm" />
                  </div>
                  <span className="text-sm text-gray-500">
                    {format(new Date(review.createdAt), 'MMM d, yyyy')}
                  </span>
                </div>
                {review.comment && (
                  <p className="text-gray-600 mt-2">{review.comment}</p>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
