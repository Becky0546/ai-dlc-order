export type Gender = 'MALE' | 'FEMALE';
export type AgeGroup = 'TEENS' | 'TWENTIES' | 'THIRTIES' | 'FORTIES' | 'FIFTIES_PLUS';

export interface DemographicRequest {
  orderId: number;
  gender: Gender;
  ageGroup: AgeGroup;
}

export interface MenuRecommendation {
  menuId: number;
  menuName: string;
  imageUrl: string;
  orderCount: number;
  averageRating: number;
}

export interface RecommendationResponse {
  gender: Gender;
  ageGroup: AgeGroup;
  recommendedMenus: MenuRecommendation[];
}
