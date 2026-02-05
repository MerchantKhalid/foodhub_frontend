import { OrderStatus } from '@/types';
import { Badge } from '@/components/ui';

interface OrderStatusBadgeProps {
  status: OrderStatus;
}

export default function OrderStatusBadge({ status }: OrderStatusBadgeProps) {
  const statusConfig: Record<
    OrderStatus,
    {
      label: string;
      variant: 'default' | 'success' | 'warning' | 'danger' | 'info';
    }
  > = {
    [OrderStatus.PENDING]: { label: 'Pending', variant: 'warning' },
    [OrderStatus.CONFIRMED]: { label: 'Confirmed', variant: 'info' },
    [OrderStatus.PREPARING]: { label: 'Preparing', variant: 'info' },
    [OrderStatus.OUT_FOR_DELIVERY]: {
      label: 'Out for Delivery',
      variant: 'info',
    },
    [OrderStatus.DELIVERED]: { label: 'Delivered', variant: 'success' },
    [OrderStatus.CANCELLED]: { label: 'Cancelled', variant: 'danger' },
  };

  const config = statusConfig[status];

  return <Badge variant={config.variant}>{config.label}</Badge>;
}
