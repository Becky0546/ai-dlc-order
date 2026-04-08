import { useMutation } from '@tanstack/react-query';
import { createRatings } from '../api/ratingApi';
import type { RatingCreateRequest } from '../types/rating';

export function useCreateRatings() {
  return useMutation({
    mutationFn: (data: RatingCreateRequest) => createRatings(data),
  });
}
