// 'use client';

// import { useState, useEffect } from 'react';
// import { useParams, useRouter } from 'next/navigation';
// import Image from 'next/image';
// import Link from 'next/link';
// import { format } from 'date-fns';
// import toast from 'react-hot-toast';
// import { ordersApi } from '@/lib/api';
// import { Order, OrderStatus, Role } from '@/types';
// import AuthGuard from '@/components/providers/AuthGuard';
// import OrderStatusBadge from '@/components/orders/OrderStatusBadge';
// import OrderStatusTracker from '@/components/orders/OrderStatusTracker';
// import { Button, Spinner } from '@/components/ui';
// import { MapPinIcon, PhoneIcon } from '@heroicons/react/24/outline';

// export default function OrderDetailPage() {
//   const { id } = useParams();
//   const router = useRouter();
//   const [order, setOrder] = useState<Order | null>(null);
//   const [loading, setLoading] = useState(true);
//   const [cancelling, setCancelling] = useState(false);

//   const fetchOrder = async () => {
//     try {
//       const response = await ordersApi.getById(id as string);
//       setOrder(response.data.data);
//     } catch (error) {
//       console.error('Failed to fetch order:', error);
//       toast.error('Failed to load order');
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchOrder();
//   }, [id]);

//   const handleCancelOrder = async () => {
//     if (!confirm('Are you sure you want to cancel this order?')) return;

//     setCancelling(true);
//     try {
//       await ordersApi.cancel(id as string);
//       toast.success('Order cancelled');
//       fetchOrder();
//     } catch (error: any) {
//       toast.error(error.response?.data?.error || 'Failed to cancel order');
//     } finally {
//       setCancelling(false);
//     }
//   };

//   if (loading) {
//     return <Spinner className="min-h-screen" />;
//   }

//   if (!order) {
//     return (
//       <div className="page-container text-center py-12">
//         <h1 className="text-2xl font-bold text-gray-900">Order not found</h1>
//         <Link
//           href="/orders"
//           className="text-primary-600 hover:underline mt-4 inline-block"
//         >
//           View all orders
//         </Link>
//       </div>
//     );
//   }

//   const canReview = order.status === OrderStatus.DELIVERED;
//   const canCancel = order.status === OrderStatus.PENDING;

//   return (
//     <AuthGuard allowedRoles={[Role.CUSTOMER]}>
//       <div className="page-container">
//         <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
//           <div>
//             <h1 className="text-2xl font-bold text-gray-900">
//               Order #{order.id.slice(0, 8).toUpperCase()}
//             </h1>
//             <p className="text-gray-500">
//               Placed on{' '}
//               {format(new Date(order.createdAt), 'MMMM d, yyyy • h:mm a')}
//             </p>
//           </div>
//           <OrderStatusBadge status={order.status} />
//         </div>

//         {/* Status Tracker */}
//         <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
//           <OrderStatusTracker currentStatus={order.status} />
//         </div>

//         <div className="grid lg:grid-cols-3 gap-6">
//           {/* Order Items */}
//           <div className="lg:col-span-2">
//             <div className="bg-white rounded-lg shadow-sm p-6">
//               <h2 className="text-lg font-semibold text-gray-900 mb-4">
//                 Order Items
//               </h2>

//               <div className="divide-y">
//                 {order.orderItems?.map((item) => (
//                   <div key={item.id} className="py-4 flex gap-4">
//                     <div className="relative w-20 h-20 rounded-lg overflow-hidden bg-gray-200 flex-shrink-0">
//                       {item.meal?.imageUrl ? (
//                         <Image
//                           src={item.meal.imageUrl}
//                           alt={item.meal.name}
//                           fill
//                           className="object-cover"
//                         />
//                       ) : (
//                         <div className="w-full h-full flex items-center justify-center text-xl">
//                           🍽️
//                         </div>
//                       )}
//                     </div>

