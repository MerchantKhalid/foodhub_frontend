'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import toast from 'react-hot-toast';
import { providerApi, categoriesApi, mealsApi } from '@/lib/api';
import { Category, Meal, Role, DietaryType } from '@/types';
import AuthGuard from '@/components/providers/AuthGuard';
import { Button, Input, Textarea, Select, Spinner } from '@/components/ui';

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

export default function EditMealPage() {
  const router = useRouter();
  const { id } = useParams();
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<MealForm>({
    resolver: zodResolver(mealSchema),
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [mealRes, categoriesRes] = await Promise.all([
          mealsApi.getById(id as string),
          categoriesApi.getAll(),
        ]);

        const meal = mealRes.data.data;
        setCategories(categoriesRes.data.data);

        reset({
          name: meal.name,
          description: meal.description,
          price: meal.price.toString(),
          categoryId: meal.categoryId,
          imageUrl: meal.imageUrl || '',
          ingredients: meal.ingredients || '',
          dietaryInfo: meal.dietaryInfo || 'NONE',
          prepTime: meal.prepTime?.toString() || '30',
          isAvailable: meal.isAvailable,
        });
      } catch (error) {
        console.error('Failed to fetch meal:', error);
        toast.error('Failed to load meal');
        router.push('/provider/menu');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id, reset, router]);

  const onSubmit = async (data: MealForm) => {
    setIsSubmitting(true);
    try {
      await providerApi.updateMeal(id as string, {
        ...data,
        price: Number(data.price),
        prepTime: Number(data.prepTime) || 30,
        imageUrl: data.imageUrl || undefined,
      });
      toast.success('Meal updated successfully!');
      router.push('/provider/menu');
    } catch (error: any) {
      toast.error(error.response?.data?.error || 'Failed to update meal');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return <Spinner className="min-h-screen" />;
  }

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
        <h1 className="page-title">Edit Meal</h1>

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
                  Update Meal
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
