// 'use client';

// import { useState, Fragment, useEffect } from 'react';
// import Link from 'next/link';
// import { usePathname } from 'next/navigation';
// import { Menu, Transition } from '@headlessui/react';
// import {
//   Bars3Icon,
//   XMarkIcon,
//   ShoppingCartIcon,
//   UserCircleIcon,
//   ChevronDownIcon,
// } from '@heroicons/react/24/outline';
// import { useAuthStore } from '@/lib/store';
// import { useCartStore } from '@/lib/store';
// import { Role } from '@/types';

// export default function Navbar() {
//   const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
//   const [isClient, setIsClient] = useState(false);
//   const pathname = usePathname();
//   const { user, isAuthenticated, logout } = useAuthStore();
//   const itemCount = useCartStore((state) => state.getItemCount());

//   // Fix hydration error by only rendering client-side data after mount
//   useEffect(() => {
//     setIsClient(true);
//   }, []);

//   const publicLinks = [
//     { href: '/', label: 'Home' },
//     { href: '/meals', label: 'Meals' },
//     { href: '/providers', label: 'Restaurants' },
//   ];

//   const getProfileLinks = () => {
//     if (!user) return [];

//     switch (user.role) {
//       case Role.CUSTOMER:
//         return [
//           { href: '/orders', label: 'My Orders' },
//           { href: '/profile', label: 'Profile' },
//         ];
//       case Role.PROVIDER:
//         return [
//           { href: '/provider/dashboard', label: 'Dashboard' },
//           { href: '/provider/menu', label: 'Menu' },
//           { href: '/provider/orders', label: 'Orders' },
//           { href: '/provider/profile', label: 'Profile' },
//         ];
//       case Role.ADMIN:
//         return [
//           { href: '/admin', label: 'Dashboard' },
//           { href: '/admin/users', label: 'Users' },
//           { href: '/admin/orders', label: 'Orders' },
//           { href: '/admin/categories', label: 'Categories' },
//         ];
//       default:
//         return [];
//     }
//   };

//   const handleLogout = () => {
//     logout();
//     setMobileMenuOpen(false);
//   };

//   return (
//     <nav className="bg-white shadow-sm sticky top-0 z-40">
//       <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//         <div className="flex justify-between h-16">
//           {/* Logo */}
//           <div className="flex items-center">
//             <Link href="/" className="flex items-center">
//               <span className="text-2xl font-bold text-primary-600">
//                 🍔 FoodHub
//               </span>
//             </Link>
//           </div>

//           {/* Desktop Navigation */}
//           <div className="hidden md:flex items-center space-x-8">
//             {publicLinks.map((link) => (
//               <Link
//                 key={link.href}
//                 href={link.href}
//                 className={`text-sm font-medium transition-colors ${
//                   pathname === link.href
//                     ? 'text-primary-600'
//                     : 'text-gray-700 hover:text-primary-600'
//                 }`}
//               >
//                 {link.label}
//               </Link>
//             ))}
//           </div>

//           {/* Right side */}
//           <div className="hidden md:flex items-center space-x-4">
//             {/* Cart (only for customers or unauthenticated users) */}
//             {isClient && (!isAuthenticated || user?.role === Role.CUSTOMER) && (
//               <Link
//                 href="/cart"
//                 className="relative p-2 text-gray-700 hover:text-primary-600"
//               >
//                 <ShoppingCartIcon className="h-6 w-6" />
//                 {itemCount > 0 && (
//                   <span className="absolute -top-1 -right-1 bg-primary-600 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
//                     {itemCount}
//                   </span>
//                 )}
//               </Link>
//             )}

