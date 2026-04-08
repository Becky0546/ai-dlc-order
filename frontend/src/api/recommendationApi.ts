import apiClient from './client';
import type { DemographicRequest, RecommendationResponse, Gender, AgeGroup } from '../types/recommendation';

export async function saveDemographic(data: DemographicRequest): Promise<void> {
  await apiClient.post('/recommendations/demographic', data);
}

export async function getRecommendations(gender: Gender, ageGroup: AgeGroup): Promise<RecommendationResponse> {
  const response = await apiClient.get<RecommendationResponse>('/recommendations', {
    params: { gender, ageGroup },
  });
  return response.data;
}
