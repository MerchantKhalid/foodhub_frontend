'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { format } from 'date-fns';
import { providerApi } from '@/lib/api';
import { Review, Role } from '@/types';
import AuthGuard from '@/components/providers/AuthGuard';
import { Spinner, Pagination, EmptyState, StarRating } from '@/components/ui';
import { ChatBubbleLeftRightIcon } from '@heroicons/react/24/outline';

export default function ProviderReviewsPage() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0,
  });

  const fetchReviews = async (page = 1) => {
    setLoading(true);
    try {
      const response = await providerApi.getReviews({
        page,
        limit: pagination.limit,
      });
      setReviews(response.data.data);
      setPagination(response.data.pagination);
    } catch (error) {
      console.error('Failed to fetch reviews:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReviews();
  }, []);

  return (
    <AuthGuard allowedRoles={[Role.PROVIDER]}>
      <div className="page-container">
        <h1 className="page-title">Customer Reviews</h1>

        {loading ? (
          <Spinner className="py-12" />
        ) : reviews.length === 0 ? (
          <EmptyState
            icon={<ChatBubbleLeftRightIcon className="h-12 w-12" />}
            title="No reviews yet"
            description="Reviews will appear here when customers rate your meals"
          />
        ) : (
          <>
            <div className="space-y-4">
              {reviews.map((review: any) => (
                <div
                  key={review.id}
                  className="bg-white rounded-lg shadow-sm p-6"
                >
                  <div className="flex gap-4">
                    <div className="relative w-16 h-16 rounded-lg overflow-hidden bg-gray-200 flex-shrink-0">
                      {review.meal?.imageUrl ? (
                        <Image
                          src={review.meal.imageUrl}
                          alt={review.meal.name}
                          fill
                          className="object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-xl">
                          🍽️
                        </div>
                      )}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-start justify-between">
                        <div>
                          <h3 className="font-semibold text-gray-900">
                            {review.meal?.name}
                          </h3>
                          <p className="text-sm text-gray-500">
                            by {review.customer?.name}
                          </p>
                        </div>
                        <span className="text-sm text-gray-400">
                          {format(new Date(review.createdAt), 'MMM d, yyyy')}
                        </span>
                      </div>
                      <div className="mt-2">
                        <StarRating rating={review.rating} size="sm" />
                      </div>
                      {review.comment && (
                        <p className="mt-3 text-gray-600">{review.comment}</p>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {pagination.totalPages > 1 && (
              <div className="mt-6">
                <Pagination
                  currentPage={pagination.page}
                  totalPages={pagination.totalPages}
                  onPageChange={fetchReviews}
                />
              </div>
            )}
          </>
        )}
      </div>
    </AuthGuard>
  );
}