//             {isClient && isAuthenticated ? (
//               <Menu as="div" className="relative">
//                 <Menu.Button className="flex items-center gap-2 text-sm font-medium text-gray-700 hover:text-primary-600">
//                   <UserCircleIcon className="h-6 w-6" />
//                   <span>{user?.name}</span>
//                   <ChevronDownIcon className="h-4 w-4" />
//                 </Menu.Button>
//                 <Transition
//                   as={Fragment}
//                   enter="transition ease-out duration-100"
//                   enterFrom="transform opacity-0 scale-95"
//                   enterTo="transform opacity-100 scale-100"
//                   leave="transition ease-in duration-75"
//                   leaveFrom="transform opacity-100 scale-100"
//                   leaveTo="transform opacity-0 scale-95"
//                 >
//                   <Menu.Items className="absolute right-0 mt-2 w-48 origin-top-right bg-white rounded-lg shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none py-1">
//                     {getProfileLinks().map((link) => (
//                       <Menu.Item key={link.href}>
//                         {({ active }) => (
//                           <Link
//                             href={link.href}
//                             className={`block px-4 py-2 text-sm ${
//                               active
//                                 ? 'bg-gray-100 text-primary-600'
//                                 : 'text-gray-700'
//                             }`}
//                           >
//                             {link.label}
//                           </Link>
//                         )}
//                       </Menu.Item>
//                     ))}
//                     <Menu.Item>
//                       {({ active }) => (
//                         <button
//                           onClick={handleLogout}
//                           className={`block w-full text-left px-4 py-2 text-sm ${
//                             active ? 'bg-gray-100 text-red-600' : 'text-red-600'
//                           }`}
//                         >
//                           Logout
//                         </button>
//                       )}
//                     </Menu.Item>
//                   </Menu.Items>
//                 </Transition>
//               </Menu>
//             ) : (
//               isClient && (
//                 <div className="flex items-center space-x-4">
//                   <Link
//                     href="/login"
//                     className="text-sm font-medium text-gray-700 hover:text-primary-600"
//                   >
//                     Login
//                   </Link>
//                   <Link
//                     href="/register"
//                     className="bg-primary-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-primary-700 transition-colors"
//                   >
//                     Sign Up
//                   </Link>
//                 </div>
//               )
//             )}
//           </div>

//           {/* Mobile menu button */}
//           <div className="md:hidden flex items-center">
//             {isClient && (!isAuthenticated || user?.role === Role.CUSTOMER) && (
//               <Link href="/cart" className="relative p-2 mr-2 text-gray-700">
//                 <ShoppingCartIcon className="h-6 w-6" />
//                 {itemCount > 0 && (
//                   <span className="absolute -top-1 -right-1 bg-primary-600 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
//                     {itemCount}
//                   </span>
//                 )}
//               </Link>
//             )}
//             <button
//               onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
//               className="p-2 text-gray-700"
//             >
//               {mobileMenuOpen ? (
//                 <XMarkIcon className="h-6 w-6" />
//               ) : (
//                 <Bars3Icon className="h-6 w-6" />
//               )}
//             </button>
//           </div>
//         </div>
//       </div>

//       {/* Mobile menu */}
//       {mobileMenuOpen && (
//         <div className="md:hidden bg-white border-t">
//           <div className="px-4 py-2 space-y-1">
//             {publicLinks.map((link) => (
//               <Link
//                 key={link.href}
//                 href={link.href}
//                 onClick={() => setMobileMenuOpen(false)}
//                 className={`block px-3 py-2 rounded-lg text-base font-medium ${
//                   pathname === link.href
//                     ? 'bg-primary-50 text-primary-600'
//                     : 'text-gray-700 hover:bg-gray-50'
//                 }`}
//               >
//                 {link.label}
//               </Link>
//             ))}

