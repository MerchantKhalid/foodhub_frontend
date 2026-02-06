'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { format } from 'date-fns';
import toast from 'react-hot-toast';
import { adminApi } from '@/lib/api';
import { Review, Role } from '@/types';
import AuthGuard from '@/components/providers/AuthGuard';
import {
  Spinner,
  Pagination,
  StarRating,
  Button,
  Modal,
} from '@/components/ui';
import { TrashIcon } from '@heroicons/react/24/outline';

export default function AdminReviewsPage() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 20,
    total: 0,
    totalPages: 0,
  });
  const [deleteModal, setDeleteModal] = useState<{
    open: boolean;
    review: Review | null;
  }>({
    open: false,
    review: null,
  });
  const [deleting, setDeleting] = useState(false);

  const fetchReviews = async (page = 1) => {
    setLoading(true);
    try {
      const response = await adminApi.getReviews({
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

  const handleDelete = async () => {
    if (!deleteModal.review) return;

    setDeleting(true);
    try {
      await adminApi.deleteReview(deleteModal.review.id);
      toast.success('Review deleted successfully');
      setDeleteModal({ open: false, review: null });
      fetchReviews(pagination.page);
    } catch (error: any) {
      toast.error(error.response?.data?.error || 'Failed to delete review');
    } finally {
      setDeleting(false);
    }
  };

  return (
    <AuthGuard allowedRoles={[Role.ADMIN]}>
      <div className="page-container">
        <h1 className="page-title">Review Moderation</h1>

        {loading ? (
          <Spinner className="py-12" />
        ) : reviews.length === 0 ? (
          <div className="bg-white rounded-lg shadow-sm p-12 text-center">
            <p className="text-gray-500">No reviews to moderate</p>
          </div>
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
                            by {review.customer?.name} ({review.customer?.email}
                            )
                          </p>
                          <p className="text-xs text-gray-400">
                            {
                              review.meal?.provider?.providerProfile
                                ?.restaurantName
                            }
                          </p>
                        </div>
                        <div className="flex items-center gap-4">
                          <span className="text-sm text-gray-400">
                            {format(new Date(review.createdAt), 'MMM d, yyyy')}
                          </span>
                          <Button
                            variant="danger"
                            size="sm"
                            onClick={() =>
                              setDeleteModal({ open: true, review })
                            }
                          >
                            <TrashIcon className="h-4 w-4" />
                          </Button>
                        </div>
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

        {/* Delete Modal */}
        <Modal
          isOpen={deleteModal.open}
          onClose={() => setDeleteModal({ open: false, review: null })}
          title="Delete Review"
        >
          <div className="mt-2">
            <p className="text-gray-600">
              Are you sure you want to delete this review? This action cannot be
              undone.
            </p>
            {deleteModal.review?.comment && (
              <div className="mt-4 p-3 bg-gray-50 rounded-lg">
                <p className="text-sm text-gray-600 italic">
                  "{deleteModal.review.comment}"
                </p>
              </div>
            )}
          </div>
          <div className="mt-6 flex justify-end gap-3">
            <Button
              variant="secondary"
              onClick={() => setDeleteModal({ open: false, review: null })}
            >
              Cancel
            </Button>
            <Button
              variant="danger"
              onClick={handleDelete}
              isLoading={deleting}
            >
              Delete
            </Button>
          </div>
        </Modal>
      </div>
    </AuthGuard>
  );
}
