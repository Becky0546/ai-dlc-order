import { useState } from 'react';
import { useNavigate, Navigate } from 'react-router-dom';
import { adminLogin } from '../../api/authApi';
import { useAuthStore } from '../../stores/useAuthStore';

export default function AdminLoginPage() {
  const navigate = useNavigate();
  const { loginAdmin, isAuthenticated, role } = useAuthStore();

  const [form, setForm] = useState({
    storeCode: '',
    username: '',
    password: '',
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // 이미 인증됨 → 대시보드로
  if (isAuthenticated && role === 'ADMIN') {
    return <Navigate to="/admin/dashboard" replace />;
  }

  const isFormValid =
    form.storeCode.trim() !== '' &&
    form.username.trim() !== '' &&
    form.password.trim() !== '';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isFormValid) return;

    setIsLoading(true);
    setError(null);

    try {
      const response = await adminLogin({
        storeCode: form.storeCode.trim(),
        username: form.username.trim(),
        password: form.password,
      });

      loginAdmin(response, form.storeCode.trim());
      navigate('/admin/dashboard', { replace: true });
    } catch (err: unknown) {
      if (err && typeof err === 'object' && 'response' in err) {
        const axiosErr = err as { response?: { status: number } };
        if (axiosErr.response?.status === 401) {
          setError('아이디 또는 비밀번호가 올바르지 않습니다');
        } else if (axiosErr.response?.status === 423) {
          setError('로그인 시도 제한 초과. 잠시 후 다시 시도해주세요');
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
    <div className="flex min-h-screen items-center justify-center bg-gray-100 px-4">
      <div className="w-full max-w-sm rounded-xl bg-white p-8 shadow-md">
        <h1 className="mb-6 text-center text-2xl font-bold text-gray-900">
          관리자 로그인
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
              placeholder="매장 코드"
              data-testid="admin-login-store-code"
            />
          </div>

          <div>
            <label htmlFor="username" className="mb-1 block text-sm font-medium text-gray-700">
              아이디
            </label>
            <input
              id="username"
              type="text"
              value={form.username}
              onChange={(e) => setForm({ ...form, username: e.target.value })}
              className="w-full rounded-lg border border-gray-300 px-4 py-3 text-base focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              placeholder="아이디"
              data-testid="admin-login-username"
            />
          </div>

          <div>
            <label htmlFor="password" className="mb-1 block text-sm font-medium text-gray-700">
              비밀번호
            </label>
            <input
              id="password"
              type="password"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              className="w-full rounded-lg border border-gray-300 px-4 py-3 text-base focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              placeholder="비밀번호"
              data-testid="admin-login-password"
            />
          </div>

          {error && (
            <p className="text-sm text-red-600" data-testid="admin-login-error">{error}</p>
          )}

          <button
            type="submit"
            disabled={!isFormValid || isLoading}
            className="w-full rounded-lg bg-blue-600 py-3 text-base font-semibold text-white transition-colors hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed"
            style={{ minHeight: '48px' }}
            data-testid="admin-login-submit-button"
          >
            {isLoading ? '로그인 중...' : '로그인'}
          </button>
        </form>
      </div>
    </div>
  );
}