//             {isClient && isAuthenticated ? (
//               <>
//                 <div className="border-t my-2" />
//                 {getProfileLinks().map((link) => (
//                   <Link
//                     key={link.href}
//                     href={link.href}
//                     onClick={() => setMobileMenuOpen(false)}
//                     className="block px-3 py-2 rounded-lg text-base font-medium text-gray-700 hover:bg-gray-50"
//                   >
//                     {link.label}
//                   </Link>
//                 ))}
//                 <button
//                   onClick={handleLogout}
//                   className="block w-full text-left px-3 py-2 rounded-lg text-base font-medium text-red-600 hover:bg-red-50"
//                 >
//                   Logout
//                 </button>
//               </>
//             ) : (
//               isClient && (
//                 <>
//                   <div className="border-t my-2" />
//                   <Link
//                     href="/login"
//                     onClick={() => setMobileMenuOpen(false)}
//                     className="block px-3 py-2 rounded-lg text-base font-medium text-gray-700 hover:bg-gray-50"
//                   >
//                     Login
//                   </Link>
//                   <Link
//                     href="/register"
//                     onClick={() => setMobileMenuOpen(false)}
//                     className="block px-3 py-2 rounded-lg text-base font-medium bg-primary-600 text-white hover:bg-primary-700 text-center"
//                   >
//                     Sign Up
//                   </Link>
//                 </>
//               )
//             )}
//           </div>
//         </div>
//       )}
//     </nav>
//   );
// }

'use client';