//                     <div className="flex-1">
//                       <h3 className="font-medium text-gray-900">
//                         {item.meal?.name}
//                       </h3>
//                       <p className="text-sm text-gray-500">
//                         ${item.priceAtOrder.toFixed(2)} × {item.quantity}
//                       </p>
//                     </div>

//                     <div className="text-right">
//                       <p className="font-semibold">
//                         ${(item.priceAtOrder * item.quantity).toFixed(2)}
//                       </p>

//                       {canReview &&
//                         !order.reviews?.some(
//                           (r) => r.mealId === item.mealId,
//                         ) && (
//                           <Link
//                             href={`/reviews/new?orderId=${order.id}&mealId=${item.mealId}`}
//                             className="text-sm text-primary-600 hover:underline"
//                           >
//                             Leave Review
//                           </Link>
//                         )}
//                     </div>
//                   </div>
//                 ))}
//               </div>

//               <div className="border-t mt-4 pt-4">
//                 <div className="flex justify-between text-lg font-semibold">
//                   <span>Total</span>
//                   <span className="text-primary-600">
//                     ${order.totalAmount.toFixed(2)}
//                   </span>
//                 </div>
//                 <p className="text-sm text-gray-500 mt-1">Cash on Delivery</p>
//               </div>
//             </div>
//           </div>

//           {/* Delivery Info */}
//           <div className="space-y-6">
//             {/* Restaurant */}
//             <div className="bg-white rounded-lg shadow-sm p-6">
//               <h2 className="text-lg font-semibold text-gray-900 mb-4">
//                 Restaurant
//               </h2>
//               <Link
//                 href={`/providers/${order.providerId}`}
//                 className="text-primary-600 hover:underline font-medium"
//               >
//                 {order.provider?.providerProfile?.restaurantName}
//               </Link>
//             </div>

//             {/* Delivery Details */}
//             <div className="bg-white rounded-lg shadow-sm p-6">
//               <h2 className="text-lg font-semibold text-gray-900 mb-4">
//                 Delivery Details
//               </h2>

//               <div className="space-y-3">
//                 <div className="flex items-start gap-3">
//                   <MapPinIcon className="h-5 w-5 text-gray-400 mt-0.5" />
//                   <p className="text-gray-600">{order.deliveryAddress}</p>
//                 </div>
//                 <div className="flex items-center gap-3">
//                   <PhoneIcon className="h-5 w-5 text-gray-400" />
//                   <p className="text-gray-600">{order.contactPhone}</p>
//                 </div>
//                 {order.orderNotes && (
//                   <div className="pt-3 border-t">
//                     <p className="text-sm text-gray-500">Notes:</p>
//                     <p className="text-gray-600">{order.orderNotes}</p>
//                   </div>
//                 )}
//               </div>
//             </div>

//             {/* Actions */}
//             {canCancel && (
//               <Button
//                 variant="danger"
//                 className="w-full"
//                 onClick={handleCancelOrder}
//                 isLoading={cancelling}
//               >
//                 Cancel Order
//               </Button>
//             )}
//           </div>
//         </div>
//       </div>
//     </AuthGuard>
//   );
// }



// ----------------------------

// 'use client';

// import { useEffect, useState } from 'react';
// import { useParams, useRouter, useSearchParams } from 'next/navigation';
// import Image from 'next/image';
// import Link from 'next/link';
// import api from '@/lib/api';
// import { OrderStatusTracker } from '@/components/orders/OrderStatusTracker';
// import OrderStatusBadge from '@/components/orders/OrderStatusBadge';
// import { Button, Spinner } from '@/components/ui';
// import { useAuthStore } from '@/lib/store';
// import { OrderStatus } from '@/types';
// import {
//   MapPinIcon,
//   PhoneIcon,
//   ClockIcon,
//   CreditCardIcon,
//   ChevronLeftIcon,
//   CheckCircleIcon,
// } from '@heroicons/react/24/outline';

