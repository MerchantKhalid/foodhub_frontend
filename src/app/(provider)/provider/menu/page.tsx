'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  PlusIcon,
  PencilIcon,
  TrashIcon,
  EyeIcon,
  EyeSlashIcon,
} from '@heroicons/react/24/outline';
import toast from 'react-hot-toast';
import { providerApi } from '@/lib/api';
import { Meal, Role } from '@/types';
import AuthGuard from '@/components/providers/AuthGuard';
import {
  Button,
  Badge,
  Spinner,
  Pagination,
  Modal,
  StarRating,
} from '@/components/ui';

export default function ProviderMenuPage() {
  const [meals, setMeals] = useState<Meal[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleteModal, setDeleteModal] = useState<{
    open: boolean;
    meal: Meal | null;
  }>({
    open: false,
    meal: null,
  });
  const [deleting, setDeleting] = useState(false);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0,
  });

  const fetchMeals = async (page = 1) => {
    setLoading(true);
    try {
      const response = await providerApi.getMeals({
        page,
        limit: pagination.limit,
      });
      setMeals(response.data.data);
      setPagination(response.data.pagination);
    } catch (error) {
      console.error('Failed to fetch meals:', error);
      toast.error('Failed to load menu');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMeals();
  }, []);

  const handleToggleAvailability = async (meal: Meal) => {
    try {
      await providerApi.toggleAvailability(meal.id);
      setMeals(
        meals.map((m) =>
          m.id === meal.id ? { ...m, isAvailable: !m.isAvailable } : m,
        ),
      );
      toast.success(
        `${meal.name} is now ${!meal.isAvailable ? 'available' : 'unavailable'}`,
      );
    } catch (error) {
      toast.error('Failed to update availability');
    }
  };

  const handleDelete = async () => {
    if (!deleteModal.meal) return;

    setDeleting(true);
    try {
      await providerApi.deleteMeal(deleteModal.meal.id);
      setMeals(meals.filter((m) => m.id !== deleteModal.meal!.id));
      toast.success('Meal deleted successfully');
      setDeleteModal({ open: false, meal: null });
    } catch (error) {
      toast.error('Failed to delete meal');
    } finally {
      setDeleting(false);
    }
  };

  return (
    <AuthGuard allowedRoles={[Role.PROVIDER]}>
      <div className="page-container">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
          <h1 className="page-title mb-0">Menu Management</h1>
          <Link href="/provider/menu/add">
            <Button variant="primary">
              <PlusIcon className="h-5 w-5 mr-2" />
              Add New Meal
            </Button>
          </Link>
        </div>

        {loading ? (
          <Spinner className="py-12" />
        ) : meals.length === 0 ? (
          <div className="bg-white rounded-lg shadow-sm p-12 text-center">
            <span className="text-6xl mb-4 block">🍽️</span>
            <h2 className="text-xl font-semibold text-gray-900 mb-2">
              No meals yet
            </h2>
            <p className="text-gray-500 mb-4">
              Start adding meals to your menu
            </p>
            <Link href="/provider/menu/add">
              <Button variant="primary">Add Your First Meal</Button>
            </Link>
          </div>
        ) : (
          <>
            <div className="bg-white rounded-lg shadow-sm overflow-hidden">
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Meal
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Category
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Price
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Rating
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {meals.map((meal) => (
                      <tr key={meal.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="relative w-12 h-12 rounded-lg overflow-hidden bg-gray-200 flex-shrink-0">
                              {meal.imageUrl ? (
                                <Image
                                  src={meal.imageUrl}
                                  alt={meal.name}
                                  fill
                                  className="object-cover"
                                />
                              ) : (
                                <div className="w-full h-full flex items-center justify-center text-lg">
                                  🍽️
                                </div>
                              )}
                            </div>
                            <div className="ml-4">
                              <div className="text-sm font-medium text-gray-900">
                                {meal.name}
                              </div>
                              <div className="text-sm text-gray-500 truncate max-w-[200px]">
                                {meal.description}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <Badge>
                            {meal.category?.name || 'Uncategorized'}
                          </Badge>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          ${meal.price.toFixed(2)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {meal.avgRating && meal.avgRating > 0 ? (
                            <div className="flex items-center">
                              <StarRating rating={meal.avgRating} size="sm" />
                              <span className="ml-1 text-sm text-gray-500">
                                ({meal.reviewCount})
                              </span>
                            </div>
                          ) : (
                            <span className="text-sm text-gray-400">
                              No reviews
                            </span>
                          )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <Badge
                            variant={meal.isAvailable ? 'success' : 'danger'}
                          >
                            {meal.isAvailable ? 'Available' : 'Unavailable'}
                          </Badge>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <div className="flex items-center justify-end gap-2">
                            <button
                              onClick={() => handleToggleAvailability(meal)}
                              className="p-2 text-gray-400 hover:text-gray-600"
                              title={
                                meal.isAvailable
                                  ? 'Mark unavailable'
                                  : 'Mark available'
                              }
                            >
                              {meal.isAvailable ? (
                                <EyeSlashIcon className="h-5 w-5" />
                              ) : (
                                <EyeIcon className="h-5 w-5" />
                              )}
                            </button>
                            <Link
                              href={`/provider/menu/edit/${meal.id}`}
                              className="p-2 text-gray-400 hover:text-primary-600"
                            >
                              <PencilIcon className="h-5 w-5" />
                            </Link>
                            <button
                              onClick={() =>
                                setDeleteModal({ open: true, meal })
                              }
                              className="p-2 text-gray-400 hover:text-red-600"
                            >
                              <TrashIcon className="h-5 w-5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {pagination.totalPages > 1 && (
              <div className="mt-6">
                <Pagination
                  currentPage={pagination.page}
                  totalPages={pagination.totalPages}
                  onPageChange={fetchMeals}
                />
              </div>
            )}
          </>
        )}

        {/* Delete Confirmation Modal */}
        <Modal
          isOpen={deleteModal.open}
          onClose={() => setDeleteModal({ open: false, meal: null })}
          title="Delete Meal"
        >
          <div className="mt-2">
            <p className="text-gray-600">
              Are you sure you want to delete{' '}
              <strong>{deleteModal.meal?.name}</strong>? This action cannot be
              undone.
            </p>
          </div>
          <div className="mt-6 flex justify-end gap-3">
            <Button
              variant="secondary"
              onClick={() => setDeleteModal({ open: false, meal: null })}
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
