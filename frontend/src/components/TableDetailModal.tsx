import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { deleteOrder } from '../api/orderApi';
import { useTableOrders } from '../hooks/useOrders';
import type { TableDashboardResponse } from '../types/dashboard';

interface TableDetailModalProps {
  table: TableDashboardResponse;
  onClose: () => void;
}

export default function TableDetailModal({ table, onClose }: TableDetailModalProps) {
  const queryClient = useQueryClient();
  const { data: orders = [] } = useTableOrders(table.tableId);
  const [confirmDelete, setConfirmDelete] = useState<number | null>(null);
  const [showSettlement, setShowSettlement] = useState(false);
  const [settlementDone, setSettlementDone] = useState(false);
  const [isSettling, setIsSettling] = useState(false);

  const deleteMutation = useMutation({
    mutationFn: (orderId: number) => deleteOrder(orderId),
    onSuccess: () => {
      setConfirmDelete(null);
      queryClient.invalidateQueries({ queryKey: ['orders'] });
      queryClient.invalidateQueries({ queryKey: ['dashboard'] });
    },
  });

  const handleSettle = async () => {
    setIsSettling(true);
    try {
      for (const order of orders) {
        await deleteOrder(order.orderId);
      }
      queryClient.invalidateQueries({ queryKey: ['orders'] });
      queryClient.invalidateQueries({ queryKey: ['dashboard'] });
      setShowSettlement(false);
      setSettlementDone(true);
    } finally {
      setIsSettling(false);
    }
  };

  if (settlementDone) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50" onClick={onClose}>
        <div
          className="mx-4 w-full max-w-sm rounded-xl bg-white p-8 text-center shadow-xl"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="text-5xl">✅</div>
          <p className="mt-4 text-lg font-bold text-gray-900">결제 완료되었습니다</p>
          <p className="mt-1 text-sm text-gray-500">테이블 {table.tableNumber}의 주문 내역이 초기화되었습니다</p>
          <button
            onClick={onClose}
            className="mt-6 rounded-lg bg-blue-600 px-6 py-3 text-sm font-semibold text-white hover:bg-blue-700"
          >
            확인
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50" onClick={onClose}>
      <div
        className="mx-4 max-h-[80vh] w-full max-w-lg overflow-y-auto rounded-xl bg-white p-6 shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold">테이블 {table.tableNumber}</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600" data-testid="table-detail-close">
            ✕
          </button>
        </div>
        <p className="mt-1 text-lg font-bold text-blue-600">{table.totalAmount.toLocaleString()}원</p>

        <div className="mt-4 space-y-3">
          {orders.map((order) => (
            <div key={order.orderId} className="rounded-lg border p-3" data-testid={`table-detail-order-${order.orderId}`}>
              <div className="flex items-center justify-between">
                <span className="text-sm font-bold">#{order.orderNumber}</span>
                <span className="text-xs text-gray-500">
                  {new Date(order.createdAt).toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>

              <div className="mt-2 text-sm text-gray-600">
                {order.items.map((item) => (
                  <div key={item.menuId}>
                    {item.menuName} x{item.quantity} — {(item.unitPrice * item.quantity).toLocaleString()}원
                  </div>
                ))}
              </div>

              <div className="mt-2 flex justify-between items-center">
                <span className="text-sm font-bold">{order.totalAmount.toLocaleString()}원</span>
                <button
                  onClick={() => setConfirmDelete(order.orderId)}
                  className="text-xs text-red-500 hover:text-red-700"
                  data-testid={`order-delete-${order.orderId}`}
                >
                  삭제
                </button>
              </div>

              {confirmDelete === order.orderId && (
                <div className="mt-2 flex items-center gap-2 rounded bg-red-50 p-2">
                  <span className="text-xs text-red-700">정말 삭제하시겠습니까?</span>
                  <button
                    onClick={() => deleteMutation.mutate(order.orderId)}
                    className="rounded bg-red-500 px-2 py-1 text-xs text-white"
                    data-testid={`order-delete-confirm-${order.orderId}`}
                  >
                    확인
                  </button>
                  <button
                    onClick={() => setConfirmDelete(null)}
                    className="rounded bg-gray-200 px-2 py-1 text-xs text-gray-700"
                  >
                    취소
                  </button>
                </div>
              )}
            </div>
          ))}

          {orders.length === 0 && (
            <p className="py-8 text-center text-gray-400">주문이 없습니다</p>
          )}
        </div>

        {/* 정산 완료 버튼 */}
        {orders.length > 0 && (
          <div className="mt-4 border-t pt-4">
            {!showSettlement ? (
              <button
                onClick={() => setShowSettlement(true)}
                className="w-full rounded-lg bg-green-600 py-3 text-sm font-semibold text-white hover:bg-green-700"
                data-testid="table-settle-button"
              >
                정산 완료 ({table.totalAmount.toLocaleString()}원)
              </button>
            ) : (
              <div className="rounded-lg bg-green-50 p-3">
                <p className="text-sm font-medium text-green-800">
                  테이블 {table.tableNumber}의 주문을 정산하시겠습니까?
                </p>
                <div className="mt-2 flex gap-2">
                  <button
                    onClick={handleSettle}
                    disabled={isSettling}
                    className="flex-1 rounded-lg bg-green-600 py-2 text-sm font-semibold text-white hover:bg-green-700 disabled:bg-gray-300"
                    data-testid="table-settle-confirm"
                  >
                    {isSettling ? '처리 중...' : '정산 확인'}
                  </button>
                  <button
                    onClick={() => setShowSettlement(false)}
                    className="flex-1 rounded-lg border py-2 text-sm font-semibold text-gray-700"
                  >
                    취소
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