// interface Order {
//   id: string;
//   status: OrderStatus;
//   totalAmount: number;
//   deliveryAddress: string;
//   contactPhone: string;
//   orderNotes?: string;
//   paymentMethod: string;
//   paymentStatus: string;
//   estimatedDeliveryTime?: string;
//   actualDeliveryTime?: string;
//   createdAt: string;
//   provider: {
//     id: string;
//     name: string;
//     phone: string;
//     providerProfile: {
//       restaurantName: string;
//       address: string;
//     };
//   };
//   customer: {
//     name: string;
//     phone: string;
//   };
//   orderItems: Array<{
//     id: string;
//     quantity: number;
//     priceAtOrder: number;
//     meal: {
//       id: string;
//       name: string;
//       description: string;
//       imageUrl?: string;
//     };
//   }>;
//   statusHistory: Array<{
//     id: string;
//     status: OrderStatus;
//     note?: string;
//     createdAt: string;
//   }>;
// }

// export default function OrderDetailPage() {
//   const params = useParams();
//   const router = useRouter();
//   const searchParams = useSearchParams();
//   const { user } = useAuthStore();

//   const orderId = params.id as string;
//   const isNewOrder = searchParams.get('new') === 'true';

//   const [order, setOrder] = useState<Order | null>(null);
//   const [isLoading, setIsLoading] = useState(true);
//   const [error, setError] = useState('');
//   const [showSuccess, setShowSuccess] = useState(isNewOrder);

//   // Fetch order details
//   useEffect(() => {
//     const fetchOrder = async () => {
//       try {
//         setIsLoading(true);
//         const response = await api.get(`/orders/${orderId}`);

//         if (response.data.success) {
//           setOrder(response.data.data);
//         }
//       } catch (err: any) {
//         console.error('Error fetching order:', err);
//         setError(err.response?.data?.message || 'Failed to load order details');
//       } finally {
//         setIsLoading(false);
//       }
//     };

//     if (orderId) {
//       fetchOrder();

//       // Auto-refresh every 30 seconds if order is not delivered or cancelled
//       const interval = setInterval(() => {
//         if (
//           order &&
//           order.status !== 'DELIVERED' &&
//           order.status !== 'CANCELLED'
//         ) {
//           fetchOrder();
//         }
//       }, 30000);

//       return () => clearInterval(interval);
//     }
//   }, [orderId, order]);

//   // Hide success message after 5 seconds
//   useEffect(() => {
//     if (showSuccess) {
//       const timeout = setTimeout(() => setShowSuccess(false), 5000);
//       return () => clearTimeout(timeout);
//     }
//   }, [showSuccess]);

//   const handleCancelOrder = async () => {
//     if (!confirm('Are you sure you want to cancel this order?')) return;

//     try {
//       const response = await api.patch(`/orders/${orderId}/cancel`, {
//         reason: 'Cancelled by customer',
//       });

//       if (response.data.success) {
//         setOrder(response.data.data);
//         alert('Order cancelled successfully');
//       }
//     } catch (err: any) {
//       alert(err.response?.data?.message || 'Failed to cancel order');
//     }
//   };

//   const canCancelOrder =
//     order?.status === 'PENDING' || order?.status === 'CONFIRMED';

//   if (isLoading) {
//     return (
//       <div className="min-h-screen bg-gray-50 flex items-center justify-center">
//         <div className="text-center">
//           <Spinner size="lg" />
//           <p className="text-gray-600 mt-4">Loading order details...</p>
//         </div>
//       </div>
//     );
//   }

//   if (error || !order) {
//     return (
//       <div className="min-h-screen bg-gray-50 flex items-center justify-center">
//         <div className="text-center">
//           <p className="text-red-600 mb-4">{error || 'Order not found'}</p>
//           <Button onClick={() => router.push('/orders')}>
//             View All Orders
//           </Button>
//         </div>
//       </div>
//     );
//   }

//   const formattedEstimatedTime = order.estimatedDeliveryTime
//     ? new Date(order.estimatedDeliveryTime).toLocaleTimeString([], {
//         hour: '2-digit',
//         minute: '2-digit',
//       })
//     : null;

