import { useState } from 'react';
import { useTables } from '../../hooks/useTables';
import { useOrderHistory } from '../../hooks/useOrderHistory';

export default function AdminOrderHistoryPage() {
  const { data: tables = [] } = useTables();
  const [selectedTableId, setSelectedTableId] = useState<number | null>(null);
  const [dateFilter, setDateFilter] = useState('');
  const [page, setPage] = useState(0);

  const { data: historyData, isLoading } = useOrderHistory(selectedTableId, dateFilter || undefined, page);

  return (
    <div>
      <h1 className="text-xl font-bold text-gray-900">과거 주문 이력</h1>

      <div className="mt-4 flex gap-3">
        <select
          value={selectedTableId ?? ''}
          onChange={(e) => { setSelectedTableId(e.target.value ? Number(e.target.value) : null); setPage(0); }}
          className="rounded-lg border px-3 py-2 text-sm"
          data-testid="history-table-filter"
        >
          <option value="">테이블 선택</option>
          {tables.map((t) => (
            <option key={t.id} value={t.id}>테이블 {t.number}</option>
          ))}
        </select>
        <input
          type="date"
          value={dateFilter}
          onChange={(e) => { setDateFilter(e.target.value); setPage(0); }}
          className="rounded-lg border px-3 py-2 text-sm"
          data-testid="history-date-filter"
        />
      </div>

      {!selectedTableId ? (
        <p className="mt-8 text-center text-gray-400">테이블을 선택해주세요</p>
      ) : isLoading ? (
        <p className="mt-8 text-center text-gray-400">로딩 중...</p>
      ) : !historyData || historyData.content.length === 0 ? (
        <p className="mt-8 text-center text-gray-400">이력이 없습니다</p>
      ) : (
        <>
          <div className="mt-4 space-y-3">
            {historyData.content.map((order) => (
              <div key={order.orderId} className="rounded-lg border bg-white p-4" data-testid={`history-order-${order.orderId}`}>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-bold">#{order.orderNumber}</span>
                  <span className="text-xs text-gray-500">{new Date(order.completedAt).toLocaleString('ko-KR')}</span>
                </div>
                <div className="mt-2 text-sm text-gray-600">
                  {order.items.map((item, idx) => (
                    <span key={idx} className="mr-2">{item.menuName} x{item.quantity}</span>
                  ))}
                </div>
                <div className="mt-1 text-right text-sm font-bold">{order.totalAmount.toLocaleString()}원</div>
              </div>
            ))}
          </div>

          {historyData.totalPages > 1 && (
            <div className="mt-4 flex justify-center gap-2">
              <button disabled={page === 0} onClick={() => setPage(page - 1)} className="rounded border px-3 py-1 text-sm disabled:text-gray-300">이전</button>
              <span className="px-3 py-1 text-sm">{page + 1} / {historyData.totalPages}</span>
              <button disabled={page >= historyData.totalPages - 1} onClick={() => setPage(page + 1)} className="rounded border px-3 py-1 text-sm disabled:text-gray-300">다음</button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
