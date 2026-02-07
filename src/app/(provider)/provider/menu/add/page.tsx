'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import toast from 'react-hot-toast';
import { providerApi, categoriesApi } from '@/lib/api';
import { Category, Role, DietaryType } from '@/types';
import AuthGuard from '@/components/providers/AuthGuard';
import { Button, Input, Textarea, Select } from '@/components/ui';

const mealSchema = z.object({
  name: z.string().min(2, 'Name is required'),
  description: z.string().min(10, 'Description must be at least 10 characters'),
  price: z.string().refine((val) => !isNaN(Number(val)) && Number(val) > 0, {
    message: 'Price must be a positive number',
  }),
  categoryId: z.string().min(1, 'Category is required'),
  imageUrl: z.string().url('Must be a valid URL').optional().or(z.literal('')),
  ingredients: z.string().optional(),
  dietaryInfo: z.string().optional(),
  prepTime: z.string().optional(),
  isAvailable: z.boolean().optional(),
});

type MealForm = z.infer<typeof mealSchema>;

export default function AddMealPage() {
  const router = useRouter();
  const [categories, setCategories] = useState<Category[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<MealForm>({
    resolver: zodResolver(mealSchema),
    defaultValues: {
      isAvailable: true,
      dietaryInfo: 'NONE',
      prepTime: '30',
    },
  });

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await categoriesApi.getAll();
        setCategories(response.data.data);
      } catch (error) {
        console.error('Failed to fetch categories:', error);
      }
    };
    fetchCategories();
  }, []);

  const onSubmit = async (data: MealForm) => {
    setIsSubmitting(true);
    try {
      await providerApi.createMeal({
        ...data,
        price: Number(data.price),
        prepTime: Number(data.prepTime) || 30,
        imageUrl: data.imageUrl || undefined,
        dietaryInfo: data.dietaryInfo as DietaryType,
      });
      toast.success('Meal added successfully!');
      router.push('/provider/menu');
    } catch (error: any) {
      toast.error(error.response?.data?.error || 'Failed to add meal');
    } finally {
      setIsSubmitting(false);
    }
  };

  const categoryOptions = [
    { value: '', label: 'Select a category' },
    ...categories.map((cat) => ({ value: cat.id, label: cat.name })),
  ];

  const dietaryOptions = [
    { value: 'NONE', label: 'None' },
    { value: DietaryType.VEGETARIAN, label: 'Vegetarian' },
    { value: DietaryType.VEGAN, label: 'Vegan' },
    { value: DietaryType.GLUTEN_FREE, label: 'Gluten-Free' },
    { value: DietaryType.DAIRY_FREE, label: 'Dairy-Free' },
    { value: DietaryType.NUT_FREE, label: 'Nut-Free' },
    { value: DietaryType.HALAL, label: 'Halal' },
    { value: DietaryType.KOSHER, label: 'Kosher' },
  ];

  return (
    <AuthGuard allowedRoles={[Role.PROVIDER]}>
      <div className="page-container">
        <h1 className="page-title">Add New Meal</h1>

        <div className="max-w-2xl">
          <div className="bg-white rounded-lg shadow-sm p-6">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              <Input
                label="Meal Name"
                placeholder="e.g., Margherita Pizza"
                {...register('name')}
                error={errors.name?.message}
              />

              <Textarea
                label="Description"
                rows={3}
                placeholder="Describe your meal..."
                {...register('description')}
                error={errors.description?.message}
              />

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Input
                  label="Price ($)"
                  type="number"
                  step="0.01"
                  min="0"
                  placeholder="0.00"
                  {...register('price')}
                  error={errors.price?.message}
                />

                <Select
                  label="Category"
                  options={categoryOptions}
                  {...register('categoryId')}
                  error={errors.categoryId?.message}
                />
              </div>

              <Input
                label="Image URL (Optional)"
                type="url"
                placeholder="https://example.com/image.jpg"
                {...register('imageUrl')}
                error={errors.imageUrl?.message}
              />

              <Textarea
                label="Ingredients (Optional)"
                rows={2}
                placeholder="List main ingredients..."
                {...register('ingredients')}
              />

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Select
                  label="Dietary Information"
                  options={dietaryOptions}
                  {...register('dietaryInfo')}
                />

                <Input
                  label="Preparation Time (minutes)"
                  type="number"
                  min="1"
                  placeholder="30"
                  {...register('prepTime')}
                />
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="isAvailable"
                  {...register('isAvailable')}
                  className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                />
                <label htmlFor="isAvailable" className="text-sm text-gray-700">
                  Available for ordering
                </label>
              </div>

              <div className="flex gap-3 pt-4">
                <Button
                  type="submit"
                  variant="primary"
                  isLoading={isSubmitting}
                >
                  Add Meal
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