//   return (
//     <div className="min-h-screen bg-gray-50 py-8">
//       <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//         {/* Success Message */}
//         {showSuccess && (
//           <div className="mb-6 bg-green-50 border border-green-200 rounded-lg p-4 flex items-start gap-3">
//             <CheckCircleIcon className="h-6 w-6 text-green-600 flex-shrink-0 mt-0.5" />
//             <div className="flex-1">
//               <h3 className="text-green-900 font-semibold">
//                 Order Placed Successfully!
//               </h3>
//               <p className="text-green-700 text-sm mt-1">
//                 Your order has been sent to the restaurant. They will confirm it
//                 shortly.
//               </p>
//             </div>
//           </div>
//         )}

//         {/* Header */}
//         <div className="mb-6">
//           <button
//             onClick={() => router.push('/orders')}
//             className="text-primary-600 hover:text-primary-700 mb-4 flex items-center gap-2"
//           >
//             <ChevronLeftIcon className="h-5 w-5" />
//             Back to Orders
//           </button>

//           <div className="flex items-start justify-between">
//             <div>
//               <h1 className="text-3xl font-bold text-gray-900">
//                 Order Details
//               </h1>
//               <p className="text-gray-600 mt-1">
//                 Order ID: #{order.id.slice(0, 8)}
//               </p>
//             </div>
//             <OrderStatusBadge status={order.status} />
//           </div>
//         </div>

//         <div className="grid lg:grid-cols-3 gap-6">
//           {/* Left Column */}
//           <div className="lg:col-span-2 space-y-6">
//             {/* Order Status Tracker */}
//             <OrderStatusTracker
//               currentStatus={order.status}
//               statusHistory={order.statusHistory}
//               estimatedDeliveryTime={formattedEstimatedTime || undefined}
//               isCancelled={order.status === 'CANCELLED'}
//             />

//             {/* Order Items */}
//             <div className="bg-white rounded-lg shadow-sm p-6">
//               <h3 className="text-lg font-semibold text-gray-900 mb-4">
//                 Order Items ({order.orderItems.length})
//               </h3>

//               <div className="space-y-4">
//                 {order.orderItems.map((item) => (
//                   <div
//                     key={item.id}
//                     className="flex gap-4 pb-4 border-b last:border-0"
//                   >
//                     <div className="relative w-20 h-20 rounded-lg overflow-hidden bg-gray-200 flex-shrink-0">
//                       {item.meal.imageUrl ? (
//                         <Image
//                           src={item.meal.imageUrl}
//                           alt={item.meal.name}
//                           fill
//                           className="object-cover"
//                         />
//                       ) : (
//                         <div className="w-full h-full flex items-center justify-center text-2xl">
//                           🍽️
//                         </div>
//                       )}
//                     </div>

//                     <div className="flex-1">
//                       <h4 className="font-semibold text-gray-900">
//                         {item.meal.name}
//                       </h4>
//                       <p className="text-sm text-gray-600 line-clamp-1 mt-1">
//                         {item.meal.description}
//                       </p>
//                       <p className="text-sm text-gray-500 mt-1">
//                         Quantity: {item.quantity}
//                       </p>
//                     </div>

//                     <div className="text-right">
//                       <p className="font-semibold text-gray-900">
//                         ${(item.priceAtOrder * item.quantity).toFixed(2)}
//                       </p>
//                       <p className="text-sm text-gray-500">
//                         ${item.priceAtOrder.toFixed(2)} each
//                       </p>
//                     </div>
//                   </div>
//                 ))}
//               </div>
//             </div>

//             {/* Delivery & Contact Info */}
//             <div className="bg-white rounded-lg shadow-sm p-6">
//               <h3 className="text-lg font-semibold text-gray-900 mb-4">
//                 Delivery Information
//               </h3>

