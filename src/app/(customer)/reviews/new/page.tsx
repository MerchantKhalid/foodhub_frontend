'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Image from 'next/image';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import toast from 'react-hot-toast';
import { reviewsApi, mealsApi, ordersApi } from '@/lib/api';
import { Meal, Order, Role } from '@/types';
import AuthGuard from '@/components/providers/AuthGuard';
import { Button, Textarea, StarRating, Spinner } from '@/components/ui';

const reviewSchema = z.object({
  rating: z.number().min(1, 'Please select a rating').max(5),
  comment: z.string().optional(),
});

type ReviewForm = z.infer<typeof reviewSchema>;

export default function NewReviewPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const mealId = searchParams.get('mealId');
  const orderId = searchParams.get('orderId');

  const [meal, setMeal] = useState<Meal | null>(null);
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [rating, setRating] = useState(0);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm<ReviewForm>({
    resolver: zodResolver(reviewSchema),
    defaultValues: {
      rating: 0,
      comment: '',
    },
  });

  useEffect(() => {
    const fetchData = async () => {
      if (!mealId || !orderId) {
        router.push('/orders');
        return;
      }

      try {
        const [mealRes, orderRes] = await Promise.all([
          mealsApi.getById(mealId),
          ordersApi.getById(orderId),
        ]);
        setMeal(mealRes.data.data);
        setOrder(orderRes.data.data);
      } catch (error) {
        console.error('Failed to fetch data:', error);
        toast.error('Failed to load meal information');
        router.push('/orders');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [mealId, orderId, router]);

  const handleRatingChange = (value: number) => {
    setRating(value);
    setValue('rating', value);
  };

  const onSubmit = async (data: ReviewForm) => {
    if (!mealId || !orderId) return;

    setSubmitting(true);
    try {
      await reviewsApi.create({
        mealId,
        orderId,
        rating: data.rating,
        comment: data.comment,
      });
      toast.success('Review submitted successfully!');
      router.push(`/orders/${orderId}`);
    } catch (error: any) {
      toast.error(error.response?.data?.error || 'Failed to submit review');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return <Spinner className="min-h-screen" />;
  }

  if (!meal || !order) {
    return null;
  }

  return (
    <AuthGuard allowedRoles={[Role.CUSTOMER]}>
      <div className="page-container">
        <div className="max-w-2xl mx-auto">
          <h1 className="page-title">Write a Review</h1>

          {/* Meal Info */}
          <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
            <div className="flex gap-4">
              <div className="relative w-24 h-24 rounded-lg overflow-hidden bg-gray-200 flex-shrink-0">
                {meal.imageUrl ? (
                  <Image
                    src={meal.imageUrl}
                    alt={meal.name}
                    fill
                    className="object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-2xl">
                    🍽️
                  </div>
                )}
              </div>
              <div>
                <h2 className="font-semibold text-lg text-gray-900">
                  {meal.name}
                </h2>
                <p className="text-gray-500">
                  {meal.provider?.providerProfile?.restaurantName}
                </p>
                <p className="text-sm text-gray-400 mt-1">
                  Order #{order.id.slice(0, 8).toUpperCase()}
                </p>
              </div>
            </div>
          </div>

          {/* Review Form */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              {/* Rating */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Your Rating
                </label>
                <div className="flex items-center gap-2">
                  <StarRating
                    rating={rating}
                    size="lg"
                    interactive
                    onChange={handleRatingChange}
                  />
                  <span className="text-lg font-medium text-gray-600">
                    {rating > 0 ? `${rating} / 5` : 'Select rating'}
                  </span>
                </div>
                {errors.rating && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors.rating.message}
                  </p>
                )}
              </div>

              {/* Comment */}
              <Textarea
                label="Your Review (Optional)"
                rows={5}
                placeholder="Share your experience with this meal..."
                {...register('comment')}
                error={errors.comment?.message}
              />

              {/* Submit */}
              <div className="flex gap-3">
                <Button type="submit" variant="primary" isLoading={submitting}>
                  Submit Review
                </Button>
                <Button
                  type="button"
                  variant="secondary"
                  onClick={() => router.back()}
                >
                  Cancel
                </Button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </AuthGuard>
  );
}
