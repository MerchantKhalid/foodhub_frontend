// 'use client';

// import { useState, useEffect } from 'react';
// import Link from 'next/link';
// import Image from 'next/image';
// import { ArrowRightIcon } from '@heroicons/react/24/outline';
// import { mealsApi, categoriesApi } from '@/lib/api';
// import { Meal, Category } from '@/types';
// import MealCard from '@/components/meals/MealCard';
// import { Spinner } from '@/components/ui';

// export default function HomePage() {
//   const [featuredMeals, setFeaturedMeals] = useState<Meal[]>([]);
//   const [categories, setCategories] = useState<Category[]>([]);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         const [mealsRes, categoriesRes] = await Promise.all([
//           mealsApi.getAll({ limit: 8, isAvailable: true }),
//           categoriesApi.getAll(),
//         ]);

//         // Handle different possible response structures
//         const mealsData = mealsRes.data?.data || mealsRes.data || [];
//         const categoriesData = categoriesRes.data?.data || categoriesRes.data || [];

//         setFeaturedMeals(Array.isArray(mealsData) ? mealsData : []);
//         setCategories(Array.isArray(categoriesData) ? categoriesData.slice(0, 8) : []);
//       } catch (error) {
//         console.error('Failed to fetch data:', error);
//         // Set empty arrays on error
//         setFeaturedMeals([]);
//         setCategories([]);
//       } finally {
//         setLoading(false);
//       }
//     };
//     fetchData();
//   }, []);

//   return (
//     <div>
//       {/* Hero Section */}
//       <section className="relative bg-gradient-to-r from-primary-600 to-primary-800 text-white">
//         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 lg:py-32">
//           <div className="max-w-2xl">
//             <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6">
//               Delicious Food, Delivered to Your Door
//             </h1>
//             <p className="text-lg sm:text-xl text-primary-100 mb-8">
//               Discover amazing meals from the best local restaurants. Order
//               online and enjoy fresh, hot food delivered right to you.
//             </p>
//             <div className="flex flex-col sm:flex-row gap-4">
//               <Link
//                 href="/meals"
//                 className="inline-flex items-center justify-center px-6 py-3 bg-white text-primary-600 font-semibold rounded-lg hover:bg-gray-100 transition-colors"
//               >
//                 Browse Meals
//                 <ArrowRightIcon className="ml-2 h-5 w-5" />
//               </Link>
//               <Link
//                 href="/register"
//                 className="inline-flex items-center justify-center px-6 py-3 border-2 border-white text-white font-semibold rounded-lg hover:bg-white hover:text-primary-600 transition-colors"
//               >
//                 Become a Partner
//               </Link>
//             </div>
//           </div>
//         </div>
//         <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-gray-50 to-transparent" />
//       </section>

//       {/* Categories Section */}
//       <section className="py-16 bg-gray-50">
//         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//           <div className="flex justify-between items-center mb-8">
//             <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">
//               Browse by Category
//             </h2>
//             <Link
//               href="/meals"
//               className="text-primary-600 hover:text-primary-700 font-medium flex items-center"
//             >
//               View All <ArrowRightIcon className="ml-1 h-4 w-4" />
//             </Link>
//           </div>

//           {loading ? (
//             <Spinner className="py-12" />
//           ) : categories.length === 0 ? (
//             <p className="text-center text-gray-500 py-12">No categories available</p>
//           ) : (
//             <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
//               {categories.map((category) => (
//                 <Link
//                   key={category.id}
//                   href={`/meals?categoryId=${category.id}`}
//                   className="group relative rounded-xl overflow-hidden bg-white shadow-sm hover:shadow-md transition-shadow"
//                 >
//                   <div className="relative h-32 bg-gray-200">
//                     {category.imageUrl ? (
//                       <Image
//                         src={category.imageUrl}
//                         alt={category.name}
//                         fill
//                         className="object-cover group-hover:scale-105 transition-transform duration-300"
//                       />
//                     ) : (
//                       <div className="w-full h-full flex items-center justify-center text-4xl">
//                         🍽️
//                       </div>
//                     )}
//                     <div className="absolute inset-0 bg-black bg-opacity-30 group-hover:bg-opacity-40 transition-colors" />
//                   </div>
//                   <div className="absolute bottom-0 left-0 right-0 p-4">
//                     <h3 className="font-semibold text-white text-lg">
//                       {category.name}
//                     </h3>
//                     {category._count && (
//                       <p className="text-sm text-gray-200">
//                         {category._count.meals} items
//                       </p>
//                     )}
//                   </div>
//                 </Link>
//               ))}
//             </div>
//           )}
//         </div>
//       </section>

//       {/* Featured Meals Section */}
//       <section className="py-16">
//         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//           <div className="flex justify-between items-center mb-8">
//             <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">
//               Popular Meals
//             </h2>
//             <Link
//               href="/meals"
//               className="text-primary-600 hover:text-primary-700 font-medium flex items-center"
//             >
//               View All <ArrowRightIcon className="ml-1 h-4 w-4" />
//             </Link>
//           </div>

//           {loading ? (
//             <Spinner className="py-12" />
//           ) : featuredMeals.length === 0 ? (
//             <p className="text-center text-gray-500 py-12">No meals available</p>
//           ) : (
//             <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
//               {featuredMeals.map((meal) => (
//                 <MealCard key={meal.id} meal={meal} />
//               ))}
//             </div>
//           )}
//         </div>
//       </section>