//               <div className="space-y-4">
//                 <div className="flex gap-3">
//                   <MapPinIcon className="h-5 w-5 text-gray-400 flex-shrink-0 mt-0.5" />
//                   <div>
//                     <p className="text-sm font-medium text-gray-700">
//                       Delivery Address
//                     </p>
//                     <p className="text-gray-900 mt-1">
//                       {order.deliveryAddress}
//                     </p>
//                   </div>
//                 </div>

//                 <div className="flex gap-3">
//                   <PhoneIcon className="h-5 w-5 text-gray-400 flex-shrink-0 mt-0.5" />
//                   <div>
//                     <p className="text-sm font-medium text-gray-700">
//                       Contact Phone
//                     </p>
//                     <p className="text-gray-900 mt-1">{order.contactPhone}</p>
//                   </div>
//                 </div>

//                 {order.orderNotes && (
//                   <div className="flex gap-3">
//                     <div className="h-5 w-5 flex-shrink-0 mt-0.5 text-gray-400">
//                       📝
//                     </div>
//                     <div>
//                       <p className="text-sm font-medium text-gray-700">
//                         Order Notes
//                       </p>
//                       <p className="text-gray-900 mt-1">{order.orderNotes}</p>
//                     </div>
//                   </div>
//                 )}
//               </div>
//             </div>
//           </div>

//           {/* Right Column */}
//           <div className="lg:col-span-1 space-y-6">
//             {/* Restaurant Info */}
//             <div className="bg-white rounded-lg shadow-sm p-6">
//               <h3 className="text-lg font-semibold text-gray-900 mb-4">
//                 Restaurant
//               </h3>

//               <div className="space-y-3">
//                 <div>
//                   <p className="text-sm text-gray-500">Name</p>
//                   <Link
//                     href={`/providers/${order.provider.id}`}
//                     className="font-medium text-primary-600 hover:underline"
//                   >
//                     {order.provider.providerProfile.restaurantName}
//                   </Link>
//                 </div>

//                 <div>
//                   <p className="text-sm text-gray-500">Address</p>
//                   <p className="text-gray-900">
//                     {order.provider.providerProfile.address}
//                   </p>
//                 </div>

//                 <div>
//                   <p className="text-sm text-gray-500">Phone</p>
//                   <a
//                     href={`tel:${order.provider.phone}`}
//                     className="text-primary-600 hover:underline"
//                   >
//                     {order.provider.phone}
//                   </a>
//                 </div>
//               </div>
//             </div>

//             {/* Order Summary */}
//             <div className="bg-white rounded-lg shadow-sm p-6">
//               <h3 className="text-lg font-semibold text-gray-900 mb-4">
//                 Payment Summary
//               </h3>

//               <div className="space-y-3">
//                 <div className="flex justify-between text-gray-600">
//                   <span>Subtotal</span>
//                   <span>${order.totalAmount.toFixed(2)}</span>
//                 </div>

//                 <div className="flex justify-between text-gray-600">
//                   <span>Delivery Fee</span>
//                   <span className="text-green-600 font-medium">FREE</span>
//                 </div>

//                 <div className="border-t pt-3">
//                   <div className="flex justify-between text-lg font-bold">
//                     <span>Total</span>
//                     <span className="text-primary-600">
//                       ${order.totalAmount.toFixed(2)}
//                     </span>
//                   </div>
//                 </div>

//                 <div className="mt-4 pt-4 border-t">
//                   <div className="flex items-center gap-2 text-sm text-gray-600">
//                     <CreditCardIcon className="h-4 w-4" />
//                     <span>Payment Method:</span>
//                   </div>
//                   <p className="font-medium text-gray-900 mt-1">
//                     {order.paymentMethod === 'CASH_ON_DELIVERY'
//                       ? 'Cash on Delivery'
//                       : order.paymentMethod}
//                   </p>
//                   <p className="text-sm text-gray-500 mt-1">
//                     Status:{' '}
//                     {order.paymentStatus === 'PAID' ? '✅ Paid' : '⏳ Pending'}
//                   </p>
//                 </div>

