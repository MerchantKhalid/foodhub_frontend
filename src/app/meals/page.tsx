'use client';

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { mealsApi } from '@/lib/api';
import { Meal } from '@/types';
import MealCard from '@/components/meals/MealCard';
import MealFilters from '@/components/meals/MealFilters';
import { Spinner, Pagination, EmptyState } from '@/components/ui';

export default function MealsPage() {
  const searchParams = useSearchParams();
  const [meals, setMeals] = useState<Meal[]>([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 12,
    total: 0,
    totalPages: 0,
  });

  const [filters, setFilters] = useState({
    search: searchParams.get('search') || '',
    categoryId: searchParams.get('categoryId') || '',
    dietaryInfo: searchParams.get('dietaryInfo') || '',
    minPrice: searchParams.get('minPrice') || '',
    maxPrice: searchParams.get('maxPrice') || '',
  });

  const fetchMeals = async (page = 1) => {
    setLoading(true);
    try {
      const params: any = {
        page,
        limit: pagination.limit,
        isAvailable: true,
      };

      if (filters.search) params.search = filters.search;
      if (filters.categoryId) params.categoryId = filters.categoryId;
      if (filters.dietaryInfo) params.dietaryInfo = filters.dietaryInfo;
      if (filters.minPrice) params.minPrice = Number(filters.minPrice);
      if (filters.maxPrice) params.maxPrice = Number(filters.maxPrice);

      const response = await mealsApi.getAll(params);
      setMeals(response.data.data);
      setPagination(response.data.pagination);
    } catch (error) {
      console.error('Failed to fetch meals:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMeals();
  }, []);

  const handleFilterChange = (newFilters: any) => {
    setFilters(newFilters);
    // Trigger fetch with new filters
    setTimeout(() => {
      fetchMeals(1);
    }, 0);
  };

  const handlePageChange = (page: number) => {
    fetchMeals(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="page-container">
      <h1 className="page-title">Browse Meals</h1>

      <MealFilters
        onFilterChange={handleFilterChange}
        initialFilters={filters}
      />

      {loading ? (
        <Spinner className="py-12" />
      ) : meals.length === 0 ? (
        <EmptyState
          title="No meals found"
          description="Try adjusting your filters or search term"
        />
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {meals.map((meal) => (
              <MealCard key={meal.id} meal={meal} />
            ))}
          </div>

          {pagination.totalPages > 1 && (
            <div className="mt-8">
              <Pagination
                currentPage={pagination.page}
                totalPages={pagination.totalPages}
                onPageChange={handlePageChange}
              />
            </div>
          )}
        </>
      )}
    </div>
  );
}
