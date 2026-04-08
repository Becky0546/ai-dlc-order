import { useState } from 'react';
import { useDashboard } from '../../hooks/useOrders';
import TableCard from '../../components/TableCard';
import TableDetailModal from '../../components/TableDetailModal';
import type { TableDashboardResponse } from '../../types/dashboard';

export default function DashboardPage() {
  const { data: tables = [], isLoading } = useDashboard();
  const [selectedTable, setSelectedTable] = useState<TableDashboardResponse | null>(null);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-12">
        <p className="text-gray-400">대시보드를 불러오는 중...</p>
      </div>
    );
  }

  return (
    <div>
      <h1 className="mb-4 text-xl font-bold text-gray-900">실시간 주문 현황</h1>

      {tables.length === 0 ? (
        <p className="py-12 text-center text-gray-400">활성 테이블이 없습니다</p>
      ) : (
        <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
          {tables.map((table) => (
            <TableCard key={table.tableId} table={table} onClick={setSelectedTable} />
          ))}
        </div>
      )}

      {selectedTable && (
        <TableDetailModal
          table={selectedTable}
          onClose={() => setSelectedTable(null)}
        />
      )}
    </div>
  );
}
