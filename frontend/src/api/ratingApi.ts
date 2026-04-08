import apiClient from './client';
import type { RatingCreateRequest } from '../types/rating';

export async function createRatings(data: RatingCreateRequest): Promise<void> {
  await apiClient.post('/ratings', data);
}
