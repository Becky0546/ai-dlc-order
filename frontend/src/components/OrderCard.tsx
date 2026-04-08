import type { OrderResponse } from '../types/order';

const STATUS_LABELS: Record<string, { label: string; color: string }> = {
  PENDING: { label: '대기중', color: 'bg-yellow-100 text-yellow-800' },
  PREPARING: { label: '준비중', color: 'bg-blue-100 text-blue-800' },
  COMPLETED: { label: '완료', color: 'bg-green-100 text-green-800' },
};

interface OrderCardProps {
  order: OrderResponse;
  showStatus?: boolean;
}

export default function OrderCard({ order, showStatus = true }: OrderCardProps) {
  const status = STATUS_LABELS[order.status] ?? STATUS_LABELS.PENDING;
  const time = new Date(order.createdAt).toLocaleTimeString('ko-KR', {
    hour: '2-digit',
    minute: '2-digit',
  });

  return (
    <div className="rounded-lg border bg-white p-4" data-testid={`order-card-${order.orderId}`}>
      <div className="flex items-center justify-between">
        <span className="text-sm font-bold text-gray-900">#{order.orderNumber}</span>
        <div className="flex items-center gap-2">
          <span className="text-xs text-gray-500">{time}</span>
          {showStatus && (
            <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${status.color}`}>
              {status.label}
            </span>
          )}
        </div>
      </div>
      <div className="mt-2 text-sm text-gray-600">
        {order.items.map((item) => (
          <span key={item.menuId} className="mr-2">
            {item.menuName} x{item.quantity}
          </span>
        ))}
      </div>
      <div className="mt-2 text-right text-sm font-bold text-gray-900">
        {order.totalAmount.toLocaleString()}원
      </div>
    </div>
  );
}
