export interface MenuRating {
  menuId: number;
  score: number;
}

export interface RatingCreateRequest {
  orderId: number;
  ratings: MenuRating[];
}