//       {/* CTA Section */}
//       <section className="py-16 bg-primary-600">
//         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
//           <h2 className="text-3xl font-bold text-white mb-4">
//             Ready to Start Ordering?
//           </h2>
//           <p className="text-primary-100 mb-8 max-w-2xl mx-auto">
//             Join thousands of happy customers who enjoy delicious meals
//             delivered to their doorstep every day.
//           </p>
//           <Link
//             href="/register"
//             className="inline-flex items-center justify-center px-8 py-3 bg-white text-primary-600 font-semibold rounded-lg hover:bg-gray-100 transition-colors"
//           >
//             Get Started
//           </Link>
//         </div>
//       </section>
//     </div>
//   );
// }

// -------------------------

'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowRightIcon } from '@heroicons/react/24/outline';
import { mealsApi, categoriesApi } from '@/lib/api';
import { Meal, Category } from '@/types';
import MealCard from '@/components/meals/MealCard';
import { Spinner } from '@/components/ui';

export default function HomePage() {
  const [featuredMeals, setFeaturedMeals] = useState<Meal[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [mealsRes, categoriesRes] = await Promise.all([
          mealsApi.getAll({ limit: 8, isAvailable: true }),
          categoriesApi.getAll(),
        ]);

        // Extract data from response - handle both response.data and response.data.data
        const mealsData = mealsRes.data?.data || mealsRes.data || [];
        const categoriesData =
          categoriesRes.data?.data || categoriesRes.data || [];

        // Type assertion to ensure correct type
        setFeaturedMeals(Array.isArray(mealsData) ? (mealsData as Meal[]) : []);
        setCategories(
          Array.isArray(categoriesData)
            ? (categoriesData as Category[]).slice(0, 8)
            : [],
        );
      } catch (error) {
        console.error('Failed to fetch data:', error);
        setFeaturedMeals([]);
        setCategories([]);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  return (
    <div>
      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-primary-600 to-primary-800 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 lg:py-32">
          <div className="max-w-2xl">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6">
              Delicious Food, Delivered to Your Door
            </h1>
            <p className="text-lg sm:text-xl text-primary-100 mb-8">
              Discover amazing meals from the best local restaurants. Order
              online and enjoy fresh, hot food delivered right to you.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link
                href="/meals"
                className="inline-flex items-center justify-center px-6 py-3 bg-white text-primary-600 font-semibold rounded-lg hover:bg-gray-100 transition-colors"
              >
                Browse Meals
                <ArrowRightIcon className="ml-2 h-5 w-5" />
              </Link>
              <Link
                href="/register"
                className="inline-flex items-center justify-center px-6 py-3 border-2 border-white text-white font-semibold rounded-lg hover:bg-white hover:text-primary-600 transition-colors"
              >
                Become a Partner
              </Link>
            </div>
          </div>
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-gray-50 to-transparent" />
      </section>

      {/* Categories Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">
              Browse by Category
            </h2>
            <Link
              href="/meals"
              className="text-primary-600 hover:text-primary-700 font-medium flex items-center"
            >
              View All <ArrowRightIcon className="ml-1 h-4 w-4" />
            </Link>
          </div>

          {loading ? (
            <Spinner className="py-12" />
          ) : categories.length === 0 ? (
            <p className="text-center text-gray-500 py-12">
              No categories available
            </p>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
              {categories.map((category) => (
                <Link
                  key={category.id}
                  href={`/meals?categoryId=${category.id}`}
                  className="group relative rounded-xl overflow-hidden bg-white shadow-sm hover:shadow-md transition-shadow"
                >
                  <div className="relative h-32 bg-gray-200">
                    {category.imageUrl ? (
                      <Image
                        src={category.imageUrl}
                        alt={category.name}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-4xl">
                        🍽️
                      </div>
                    )}
                    <div className="absolute inset-0 bg-black bg-opacity-30 group-hover:bg-opacity-40 transition-colors" />
                  </div>
                  <div className="absolute bottom-0 left-0 right-0 p-4">
                    <h3 className="font-semibold text-white text-lg">
                      {category.name}
                    </h3>
                    {category._count && (
                      <p className="text-sm text-gray-200">
                        {category._count.meals} items
                      </p>
                    )}
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Featured Meals Section */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">
              Popular Meals
            </h2>
            <Link
              href="/meals"
              className="text-primary-600 hover:text-primary-700 font-medium flex items-center"
            >
              View All <ArrowRightIcon className="ml-1 h-4 w-4" />
            </Link>
          </div>

          {loading ? (
            <Spinner className="py-12" />
          ) : featuredMeals.length === 0 ? (
            <p className="text-center text-gray-500 py-12">
              No meals available
            </p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {featuredMeals.map((meal) => (
                <MealCard key={meal.id} meal={meal} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-primary-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">
            Ready to Start Ordering?
          </h2>
          <p className="text-primary-100 mb-8 max-w-2xl mx-auto">
            Join thousands of happy customers who enjoy delicious meals
            delivered to their doorstep every day.
          </p>
          <Link
            href="/register"
            className="inline-flex items-center justify-center px-8 py-3 bg-white text-primary-600 font-semibold rounded-lg hover:bg-gray-100 transition-colors"
          >
            Get Started
          </Link>
        </div>
      </section>
    </div>
  );
}
