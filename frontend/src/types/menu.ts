export interface Category {
  id: number;
  name: string;
  displayOrder: number;
}

export interface Menu {
  id: number;
  name: string;
  price: number;
  description: string;
  imageUrl: string;
  categoryId: number;
  categoryName: string;
  displayOrder: number;
  averageRating: number;
}

export interface MenuRatingSummary {
  menuId: number;
  averageScore: number;
  totalCount: number;
}
