import { useState } from 'react';
import { useSaveDemographic } from '../hooks/useRecommendations';
import type { Gender, AgeGroup } from '../types/recommendation';

interface DemographicModalProps {
  orderId: number;
  onClose: () => void;
  onComplete: () => void;
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

export default function DemographicModal({ orderId, onClose, onComplete }: DemographicModalProps) {
  const [gender, setGender] = useState<Gender | null>(null);
  const [ageGroup, setAgeGroup] = useState<AgeGroup | null>(null);
  const saveDemographic = useSaveDemographic();

  const handleSubmit = () => {
    if (!gender || !ageGroup) return;
    saveDemographic.mutate(
      { orderId, gender, ageGroup },
      { onSuccess: onComplete },
    );
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="mx-4 w-full max-w-sm rounded-xl bg-white p-6 shadow-xl">
        <h2 className="text-lg font-bold text-gray-900">간단한 설문</h2>
        <p className="mt-1 text-sm text-gray-500">더 나은 추천을 위해 알려주세요</p>

        <div className="mt-4">
          <p className="text-sm font-medium text-gray-700">성별</p>
          <div className="mt-2 flex gap-2">
            {GENDERS.map((g) => (
              <button
                key={g.value}
                onClick={() => setGender(g.value)}
                className={`flex-1 rounded-lg py-3 text-sm font-medium transition-colors ${
                  gender === g.value ? 'bg-blue-600 text-white' : 'border bg-white text-gray-700'
                }`}
                data-testid={`demographic-gender-${g.value}`}
              >
                {g.label}
              </button>
            ))}
          </div>
        </div>

        <div className="mt-4">
          <p className="text-sm font-medium text-gray-700">나이대</p>
          <div className="mt-2 flex flex-wrap gap-2">
            {AGE_GROUPS.map((a) => (
              <button
                key={a.value}
                onClick={() => setAgeGroup(a.value)}
                className={`rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
                  ageGroup === a.value ? 'bg-blue-600 text-white' : 'border bg-white text-gray-700'
                }`}
                data-testid={`demographic-age-${a.value}`}
              >
                {a.label}
              </button>
            ))}
          </div>
        </div>

        <div className="mt-6 flex gap-3">
          <button
            onClick={handleSubmit}
            disabled={!gender || !ageGroup || saveDemographic.isPending}
            className="flex-1 rounded-lg bg-blue-600 py-3 text-sm font-semibold text-white hover:bg-blue-700 disabled:bg-gray-300"
            data-testid="demographic-submit"
          >
            확인
          </button>
          <button
            onClick={onClose}
            className="flex-1 rounded-lg border py-3 text-sm font-semibold text-gray-700"
            data-testid="demographic-skip"
          >
            건너뛰기
          </button>
        </div>
      </div>
    </div>
  );
}