//                 <div className="mt-4 pt-4 border-t">
//                   <div className="flex items-center gap-2 text-sm text-gray-600">
//                     <ClockIcon className="h-4 w-4" />
//                     <span>Order Time:</span>
//                   </div>
//                   <p className="text-gray-900 mt-1">
//                     {new Date(order.createdAt).toLocaleString()}
//                   </p>
//                 </div>
//               </div>
//             </div>

//             {/* Action Buttons */}
//             {canCancelOrder && user?.role === 'CUSTOMER' && (
//               <Button
//                 variant="danger"
//                 className="w-full"
//                 onClick={handleCancelOrder}
//               >
//                 Cancel Order
//               </Button>
//             )}

//             {order.status === 'DELIVERED' && (
//               <Link href={`/reviews/new?orderId=${order.id}`}>
//                 <Button variant="primary" className="w-full">
//                   Write a Review
//                 </Button>
//               </Link>
//             )}

//             <Link href="/meals">
//               <Button variant="secondary" className="w-full">
//                 Order Again
//               </Button>
//             </Link>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }



// -------------------------------

'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter, useSearchParams } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import api from '@/lib/api';
import { OrderStatusTracker } from '@/components/orders/OrderStatusTracker';
import OrderStatusBadge from '@/components/orders/OrderStatusBadge';
import { Button, Spinner } from '@/components/ui';
import { useAuthStore } from '@/lib/store';
import { OrderStatus } from '@/types';
import {
  MapPinIcon,
  PhoneIcon,
  ClockIcon,
  CreditCardIcon,
  ChevronLeftIcon,
  CheckCircleIcon,
} from '@heroicons/react/24/outline';

interface Order {
  id: string;
  status: OrderStatus;
  totalAmount: number;
  deliveryAddress: string;
  contactPhone: string;
  orderNotes?: string;
  paymentMethod: string;
  paymentStatus: string;
  estimatedDeliveryTime?: string;
  actualDeliveryTime?: string;
  createdAt: string;
  provider: {
    id: string;
    name: string;
    phone: string;
    providerProfile: {
      restaurantName: string;
      address: string;
    };
  };
  customer: {
    name: string;
    phone: string;
  };
  orderItems: Array<{
    id: string;
    quantity: number;
    priceAtOrder: number;
    meal: {
      id: string;
      name: string;
      description: string;
      imageUrl?: string;
    };
  }>;
  statusHistory: Array<{
    id: string;
    status: OrderStatus;
    note?: string;
    createdAt: string;
  }>;
}

