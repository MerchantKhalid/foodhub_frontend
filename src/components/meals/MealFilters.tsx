'use client';

import { useState, useEffect } from 'react';
import {
  MagnifyingGlassIcon,
  FunnelIcon,
  XMarkIcon,
} from '@heroicons/react/24/outline';
import { Category, DietaryType } from '@/types';
import { categoriesApi } from '@/lib/api';
import { Button, Select, Input } from '@/components/ui';

interface MealFiltersProps {
  onFilterChange: (filters: any) => void;
  initialFilters?: any;
}

export default function MealFilters({
  onFilterChange,
  initialFilters = {},
}: MealFiltersProps) {
  const [categories, setCategories] = useState<Category[]>([]);
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    search: initialFilters.search || '',
    categoryId: initialFilters.categoryId || '',
    dietaryInfo: initialFilters.dietaryInfo || '',
    minPrice: initialFilters.minPrice || '',
    maxPrice: initialFilters.maxPrice || '',
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

  const handleChange = (key: string, value: string) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
  };

  const handleApplyFilters = () => {
    onFilterChange(filters);
    setShowFilters(false);
  };

  const handleClearFilters = () => {
    const clearedFilters = {
      search: '',
      categoryId: '',
      dietaryInfo: '',
      minPrice: '',
      maxPrice: '',
    };
    setFilters(clearedFilters);
    onFilterChange(clearedFilters);
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onFilterChange(filters);
  };

  const dietaryOptions = [
    { value: '', label: 'All Dietary Options' },
    { value: DietaryType.VEGETARIAN, label: '🥬 Vegetarian' },
    { value: DietaryType.VEGAN, label: '🌱 Vegan' },
    { value: DietaryType.GLUTEN_FREE, label: '🌾 Gluten-Free' },
    { value: DietaryType.DAIRY_FREE, label: '🥛 Dairy-Free' },
    { value: DietaryType.NUT_FREE, label: '🥜 Nut-Free' },
    { value: DietaryType.HALAL, label: '☪️ Halal' },
    { value: DietaryType.KOSHER, label: '✡️ Kosher' },
  ];

  const categoryOptions = [
    { value: '', label: 'All Categories' },
    ...categories.map((cat) => ({ value: cat.id, label: cat.name })),
  ];

  const hasActiveFilters =
    filters.categoryId ||
    filters.dietaryInfo ||
    filters.minPrice ||
    filters.maxPrice;

  return (
    <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
      {/* Search Bar */}
      <form onSubmit={handleSearchSubmit} className="flex gap-2 mb-4">
        <div className="relative flex-1">
          <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search meals..."
            value={filters.search}
            onChange={(e) => handleChange('search', e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
          />
        </div>
        <Button type="submit" variant="primary">
          Search
        </Button>
        <Button
          type="button"
          variant={showFilters ? 'primary' : 'secondary'}
          onClick={() => setShowFilters(!showFilters)}
        >
          <FunnelIcon className="h-5 w-5" />
        </Button>
      </form>

      {/* Filters Panel */}
      {showFilters && (
        <div className="border-t pt-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <Select
              label="Category"
              options={categoryOptions}
              value={filters.categoryId}
              onChange={(e) => handleChange('categoryId', e.target.value)}
            />
            <Select
              label="Dietary Preference"
              options={dietaryOptions}
              value={filters.dietaryInfo}
              onChange={(e) => handleChange('dietaryInfo', e.target.value)}
            />
            <Input
              label="Min Price ($)"
              type="number"
              min="0"
              step="0.01"
              placeholder="0.00"
              value={filters.minPrice}
              onChange={(e) => handleChange('minPrice', e.target.value)}
            />
            <Input
              label="Max Price ($)"
              type="number"
              min="0"
              step="0.01"
              placeholder="100.00"
              value={filters.maxPrice}
              onChange={(e) => handleChange('maxPrice', e.target.value)}
            />
          </div>

          <div className="flex justify-end gap-2 mt-4">
            {hasActiveFilters && (
              <Button variant="ghost" onClick={handleClearFilters}>
                <XMarkIcon className="h-4 w-4 mr-1" />
                Clear Filters
              </Button>
            )}
            <Button variant="primary" onClick={handleApplyFilters}>
              Apply Filters
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
