import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { adminLogin } from '../api/authApi';
import { useAuthStore } from '../stores/useAuthStore';

export default function ReLoginModal() {
  const navigate = useNavigate();
  const { showReLoginModal, setShowReLoginModal, storeCode, loginAdmin, logout } =
    useAuthStore();

  const [form, setForm] = useState({ username: '', password: '' });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!showReLoginModal) return null;

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!storeCode || !form.username.trim() || !form.password.trim()) return;

    setIsLoading(true);
    setError(null);

    try {
      const response = await adminLogin({
        storeCode,
        username: form.username.trim(),
        password: form.password,
      });
      loginAdmin(response, storeCode);
      setShowReLoginModal(false);
      setForm({ username: '', password: '' });
    } catch {
      setError('로그인에 실패했습니다. 다시 시도해주세요.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    logout();
    setShowReLoginModal(false);
    setForm({ username: '', password: '' });
    navigate('/admin/login');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="mx-4 w-full max-w-sm rounded-xl bg-white p-6 shadow-xl">
        <h2 className="mb-4 text-lg font-bold text-gray-900">
          세션이 만료되었습니다
        </h2>

        <form onSubmit={handleLogin} className="space-y-3">
          <input
            type="text"
            value={form.username}
            onChange={(e) => setForm({ ...form, username: e.target.value })}
            className="w-full rounded-lg border border-gray-300 px-4 py-3 text-base focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            placeholder="아이디"
            data-testid="relogin-username"
          />
          <input
            type="password"
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
            className="w-full rounded-lg border border-gray-300 px-4 py-3 text-base focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            placeholder="비밀번호"
            data-testid="relogin-password"
          />

          {error && <p className="text-sm text-red-600">{error}</p>}

          <div className="flex gap-3 pt-2">
            <button
              type="submit"
              disabled={isLoading}
              className="flex-1 rounded-lg bg-blue-600 py-3 text-sm font-semibold text-white hover:bg-blue-700 disabled:bg-gray-300"
              data-testid="relogin-submit-button"
            >
              {isLoading ? '로그인 중...' : '다시 로그인'}
            </button>
            <button
              type="button"
              onClick={handleCancel}
              className="flex-1 rounded-lg border border-gray-300 py-3 text-sm font-semibold text-gray-700 hover:bg-gray-50"
              data-testid="relogin-cancel-button"
            >
              로그아웃
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