import { useState, Fragment, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { Menu, Transition } from '@headlessui/react';
import {
  Bars3Icon,
  XMarkIcon,
  ShoppingCartIcon,
  UserCircleIcon,
  ChevronDownIcon,
} from '@heroicons/react/24/outline';
import { useAuthStore } from '@/lib/store';
import { useCartStore } from '@/lib/store';
import { Role } from '@/types';

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isClient, setIsClient] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  const { user, isAuthenticated, logout } = useAuthStore();
  const itemCount = useCartStore((state) => state.getItemCount());

  // Fix hydration error by only rendering client-side data after mount
  useEffect(() => {
    setIsClient(true);
  }, []);

  const publicLinks = [
    { href: '/', label: 'Home' },
    { href: '/meals', label: 'Meals' },
    { href: '/providers', label: 'Restaurants' },
  ];

  const getProfileLinks = () => {
    if (!user) return [];

    switch (user.role) {
      case Role.CUSTOMER:
        return [
          { href: '/orders', label: 'My Orders' },
          { href: '/profile', label: 'Profile' },
        ];
      case Role.PROVIDER:
        return [
          { href: '/provider/dashboard', label: 'Dashboard' },
          { href: '/provider/menu', label: 'Menu' },
          { href: '/provider/orders', label: 'Orders' },
          { href: '/provider/profile', label: 'Profile' },
        ];
      case Role.ADMIN:
        return [
          { href: '/admin', label: 'Dashboard' },
          { href: '/admin/users', label: 'Users' },
          { href: '/admin/orders', label: 'Orders' },
          { href: '/admin/categories', label: 'Categories' },
        ];
      default:
        return [];
    }
  };

  const handleLogout = () => {
    logout();
    setMobileMenuOpen(false);
    // Redirect to home page after logout
    router.push('/');
  };

  return (
    <nav className="bg-white shadow-sm sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Logo */}
          <div className="flex items-center">
            <Link href="/" className="flex items-center">
              <span className="text-2xl font-bold text-primary-600">
                🍔 FoodHub
              </span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {publicLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`text-sm font-medium transition-colors ${
                  pathname === link.href
                    ? 'text-primary-600'
                    : 'text-gray-700 hover:text-primary-600'
                }`}
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Right side */}
          <div className="hidden md:flex items-center space-x-4">
            {/* Cart (only for customers or unauthenticated users) */}
            {isClient && (!isAuthenticated || user?.role === Role.CUSTOMER) && (
              <Link
                href="/cart"
                className="relative p-2 text-gray-700 hover:text-primary-600"
              >
                <ShoppingCartIcon className="h-6 w-6" />
                {itemCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-primary-600 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                    {itemCount}
                  </span>
                )}
              </Link>
            )}

            {isClient && isAuthenticated ? (
              <Menu as="div" className="relative">
                <Menu.Button className="flex items-center gap-2 text-sm font-medium text-gray-700 hover:text-primary-600">
                  <UserCircleIcon className="h-6 w-6" />
                  <span>{user?.name}</span>
                  <ChevronDownIcon className="h-4 w-4" />
                </Menu.Button>
                <Transition
                  as={Fragment}
                  enter="transition ease-out duration-100"
                  enterFrom="transform opacity-0 scale-95"
                  enterTo="transform opacity-100 scale-100"
                  leave="transition ease-in duration-75"
                  leaveFrom="transform opacity-100 scale-100"
                  leaveTo="transform opacity-0 scale-95"
                >
                  <Menu.Items className="absolute right-0 mt-2 w-48 origin-top-right bg-white rounded-lg shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none py-1">
                    {getProfileLinks().map((link) => (
                      <Menu.Item key={link.href}>
                        {({ active }) => (
                          <Link
                            href={link.href}
                            className={`block px-4 py-2 text-sm ${
                              active
                                ? 'bg-gray-100 text-primary-600'
                                : 'text-gray-700'
                            }`}
                          >
                            {link.label}
                          </Link>
                        )}
                      </Menu.Item>
                    ))}
                    <Menu.Item>
                      {({ active }) => (
                        <button
                          onClick={handleLogout}
                          className={`block w-full text-left px-4 py-2 text-sm ${
                            active ? 'bg-gray-100 text-red-600' : 'text-red-600'
                          }`}
                        >
                          Logout
                        </button>
                      )}
                    </Menu.Item>
                  </Menu.Items>
                </Transition>
              </Menu>
            ) : (
              isClient && (
                <div className="flex items-center space-x-4">
                  <Link
                    href="/login"
                    className="text-sm font-medium text-gray-700 hover:text-primary-600"
                  >
                    Login
                  </Link>
                  <Link
                    href="/register"
                    className="bg-primary-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-primary-700 transition-colors"
                  >
                    Sign Up
                  </Link>
                </div>
              )
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            {isClient && (!isAuthenticated || user?.role === Role.CUSTOMER) && (
              <Link href="/cart" className="relative p-2 mr-2 text-gray-700">
                <ShoppingCartIcon className="h-6 w-6" />
                {itemCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-primary-600 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                    {itemCount}
                  </span>
                )}
              </Link>
            )}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-gray-700"
            >
              {mobileMenuOpen ? (
                <XMarkIcon className="h-6 w-6" />
              ) : (
                <Bars3Icon className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white border-t">
          <div className="px-4 py-2 space-y-1">
            {publicLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className={`block px-3 py-2 rounded-lg text-base font-medium ${
                  pathname === link.href
                    ? 'bg-primary-50 text-primary-600'
                    : 'text-gray-700 hover:bg-gray-50'
                }`}
              >
                {link.label}
              </Link>
            ))}

            {isClient && isAuthenticated ? (
              <>
                <div className="border-t my-2" />
                {getProfileLinks().map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className="block px-3 py-2 rounded-lg text-base font-medium text-gray-700 hover:bg-gray-50"
                  >
                    {link.label}
                  </Link>
                ))}
                <button
                  onClick={handleLogout}
                  className="block w-full text-left px-3 py-2 rounded-lg text-base font-medium text-red-600 hover:bg-red-50"
                >
                  Logout
                </button>
              </>
            ) : (
              isClient && (
                <>
                  <div className="border-t my-2" />
                  <Link
                    href="/login"
                    onClick={() => setMobileMenuOpen(false)}
                    className="block px-3 py-2 rounded-lg text-base font-medium text-gray-700 hover:bg-gray-50"
                  >
                    Login
                  </Link>
                  <Link
                    href="/register"
                    onClick={() => setMobileMenuOpen(false)}
                    className="block px-3 py-2 rounded-lg text-base font-medium bg-primary-600 text-white hover:bg-primary-700 text-center"
                  >
                    Sign Up
                  </Link>
                </>
              )
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
