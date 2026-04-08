import { useQuery, useMutation } from '@tanstack/react-query';
import { getRecommendations, saveDemographic } from '../api/recommendationApi';
import type { Gender, AgeGroup, DemographicRequest } from '../types/recommendation';

export function useRecommendations(gender: Gender | null, ageGroup: AgeGroup | null) {
  return useQuery({
    queryKey: ['recommendations', gender, ageGroup],
    queryFn: () => getRecommendations(gender!, ageGroup!),
    enabled: !!gender && !!ageGroup,
  });
}

export function useSaveDemographic() {
  return useMutation({
    mutationFn: (data: DemographicRequest) => saveDemographic(data),
  });
}
