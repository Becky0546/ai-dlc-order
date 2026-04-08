import type { TableDashboardResponse } from '../types/dashboard';

interface TableCardProps {
  table: TableDashboardResponse;
  onClick: (table: TableDashboardResponse) => void;
}

export default function TableCard({ table, onClick }: TableCardProps) {
  return (
    <button
      onClick={() => onClick(table)}
      className={`w-full rounded-xl border p-4 text-left transition-shadow hover:shadow-md ${
        table.hasNewOrder ? 'border-red-400 bg-red-50 animate-pulse' : 'bg-white'
      }`}
      data-testid={`table-card-${table.tableId}`}
    >
      <div className="flex items-center justify-between">
        <span className="text-lg font-bold text-gray-900">테이블 {table.tableNumber}</span>
        {table.hasNewOrder && (
          <span className="rounded-full bg-red-500 px-2 py-0.5 text-xs font-bold text-white">
            NEW
          </span>
        )}
      </div>
      <p className="mt-1 text-xl font-bold text-blue-600">
        {table.totalAmount.toLocaleString()}원
      </p>
      {table.recentOrders.length > 0 && (
        <div className="mt-3 space-y-1">
          {table.recentOrders.slice(0, 3).map((order) => (
            <div key={order.orderId} className="flex justify-between text-xs text-gray-500">
              <span className="truncate">{order.menuSummary}</span>
              <span className="ml-2 whitespace-nowrap">{order.totalAmount.toLocaleString()}원</span>
            </div>
          ))}
        </div>
      )}
    </button>
  );
}
