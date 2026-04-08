import apiClient from './client';
import type { Menu, Category } from '../types/menu';

export interface MenuCreateRequest {
  name: string;
  price: number;
  description: string;
  categoryId: number;
  displayOrder: number;
}

export interface MenuUpdateRequest {
  name: string;
  price: number;
  description: string;
  categoryId: number;
  displayOrder: number;
}

export interface CategoryCreateRequest {
  name: string;
  displayOrder: number;
}

export async function createMenu(data: MenuCreateRequest): Promise<Menu> {
  const response = await apiClient.post<Menu>('/menus', data);
  return response.data;
}

export async function updateMenu(menuId: number, data: MenuUpdateRequest): Promise<Menu> {
  const response = await apiClient.put<Menu>(`/menus/${menuId}`, data);
  return response.data;
}

export async function deleteMenu(menuId: number): Promise<void> {
  await apiClient.delete(`/menus/${menuId}`);
}

export async function uploadMenuImage(menuId: number, file: File): Promise<{ imageUrl: string }> {
  const formData = new FormData();
  formData.append('file', file);
  const response = await apiClient.post<{ imageUrl: string }>(`/menus/${menuId}/image`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return response.data;
}

export async function updateMenuOrder(items: { menuId: number; displayOrder: number }[]): Promise<void> {
  await apiClient.put('/menus/order', items);
}

export async function createCategory(data: CategoryCreateRequest): Promise<Category> {
  const response = await apiClient.post<Category>('/categories', data);
  return response.data;
}

export async function updateCategory(categoryId: number, data: CategoryCreateRequest): Promise<Category> {
  const response = await apiClient.put<Category>(`/categories/${categoryId}`, data);
  return response.data;
}

export async function deleteCategory(categoryId: number): Promise<void> {
  await apiClient.delete(`/categories/${categoryId}`);
}
