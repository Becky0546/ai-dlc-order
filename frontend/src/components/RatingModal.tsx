import { useState } from 'react';
import { useCreateRatings } from '../hooks/useRatings';
import type { MenuRating } from '../types/rating';

interface RatingModalProps {
  orderId: number;
  menuItems: { menuId: number; menuName: string }[];
  onClose: () => void;
}

export default function RatingModal({ orderId, menuItems, onClose }: RatingModalProps) {
  const [ratings, setRatings] = useState<Record<number, number>>({});
  const createRatings = useCreateRatings();

  const setScore = (menuId: number, score: number) => {
    setRatings((prev) => ({ ...prev, [menuId]: score }));
  };

  const handleSubmit = () => {
    const ratingList: MenuRating[] = Object.entries(ratings)
      .filter(([, score]) => score > 0)
      .map(([menuId, score]) => ({ menuId: Number(menuId), score }));

    if (ratingList.length === 0) {
      onClose();
      return;
    }

    createRatings.mutate(
      { orderId, ratings: ratingList },
      { onSuccess: onClose },
    );
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="mx-4 max-h-[80vh] w-full max-w-sm overflow-y-auto rounded-xl bg-white p-6 shadow-xl">
        <h2 className="text-lg font-bold text-gray-900">메뉴 평가</h2>
        <p className="mt-1 text-sm text-gray-500">각 메뉴에 별점을 남겨주세요</p>

        <div className="mt-4 space-y-4">
          {menuItems.map((item) => (
            <div key={item.menuId} data-testid={`rating-item-${item.menuId}`}>
              <p className="text-sm font-medium text-gray-900">{item.menuName}</p>
              <div className="mt-1 flex gap-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    onClick={() => setScore(item.menuId, star)}
                    className={`text-2xl ${
                      (ratings[item.menuId] ?? 0) >= star ? 'text-yellow-400' : 'text-gray-300'
                    }`}
                    data-testid={`rating-star-${item.menuId}-${star}`}
                  >
                    ★
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="mt-6 flex gap-3">
          <button
            onClick={handleSubmit}
            disabled={createRatings.isPending}
            className="flex-1 rounded-lg bg-blue-600 py-3 text-sm font-semibold text-white hover:bg-blue-700 disabled:bg-gray-300"
            data-testid="rating-submit"
          >
            평가 완료
          </button>
          <button
            onClick={onClose}
            className="flex-1 rounded-lg border py-3 text-sm font-semibold text-gray-700"
            data-testid="rating-skip"
          >
            건너뛰기
          </button>
        </div>
      </div>
    </div>
  );
}
