import apiClient from './client';
import type { Category, Menu, MenuRatingSummary } from '../types/menu';

export async function getCategories(): Promise<Category[]> {
  const response = await apiClient.get<Category[]>('/categories');
  return response.data;
}

export async function getMenus(categoryId?: number): Promise<Menu[]> {
  const params = categoryId ? { categoryId } : {};
  const response = await apiClient.get<Menu[]>('/menus', { params });
  return response.data;
}

export async function getMenuRatings(): Promise<MenuRatingSummary[]> {
  const response = await apiClient.get<MenuRatingSummary[]>('/ratings/menus');
  return response.data;
}
