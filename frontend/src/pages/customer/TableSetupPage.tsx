import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { tableLogin } from '../../api/authApi';
import { useAuthStore } from '../../stores/useAuthStore';
import { useTableStore } from '../../stores/useTableStore';
import type { TableCredentials } from '../../types/auth';

export default function TableSetupPage() {
  const navigate = useNavigate();
  const { loginTable } = useAuthStore();
  const { setTableInfo } = useTableStore();

  const [form, setForm] = useState<TableCredentials>({
    storeCode: '',
    tableNumber: 0,
    tablePassword: '',
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const isFormValid =
    form.storeCode.trim() !== '' &&
    form.tableNumber > 0 &&
    form.tablePassword.trim() !== '';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isFormValid) return;

    setIsLoading(true);
    setError(null);

    try {
      const response = await tableLogin({
        storeCode: form.storeCode.trim(),
        tableNumber: form.tableNumber,
        tablePassword: form.tablePassword,
      });

      localStorage.setItem('table_credentials', JSON.stringify({
        storeCode: form.storeCode.trim(),
        tableNumber: form.tableNumber,
        tablePassword: form.tablePassword,
      }));

      loginTable(response);
      setTableInfo(response);
      navigate('/customer/menu', { replace: true });
    } catch (err: unknown) {
      if (err && typeof err === 'object' && 'response' in err) {
        const axiosErr = err as { response?: { status: number } };
        if (axiosErr.response?.status === 401) {
          setError('매장 정보 또는 테이블 비밀번호가 올바르지 않습니다');
        } else {
          setError('서버에 연결할 수 없습니다');
        }
      } else {
        setError('서버에 연결할 수 없습니다');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-sm">
        <h1 className="mb-8 text-center text-2xl font-bold text-gray-900">
          테이블 오더 초기 설정
        </h1>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="storeCode" className="mb-1 block text-sm font-medium text-gray-700">
              매장 코드
            </label>
            <input
              id="storeCode"
              type="text"
              value={form.storeCode}
              onChange={(e) => setForm({ ...form, storeCode: e.target.value })}
              className="w-full rounded-lg border border-gray-300 px-4 py-3 text-base focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              placeholder="매장 코드 입력"
              data-testid="table-setup-store-code"
            />
          </div>

          <div>
            <label htmlFor="tableNumber" className="mb-1 block text-sm font-medium text-gray-700">
              테이블 번호
            </label>
            <input
              id="tableNumber"
              type="number"
              min={1}
              value={form.tableNumber || ''}
              onChange={(e) => setForm({ ...form, tableNumber: Number(e.target.value) })}
              className="w-full rounded-lg border border-gray-300 px-4 py-3 text-base focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              placeholder="테이블 번호 입력"
              data-testid="table-setup-table-number"
            />
          </div>

          <div>
            <label htmlFor="tablePassword" className="mb-1 block text-sm font-medium text-gray-700">
              비밀번호
            </label>
            <input
              id="tablePassword"
              type="password"
              value={form.tablePassword}
              onChange={(e) => setForm({ ...form, tablePassword: e.target.value })}
              className="w-full rounded-lg border border-gray-300 px-4 py-3 text-base focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              placeholder="비밀번호 입력"
              data-testid="table-setup-password"
            />
          </div>

          {error && (
            <p className="text-sm text-red-600" data-testid="table-setup-error">{error}</p>
          )}

          <button
            type="submit"
            disabled={!isFormValid || isLoading}
            className="w-full rounded-lg bg-blue-600 py-3 text-base font-semibold text-white transition-colors hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed"
            style={{ minHeight: '48px' }}
            data-testid="table-setup-submit-button"
          >
            {isLoading ? '연결 중...' : '설정 완료'}
          </button>
        </form>
      </div>
    </div>
  );
}
