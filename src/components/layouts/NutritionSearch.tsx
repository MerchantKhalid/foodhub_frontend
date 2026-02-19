
import { useState, useRef, useEffect } from 'react';
import { MagnifyingGlassIcon, XMarkIcon } from '@heroicons/react/24/outline';

interface NutritionData {
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  sodium: number;
}

interface FoodResult {
  name: string;
  brand: string | null;
  nutrition: NutritionData;
}

interface ApiResponse {
  success: boolean;
  query?: string;
  totalFound?: number;
  bestMatch?: FoodResult;
  alternatives?: FoodResult[];
  message?: string;
  suggestions?: string[];
}

interface NutritionSearchProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function NutritionSearch({
  isOpen,
  onClose,
}: NutritionSearchProps) {
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<ApiResponse | null>(null);
  const [selectedFood, setSelectedFood] = useState<FoodResult | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen && inputRef.current) {
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [isOpen]);

  const handleSearch = async () => {
    if (!query.trim()) return;
    setLoading(true);
    setResult(null);
    setSelectedFood(null);
    try {
      const apiUrl =
        process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';
      const url = `${apiUrl}/nutrition?query=${encodeURIComponent(query)}`;
      const response = await fetch(url);
      const data: ApiResponse = await response.json();
      setResult(data);
      if (data.success && data.bestMatch) {
        setSelectedFood(data.bestMatch);
      }
    } catch (error) {
      setResult({
        success: false,
        message:
          'Could not connect to the nutrition service. Make sure your backend is running.',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') handleSearch();
  };

  const handleClose = () => {
    setQuery('');
    setResult(null);
    setSelectedFood(null);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50" onClick={handleClose}>
      <div className="absolute inset-0 bg-black/40 dark:bg-black/60" />
      <div
        className="absolute left-0 right-0 top-0 bg-white dark:bg-gray-900 shadow-2xl transition-colors duration-300"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <span className="text-2xl">🥗</span>
              <div>
                <h2 className="text-lg font-bold text-gray-900 dark:text-gray-100">
                  Nutrition Lookup
                </h2>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Powered by USDA FoodData Central — search any meal
                </p>
              </div>
            </div>
            <button
              onClick={handleClose}
              className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 transition-colors"
            >
              <XMarkIcon className="h-5 w-5" />
            </button>
          </div>

          {/* Search input */}
          <div className="flex gap-2">
            <div className="relative flex-1">
              <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 dark:text-gray-500" />
              <input
                ref={inputRef}
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder='Try "chicken burger", "margherita pizza", "caesar salad"...'
                className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent text-sm bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500"
              />
            </div>
            <button
              onClick={handleSearch}
              disabled={loading || !query.trim()}
              className="px-6 py-3 bg-primary-600 text-white rounded-xl font-medium hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-sm whitespace-nowrap"
            >
              {loading ? (
                <span className="flex items-center gap-2">
                  <svg
                    className="animate-spin h-4 w-4"
                    viewBox="0 0 24 24"
                    fill="none"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                    />
                  </svg>
                  Searching...
                </span>
              ) : (
                'Search'
              )}
            </button>
          </div>

          {/* Quick suggestions */}
          <div className="flex flex-wrap gap-2 mt-3">
            <span className="text-xs text-gray-500 dark:text-gray-400 self-center">
              Quick search:
            </span>
            {[
              'Chicken Burger',
              'Margherita Pizza',
              'Caesar Salad',
              'French Fries',
              'Grilled Salmon',
            ].map((suggestion) => (
              <button
                key={suggestion}
                onClick={() => setQuery(suggestion)}
                className="text-xs px-3 py-1 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-full text-gray-700 dark:text-gray-300 transition-colors"
              >
                {suggestion}
              </button>
            ))}
          </div>
        </div>

        {/* Results */}
        {result && (
          <div className="border-t border-gray-100 dark:border-gray-700 max-w-4xl mx-auto px-4 py-4">
            {/* Success */}
            {result.success && selectedFood && (
              <div>
                {result.alternatives && result.alternatives.length > 0 && (
                  <div className="mb-4">
                    <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">
                      Found {result.totalFound}+ results. Click another to
                      compare:
                    </p>
                    <div className="flex flex-wrap gap-2">
                      <button
                        onClick={() => setSelectedFood(result.bestMatch!)}
                        className={`text-xs px-3 py-1.5 rounded-lg border transition-colors ${
                          selectedFood === result.bestMatch
                            ? 'bg-primary-600 text-white border-primary-600'
                            : 'border-gray-200 dark:border-gray-600 hover:border-primary-300 text-gray-700 dark:text-gray-300 dark:hover:border-primary-500'
                        }`}
                      >
                        {result.bestMatch!.name.length > 30
                          ? result.bestMatch!.name.substring(0, 30) + '...'
                          : result.bestMatch!.name}
                      </button>
                      {result.alternatives.map((alt, i) => (
                        <button
                          key={i}
                          onClick={() => setSelectedFood(alt)}
                          className={`text-xs px-3 py-1.5 rounded-lg border transition-colors ${
                            selectedFood === alt
                              ? 'bg-primary-600 text-white border-primary-600'
                              : 'border-gray-200 dark:border-gray-600 hover:border-primary-300 text-gray-700 dark:text-gray-300'
                          }`}
                        >
                          {alt.name.length > 30
                            ? alt.name.substring(0, 30) + '...'
                            : alt.name}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Nutrition card */}
                <div className="bg-gradient-to-br from-primary-50 to-white dark:from-gray-800 dark:to-gray-800/50 border border-primary-100 dark:border-gray-700 rounded-2xl p-5">
                  <div className="mb-4">
                    <h3 className="font-bold text-gray-900 dark:text-gray-100 text-lg leading-tight">
                      {selectedFood.name}
                    </h3>
                    {selectedFood.brand && (
                      <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">
                        by {selectedFood.brand}
                      </p>
                    )}
                    <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
                      Per serving · Data from USDA
                    </p>
                  </div>
                  <div className="grid grid-cols-5 gap-3">
                    <NutrientBox
                      emoji="🔥"
                      label="Calories"
                      value={selectedFood.nutrition.calories}
                      unit="kcal"
                      highlight
                    />
                    <NutrientBox
                      emoji="💪"
                      label="Protein"
                      value={selectedFood.nutrition.protein}
                      unit="g"
                    />
                    <NutrientBox
                      emoji="🍞"
                      label="Carbs"
                      value={selectedFood.nutrition.carbs}
                      unit="g"
                    />
                    <NutrientBox
                      emoji="🥑"
                      label="Fat"
                      value={selectedFood.nutrition.fat}
                      unit="g"
                    />
                    <NutrientBox
                      emoji="🧂"
                      label="Sodium"
                      value={selectedFood.nutrition.sodium}
                      unit="mg"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Error */}
            {!result.success && (
              <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-700 rounded-xl p-4">
                <div className="flex items-start gap-3">
                  <span className="text-2xl">🤔</span>
                  <div>
                    <p className="text-sm font-medium text-amber-900 dark:text-amber-200">
                      {result.message}
                    </p>
                    {result.suggestions && (
                      <ul className="mt-2 space-y-1">
                        {result.suggestions.map((s, i) => (
                          <li
                            key={i}
                            className="text-xs text-amber-700 dark:text-amber-300 flex items-center gap-1"
                          >
                            <span>→</span> {s}
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
        <div className="h-4" />
      </div>
    </div>
  );
}

interface NutrientBoxProps {
  emoji: string;
  label: string;
  value: number;
  unit: string;
  highlight?: boolean;
}

function NutrientBox({
  emoji,
  label,
  value,
  unit,
  highlight = false,
}: NutrientBoxProps) {
  return (
    <div
      className={`rounded-xl p-3 text-center ${
        highlight
          ? 'bg-orange-100 dark:bg-orange-900/30 border border-orange-200 dark:border-orange-700'
          : 'bg-white dark:bg-gray-700 border border-gray-100 dark:border-gray-600 shadow-sm'
      }`}
    >
      <div className="text-xl mb-1">{emoji}</div>
      <div
        className={`text-xl font-bold ${highlight ? 'text-orange-600 dark:text-orange-400' : 'text-gray-900 dark:text-gray-100'}`}
      >
        {value}
      </div>
      <div className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
        {unit}
      </div>
      <div className="text-xs font-medium text-gray-600 dark:text-gray-300">
        {label}
      </div>
    </div>
  );
}
