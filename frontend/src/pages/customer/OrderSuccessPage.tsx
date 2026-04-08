import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';

export default function OrderSuccessPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const orderNumber = searchParams.get('orderNumber') ?? '';
  const [countdown, setCountdown] = useState(5);

  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          navigate('/customer/menu', { replace: true });
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [navigate]);

  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center p-8">
      <div className="text-6xl">✅</div>
      <h1 className="mt-4 text-2xl font-bold text-gray-900">주문 완료!</h1>
      <p className="mt-2 text-lg text-gray-600">
        주문번호: <span className="font-bold text-blue-600" data-testid="order-success-number">#{orderNumber}</span>
      </p>
      <p className="mt-6 text-sm text-gray-400">
        {countdown}초 후 메뉴 화면으로 이동합니다
      </p>
      <button
        onClick={() => navigate('/customer/menu', { replace: true })}
        className="mt-4 rounded-lg bg-blue-600 px-6 py-3 text-sm font-semibold text-white hover:bg-blue-700"
        data-testid="order-success-go-menu"
      >
        메뉴로 돌아가기
      </button>
    </div>
  );
}