export default function OrderDetailPage() {
  const params = useParams();
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user } = useAuthStore();

  const orderId = params.id as string;
  const isNewOrder = searchParams.get('new') === 'true';

  const [order, setOrder] = useState<Order | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [showSuccess, setShowSuccess] = useState(isNewOrder);

  // Fetch order details - initial load only
  useEffect(() => {
    const fetchOrder = async () => {
      try {
        setIsLoading(true);
        setError('');
        const response = await api.get(`/orders/${orderId}`);

        if (response.data.success) {
          setOrder(response.data.data);
        } else {
          setError('Failed to load order');
        }
      } catch (err: any) {
        console.error('Error fetching order:', err);
        setError(err.response?.data?.message || 'Failed to load order details');
      } finally {
        setIsLoading(false);
      }
    };

    if (orderId) {
      fetchOrder();
    }
  }, [orderId]);

  // Auto-refresh every 30 seconds for active orders
  useEffect(() => {
    if (!order) return;
    
    // Don't refresh if order is in final state
    if (order.status === 'DELIVERED' || order.status === 'CANCELLED') {
      return;
    }

    const interval = setInterval(async () => {
      try {
        const response = await api.get(`/orders/${orderId}`);
        if (response.data.success) {
          setOrder(response.data.data);
        }
      } catch (err) {
        console.error('Error refreshing order:', err);
      }
    }, 30000);

    return () => clearInterval(interval);
  }, [orderId, order?.status]);

  // Hide success message after 5 seconds
  useEffect(() => {
    if (showSuccess) {
      const timeout = setTimeout(() => setShowSuccess(false), 5000);
      return () => clearTimeout(timeout);
    }
  }, [showSuccess]);

  const handleCancelOrder = async () => {
    if (!confirm('Are you sure you want to cancel this order?')) return;

    try {
      const response = await api.patch(`/orders/${orderId}/cancel`, {
        reason: 'Cancelled by customer',
      });

      if (response.data.success) {
        setOrder(response.data.data);
        alert('Order cancelled successfully');
      }
    } catch (err: any) {
      alert(err.response?.data?.message || 'Failed to cancel order');
    }
  };

  const canCancelOrder =
    order?.status === 'PENDING' || order?.status === 'CONFIRMED';

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Spinner size="lg" />
          <p className="text-gray-600 mt-4">Loading order details...</p>
        </div>
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 mb-4">{error || 'Order not found'}</p>
          <Button onClick={() => router.push('/orders')}>
            View All Orders
          </Button>
        </div>
      </div>
    );
  }

  const formattedEstimatedTime = order.estimatedDeliveryTime
    ? new Date(order.estimatedDeliveryTime).toLocaleTimeString([], {
        hour: '2-digit',
        minute: '2-digit',
      })
    : null;

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Success Message */}
        {showSuccess && (
          <div className="mb-6 bg-green-50 border border-green-200 rounded-lg p-4 flex items-start gap-3">
            <CheckCircleIcon className="h-6 w-6 text-green-600 flex-shrink-0 mt-0.5" />
            <div className="flex-1">
              <h3 className="text-green-900 font-semibold">
                Order Placed Successfully!
              </h3>
              <p className="text-green-700 text-sm mt-1">
                Your order has been sent to the restaurant. They will confirm it
                shortly.
              </p>
            </div>
          </div>
        )}

        {/* Header */}
        <div className="mb-6">
          <button
            onClick={() => router.push('/orders')}
            className="text-primary-600 hover:text-primary-700 mb-4 flex items-center gap-2"
          >
            <ChevronLeftIcon className="h-5 w-5" />
            Back to Orders
          </button>

          <div className="flex items-start justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Order Details
              </h1>
              <p className="text-gray-600 mt-1">
                Order ID: #{order.id.slice(0, 8)}
              </p>
            </div>
            <OrderStatusBadge status={order.status} />
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Left Column */}
          <div className="lg:col-span-2 space-y-6">
            {/* Order Status Tracker */}
            <OrderStatusTracker
              currentStatus={order.status}
              statusHistory={order.statusHistory}
              estimatedDeliveryTime={formattedEstimatedTime || undefined}
              isCancelled={order.status === 'CANCELLED'}
            />

            {/* Order Items */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Order Items ({order.orderItems.length})
              </h3>

              <div className="space-y-4">
                {order.orderItems.map((item) => (
                  <div
                    key={item.id}
                    className="flex gap-4 pb-4 border-b last:border-0"
                  >
                    <div className="relative w-20 h-20 rounded-lg overflow-hidden bg-gray-200 flex-shrink-0">
                      {item.meal.imageUrl ? (
                        <Image
                          src={item.meal.imageUrl}
                          alt={item.meal.name}
                          fill
                          className="object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-2xl">
                          🍽️
                        </div>
                      )}
                    </div>

                    <div className="flex-1">
                      <h4 className="font-semibold text-gray-900">
                        {item.meal.name}
                      </h4>
                      <p className="text-sm text-gray-600 line-clamp-1 mt-1">
                        {item.meal.description}
                      </p>
                      <p className="text-sm text-gray-500 mt-1">
                        Quantity: {item.quantity}
                      </p>
                    </div>

                    <div className="text-right">
                      <p className="font-semibold text-gray-900">
                        ${(item.priceAtOrder * item.quantity).toFixed(2)}
                      </p>
                      <p className="text-sm text-gray-500">
                        ${item.priceAtOrder.toFixed(2)} each
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Delivery & Contact Info */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Delivery Information
              </h3>

              <div className="space-y-4">
                <div className="flex gap-3">
                  <MapPinIcon className="h-5 w-5 text-gray-400 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-gray-700">
                      Delivery Address
                    </p>
                    <p className="text-gray-900 mt-1">
                      {order.deliveryAddress}
                    </p>
                  </div>
                </div>

                <div className="flex gap-3">
                  <PhoneIcon className="h-5 w-5 text-gray-400 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-gray-700">
                      Contact Phone
                    </p>
                    <p className="text-gray-900 mt-1">{order.contactPhone}</p>
                  </div>
                </div>

                {order.orderNotes && (
                  <div className="flex gap-3">
                    <div className="h-5 w-5 flex-shrink-0 mt-0.5 text-gray-400">
                      📝
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-700">
                        Order Notes
                      </p>
                      <p className="text-gray-900 mt-1">{order.orderNotes}</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Right Column */}
          <div className="lg:col-span-1 space-y-6">
            {/* Restaurant Info */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Restaurant
              </h3>

              <div className="space-y-3">
                <div>
                  <p className="text-sm text-gray-500">Name</p>
                  <Link
                    href={`/providers/${order.provider.id}`}
                    className="font-medium text-primary-600 hover:underline"
                  >
                    {order.provider.providerProfile.restaurantName}
                  </Link>
                </div>

                <div>
                  <p className="text-sm text-gray-500">Address</p>
                  <p className="text-gray-900">
                    {order.provider.providerProfile.address}
                  </p>
                </div>

                <div>
                  <p className="text-sm text-gray-500">Phone</p>
                  <a
                    href={`tel:${order.provider.phone}`}
                    className="text-primary-600 hover:underline"
                  >
                    {order.provider.phone}
                  </a>
                </div>
              </div>
            </div>

            {/* Order Summary */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Payment Summary
              </h3>

              <div className="space-y-3">
                <div className="flex justify-between text-gray-600">
                  <span>Subtotal</span>
                  <span>${order.totalAmount.toFixed(2)}</span>
                </div>

                <div className="flex justify-between text-gray-600">
                  <span>Delivery Fee</span>
                  <span className="text-green-600 font-medium">FREE</span>
                </div>

                <div className="border-t pt-3">
                  <div className="flex justify-between text-lg font-bold">
                    <span>Total</span>
                    <span className="text-primary-600">
                      ${order.totalAmount.toFixed(2)}
                    </span>
                  </div>
                </div>

                <div className="mt-4 pt-4 border-t">
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <CreditCardIcon className="h-4 w-4" />
                    <span>Payment Method:</span>
                  </div>
                  <p className="font-medium text-gray-900 mt-1">
                    {order.paymentMethod === 'CASH_ON_DELIVERY'
                      ? 'Cash on Delivery'
                      : order.paymentMethod}
                  </p>
                  <p className="text-sm text-gray-500 mt-1">
                    Status:{' '}
                    {order.paymentStatus === 'PAID' ? '✅ Paid' : '⏳ Pending'}
                  </p>
                </div>

                <div className="mt-4 pt-4 border-t">
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <ClockIcon className="h-4 w-4" />
                    <span>Order Time:</span>
                  </div>
                  <p className="text-gray-900 mt-1">
                    {new Date(order.createdAt).toLocaleString()}
                  </p>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            {canCancelOrder && user?.role === 'CUSTOMER' && (
              <Button
                variant="danger"
                className="w-full"
                onClick={handleCancelOrder}
              >
                Cancel Order
              </Button>
            )}

            {order.status === 'DELIVERED' && (
              <Link href={`/reviews/new?orderId=${order.id}`}>
                <Button variant="primary" className="w-full">
                  Write a Review
                </Button>
              </Link>
            )}

            <Link href="/meals">
              <Button variant="secondary" className="w-full">
                Order Again
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
