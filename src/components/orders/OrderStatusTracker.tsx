import { OrderStatus } from '@/types';
import { CheckIcon } from '@heroicons/react/24/solid';

interface OrderStatusTrackerProps {
  currentStatus: OrderStatus;
}

export default function OrderStatusTracker({
  currentStatus,
}: OrderStatusTrackerProps) {
  const steps = [
    { status: OrderStatus.PENDING, label: 'Order Placed' },
    { status: OrderStatus.CONFIRMED, label: 'Confirmed' },
    { status: OrderStatus.PREPARING, label: 'Preparing' },
    { status: OrderStatus.OUT_FOR_DELIVERY, label: 'Out for Delivery' },
    { status: OrderStatus.DELIVERED, label: 'Delivered' },
  ];

  if (currentStatus === OrderStatus.CANCELLED) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-center">
        <p className="text-red-600 font-medium">Order Cancelled</p>
      </div>
    );
  }

  const currentStepIndex = steps.findIndex(
    (step) => step.status === currentStatus,
  );

  return (
    <div className="py-4">
      <div className="flex items-center justify-between">
        {steps.map((step, index) => {
          const isCompleted = index <= currentStepIndex;
          const isCurrent = index === currentStepIndex;

          return (
            <div
              key={step.status}
              className="flex flex-col items-center flex-1"
            >
              <div className="relative flex items-center justify-center">
                {/* Connector line */}
                {index > 0 && (
                  <div
                    className={`absolute right-1/2 w-full h-0.5 -translate-y-1/2 top-1/2 ${
                      isCompleted ? 'bg-primary-600' : 'bg-gray-300'
                    }`}
                    style={{
                      width: 'calc(100% - 24px)',
                      right: 'calc(50% + 12px)',
                    }}
                  />
                )}

                {/* Step circle */}
                <div
                  className={`relative z-10 w-8 h-8 rounded-full flex items-center justify-center ${
                    isCompleted
                      ? 'bg-primary-600 text-white'
                      : 'bg-gray-200 text-gray-400'
                  } ${isCurrent ? 'ring-4 ring-primary-200' : ''}`}
                >
                  {isCompleted ? (
                    <CheckIcon className="w-5 h-5" />
                  ) : (
                    <span className="text-sm">{index + 1}</span>
                  )}
                </div>
              </div>
              <span
                className={`mt-2 text-xs text-center ${
                  isCompleted ? 'text-primary-600 font-medium' : 'text-gray-500'
                }`}
              >
                {step.label}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
