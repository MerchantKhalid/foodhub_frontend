'use client';

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import toast from 'react-hot-toast';
import { adminApi, categoriesApi } from '@/lib/api';
import { Category, Role } from '@/types';
import AuthGuard from '@/components/providers/AuthGuard';
import {
  Button,
  Input,
  Textarea,
  Spinner,
  Modal,
  Badge,
} from '@/components/ui';
import { PencilIcon, TrashIcon, PlusIcon } from '@heroicons/react/24/outline';

const categorySchema = z.object({
  name: z.string().min(2, 'Category name is required'),
  description: z.string().optional(),
  imageUrl: z.string().url('Must be a valid URL').optional().or(z.literal('')),
});

type CategoryForm = z.infer<typeof categorySchema>;

export default function AdminCategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [deleting, setDeleting] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<CategoryForm>({
    resolver: zodResolver(categorySchema),
  });

  const fetchCategories = async () => {
    try {
      const response = await categoriesApi.getAll();
      setCategories(response.data.data);
    } catch (error) {
      console.error('Failed to fetch categories:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const openModal = (category?: Category) => {
    if (category) {
      setEditingCategory(category);
      reset({
        name: category.name,
        description: category.description || '',
        imageUrl: category.imageUrl || '',
      });
    } else {
      setEditingCategory(null);
      reset({ name: '', description: '', imageUrl: '' });
    }
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setEditingCategory(null);
    reset({ name: '', description: '', imageUrl: '' });
  };

  const onSubmit = async (data: CategoryForm) => {
    setSubmitting(true);
    try {
      if (editingCategory) {
        await adminApi.updateCategory(editingCategory.id, {
          ...data,
          imageUrl: data.imageUrl || undefined,
        });
        toast.success('Category updated successfully');
      } else {
        await adminApi.createCategory({
          ...data,
          imageUrl: data.imageUrl || undefined,
        });
        toast.success('Category created successfully');
      }
      closeModal();
      fetchCategories();
    } catch (error: any) {
      toast.error(error.response?.data?.error || 'Operation failed');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (category: Category) => {
    if (!confirm(`Are you sure you want to delete "${category.name}"?`)) return;

    setDeleting(category.id);
    try {
      await adminApi.deleteCategory(category.id);
      toast.success('Category deleted successfully');
      fetchCategories();
    } catch (error: any) {
      toast.error(error.response?.data?.error || 'Failed to delete category');
    } finally {
      setDeleting(null);
    }
  };

  return (
    <AuthGuard allowedRoles={[Role.ADMIN]}>
      <div className="page-container">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
          <h1 className="page-title mb-0">Category Management</h1>
          <Button variant="primary" onClick={() => openModal()}>
            <PlusIcon className="h-5 w-5 mr-2" />
            Add Category
          </Button>
        </div>

        {loading ? (
          <Spinner className="py-12" />
        ) : categories.length === 0 ? (
          <div className="bg-white rounded-lg shadow-sm p-12 text-center">
            <p className="text-gray-500 mb-4">No categories yet</p>
            <Button variant="primary" onClick={() => openModal()}>
              Create First Category
            </Button>
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Category
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Description
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Meals
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {categories.map((category) => (
                    <tr key={category.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-3">
                          {category.imageUrl && (
                            <img
                              src={category.imageUrl}
                              alt={category.name}
                              className="w-10 h-10 rounded-lg object-cover"
                            />
                          )}
                          <span className="font-medium text-gray-900">
                            {category.name}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-sm text-gray-500 line-clamp-2 max-w-xs">
                          {category.description || '-'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <Badge>{category._count?.meals || 0} meals</Badge>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right">
                        <div className="flex justify-end gap-2">
                          <button
                            onClick={() => openModal(category)}
                            className="p-2 text-gray-400 hover:text-primary-600"
                          >
                            <PencilIcon className="h-5 w-5" />
                          </button>
                          <button
                            onClick={() => handleDelete(category)}
                            disabled={deleting === category.id}
                            className="p-2 text-gray-400 hover:text-red-600 disabled:opacity-50"
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
        )}

        {/* Category Modal */}
        <Modal
          isOpen={modalOpen}
          onClose={closeModal}
          title={editingCategory ? 'Edit Category' : 'Add Category'}
        >
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 mt-4">
            <Input
              label="Category Name"
              {...register('name')}
              error={errors.name?.message}
            />

            <Textarea
              label="Description (Optional)"
              rows={3}
              {...register('description')}
            />

            <Input
              label="Image URL (Optional)"
              type="url"
              placeholder="https://example.com/image.jpg"
              {...register('imageUrl')}
              error={errors.imageUrl?.message}
            />

            <div className="flex justify-end gap-3 pt-4">
              <Button type="button" variant="secondary" onClick={closeModal}>
                Cancel
              </Button>
              <Button type="submit" variant="primary" isLoading={submitting}>
                {editingCategory ? 'Update' : 'Create'}
              </Button>
            </div>
          </form>
        </Modal>
      </div>
    </AuthGuard>
  );
}
