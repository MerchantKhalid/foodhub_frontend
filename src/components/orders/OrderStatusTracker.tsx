
'use client';

import {
  CheckCircleIcon,
  ClockIcon,
  XCircleIcon,
} from '@heroicons/react/24/solid';
import { OrderStatus } from '@/types';

interface StatusStep {
  status: OrderStatus;
  label: string;
  description: string;
  icon: '📝' | '✅' | '👨‍🍳' | '📦' | '🚚' | '✨' | '❌';
}

const STATUS_STEPS: StatusStep[] = [
  {
    status: 'PENDING' as OrderStatus,
    label: 'Order Placed',
    description: 'Your order has been received',
    icon: '📝',
  },
  {
    status: 'CONFIRMED' as OrderStatus,
    label: 'Confirmed',
    description: 'Restaurant confirmed your order',
    icon: '✅',
  },
  {
    status: 'PREPARING' as OrderStatus,
    label: 'Preparing',
    description: 'Your food is being prepared',
    icon: '👨‍🍳',
  },
  {
    status: 'READY_FOR_PICKUP' as OrderStatus,
    label: 'Ready',
    description: 'Food is ready for delivery',
    icon: '📦',
  },
  {
    status: 'OUT_FOR_DELIVERY' as OrderStatus,
    label: 'On the Way',
    description: 'Your order is out for delivery',
    icon: '🚚',
  },
  {
    status: 'DELIVERED' as OrderStatus,
    label: 'Delivered',
    description: 'Order delivered successfully',
    icon: '✨',
  },
];

interface OrderStatusTrackerProps {
  currentStatus: OrderStatus;
  statusHistory?: Array<{
    status: OrderStatus;
    note?: string;
    createdAt: string;
  }>;
  estimatedDeliveryTime?: string;
  isCancelled?: boolean;
}

export function OrderStatusTracker({
  currentStatus,
  statusHistory = [],
  estimatedDeliveryTime,
  isCancelled = false,
}: OrderStatusTrackerProps) {
  // If order is cancelled, show cancelled state
  if (isCancelled || currentStatus === 'CANCELLED') {
    return (
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-red-100 rounded-full mb-4">
            <XCircleIcon className="h-10 w-10 text-red-600" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            Order Cancelled
          </h3>
          <p className="text-gray-600">This order has been cancelled</p>
          {statusHistory.find((h) => h.status === 'CANCELLED')?.note && (
            <p className="text-sm text-gray-500 mt-2">
              Reason:{' '}
              {statusHistory.find((h) => h.status === 'CANCELLED')?.note}
            </p>
          )}
        </div>
      </div>
    );
  }

  const currentStepIndex = STATUS_STEPS.findIndex(
    (step) => step.status === currentStatus,
  );

  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-900">Order Status</h3>
        {estimatedDeliveryTime && currentStatus !== 'DELIVERED' && (
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <ClockIcon className="h-4 w-4" />
            <span>Est. {estimatedDeliveryTime}</span>
          </div>
        )}
      </div>

      {/* Status Steps - Desktop */}
      <div className="hidden md:block">
        <div className="relative">
          {/* Progress Line */}
          <div className="absolute top-8 left-0 right-0 h-1 bg-gray-200">
            <div
              className="h-full bg-primary-600 transition-all duration-500"
              style={{
                width: `${(currentStepIndex / (STATUS_STEPS.length - 1)) * 100}%`,
              }}
            />
          </div>

          {/* Steps */}
          <div className="relative flex justify-between">
            {STATUS_STEPS.map((step, index) => {
              const isCompleted = index <= currentStepIndex;
              const isCurrent = index === currentStepIndex;

              return (
                <div key={step.status} className="flex flex-col items-center">
                  {/* Circle with Icon */}
                  <div
                    className={`
                      relative z-10 w-16 h-16 rounded-full flex items-center justify-center text-2xl
                      transition-all duration-300
                      ${
                        isCompleted
                          ? 'bg-primary-600 ring-4 ring-primary-100'
                          : 'bg-gray-200'
                      }
                      ${isCurrent ? 'ring-8 ring-primary-200 scale-110' : ''}
                    `}
                  >
                    {isCompleted ? (
                      <CheckCircleIcon className="h-8 w-8 text-white" />
                    ) : (
                      <span className="opacity-50">{step.icon}</span>
                    )}
                  </div>

                  {/* Label */}
                  <div className="mt-3 text-center max-w-[120px]">
                    <p
                      className={`
                        text-sm font-semibold
                        ${isCompleted ? 'text-gray-900' : 'text-gray-400'}
                      `}
                    >
                      {step.label}
                    </p>
                    <p
                      className={`
                        text-xs mt-1
                        ${isCompleted ? 'text-gray-600' : 'text-gray-400'}
                      `}
                    >
                      {step.description}
                    </p>
                    {statusHistory.find((h) => h.status === step.status) && (
                      <p className="text-xs text-gray-500 mt-1">
                        {new Date(
                          statusHistory.find((h) => h.status === step.status)!
                            .createdAt,
                        ).toLocaleTimeString([], {
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </p>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Status Steps - Mobile (Vertical) */}
      <div className="md:hidden space-y-4">
        {STATUS_STEPS.map((step, index) => {
          const isCompleted = index <= currentStepIndex;
          const isCurrent = index === currentStepIndex;

          return (
            <div key={step.status} className="flex gap-4">
              {/* Icon Column */}
              <div className="flex flex-col items-center">
                <div
                  className={`
                    w-12 h-12 rounded-full flex items-center justify-center text-xl
                    ${
                      isCompleted
                        ? 'bg-primary-600 ring-4 ring-primary-100'
                        : 'bg-gray-200'
                    }
                    ${isCurrent ? 'ring-4 ring-primary-200' : ''}
                  `}
                >
                  {isCompleted ? (
                    <CheckCircleIcon className="h-6 w-6 text-white" />
                  ) : (
                    <span className="opacity-50">{step.icon}</span>
                  )}
                </div>
                {index < STATUS_STEPS.length - 1 && (
                  <div
                    className={`
                      w-1 flex-1 mt-2
                      ${isCompleted ? 'bg-primary-600' : 'bg-gray-200'}
                    `}
                    style={{ minHeight: '30px' }}
                  />
                )}
              </div>

              {/* Content Column */}
              <div className="flex-1 pb-4">
                <p
                  className={`
                    font-semibold
                    ${isCompleted ? 'text-gray-900' : 'text-gray-400'}
                  `}
                >
                  {step.label}
                </p>
                <p
                  className={`
                    text-sm mt-1
                    ${isCompleted ? 'text-gray-600' : 'text-gray-400'}
                  `}
                >
                  {step.description}
                </p>
                {statusHistory.find((h) => h.status === step.status) && (
                  <p className="text-xs text-gray-500 mt-1">
                    {new Date(
                      statusHistory.find((h) => h.status === step.status)!
                        .createdAt,
                    ).toLocaleString()}
                  </p>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Current Status Message */}
      {currentStatus !== 'DELIVERED' && (
        <div className="mt-6 bg-primary-50 border border-primary-200 rounded-lg p-4">
          <p className="text-sm text-primary-900">
            <strong>Current Status:</strong>{' '}
            {STATUS_STEPS[currentStepIndex]?.description}
          </p>
        </div>
      )}
    </div>
  );
}

export default OrderStatusTracker;
