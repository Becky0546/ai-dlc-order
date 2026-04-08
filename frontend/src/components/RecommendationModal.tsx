import { useState } from 'react';
import { useRecommendations } from '../hooks/useRecommendations';
import { useMenus } from '../hooks/useMenus';
import { useCartStore } from '../stores/useCartStore';
import StarRating from './StarRating';
import type { Gender, AgeGroup } from '../types/recommendation';

interface RecommendationModalProps {
  onClose: () => void;
}

const GENDERS: { value: Gender; label: string }[] = [
  { value: 'MALE', label: '남성' },
  { value: 'FEMALE', label: '여성' },
];

const AGE_GROUPS: { value: AgeGroup; label: string }[] = [
  { value: 'TEENS', label: '10대' },
  { value: 'TWENTIES', label: '20대' },
  { value: 'THIRTIES', label: '30대' },
  { value: 'FORTIES', label: '40대' },
  { value: 'FIFTIES_PLUS', label: '50대 이상' },
];

export default function RecommendationModal({ onClose }: RecommendationModalProps) {
  const [gender, setGender] = useState<Gender | null>(null);
  const [ageGroup, setAgeGroup] = useState<AgeGroup | null>(null);
  const [step, setStep] = useState<'select' | 'result'>('select');

  const { data, isLoading } = useRecommendations(gender, ageGroup);
  const { data: menus = [] } = useMenus();
  const addItem = useCartStore((s) => s.addItem);

  const handleCheck = () => {
    if (gender && ageGroup) setStep('result');
  };

  const handleAddToCart = (menu: { menuId: number; menuName: string; imageUrl: string }) => {
    const found = menus.find((m) => m.id === menu.menuId);
    addItem({ menuId: menu.menuId, menuName: menu.menuName, price: found?.price ?? 0, imageUrl: menu.imageUrl }, 1);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/50 sm:items-center" onClick={onClose}>
      <div className="w-full max-w-md rounded-t-2xl bg-white sm:rounded-2xl" onClick={(e) => e.stopPropagation()}>
        <div className="p-5">
          {step === 'select' ? (
            <>
              <h2 className="text-lg font-bold text-gray-900">맞춤 메뉴 추천</h2>
              <p className="mt-1 text-sm text-gray-500">성별과 나이대를 선택하면 인기 메뉴를 추천해드려요</p>

              <div className="mt-4">
                <p className="text-sm font-medium text-gray-700">성별</p>
                <div className="mt-2 flex gap-2">
                  {GENDERS.map((g) => (
                    <button key={g.value} onClick={() => setGender(g.value)} className={`flex-1 rounded-lg py-3 text-sm font-medium ${gender === g.value ? 'bg-blue-600 text-white' : 'border text-gray-700'}`} data-testid={`rec-gender-${g.value}`}>
                      {g.label}
                    </button>
                  ))}
                </div>
              </div>

              <div className="mt-4">
                <p className="text-sm font-medium text-gray-700">나이대</p>
                <div className="mt-2 flex flex-wrap gap-2">
                  {AGE_GROUPS.map((a) => (
                    <button key={a.value} onClick={() => setAgeGroup(a.value)} className={`rounded-lg px-4 py-2 text-sm font-medium ${ageGroup === a.value ? 'bg-blue-600 text-white' : 'border text-gray-700'}`} data-testid={`rec-age-${a.value}`}>
                      {a.label}
                    </button>
                  ))}
                </div>
              </div>

              <div className="mt-5 flex gap-3">
                <button onClick={handleCheck} disabled={!gender || !ageGroup} className="flex-1 rounded-lg bg-blue-600 py-3 text-sm font-semibold text-white disabled:bg-gray-300" data-testid="rec-check">추천 보기</button>
                <button onClick={onClose} className="flex-1 rounded-lg border py-3 text-sm font-semibold text-gray-700" data-testid="rec-close">닫기</button>
              </div>
            </>
          ) : (
            <>
              <h2 className="text-lg font-bold text-gray-900">추천 메뉴</h2>

              {isLoading ? (
                <p className="py-8 text-center text-gray-400">추천 메뉴를 불러오는 중...</p>
              ) : !data || data.recommendedMenus.length === 0 ? (
                <p className="py-8 text-center text-gray-400">아직 추천 데이터가 부족합니다</p>
              ) : (
                <div className="mt-4 space-y-3">
                  {data.recommendedMenus.map((menu) => (
                    <div key={menu.menuId} className="flex items-center gap-3 rounded-lg border p-3" data-testid={`rec-menu-${menu.menuId}`}>
                      {menu.imageUrl ? (
                        <img src={menu.imageUrl} alt={menu.menuName} className="h-14 w-14 rounded-lg object-cover" />
                      ) : (
                        <div className="flex h-14 w-14 items-center justify-center rounded-lg bg-gray-100 text-xs text-gray-400">No Img</div>
                      )}
                      <div className="flex-1">
                        <p className="text-sm font-semibold">{menu.menuName}</p>
                        <div className="flex items-center gap-2">
                          <StarRating score={menu.averageRating} size="sm" />
                          <span className="text-xs text-gray-500">{menu.orderCount}명 주문</span>
                        </div>
                      </div>
                      <button onClick={() => handleAddToCart(menu)} className="rounded-lg bg-blue-100 px-3 py-2 text-xs font-medium text-blue-700" data-testid={`rec-add-${menu.menuId}`}>담기</button>
                    </div>
                  ))}
                </div>
              )}

              <button onClick={onClose} className="mt-4 w-full rounded-lg border py-3 text-sm font-semibold text-gray-700" data-testid="rec-result-close">닫기</button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
