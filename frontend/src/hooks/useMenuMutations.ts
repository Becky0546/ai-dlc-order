import { useMutation, useQueryClient } from '@tanstack/react-query';
import {
  createMenu,
  updateMenu,
  deleteMenu,
  uploadMenuImage,
  createCategory,
  updateCategory,
  deleteCategory,
} from '../api/menuAdminApi';
import type { MenuCreateRequest, MenuUpdateRequest, CategoryCreateRequest } from '../api/menuAdminApi';

export function useCreateMenu() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: MenuCreateRequest) => createMenu(data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['menus'] }),
  });
}

export function useUpdateMenu() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ menuId, data }: { menuId: number; data: MenuUpdateRequest }) =>
      updateMenu(menuId, data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['menus'] }),
  });
}

export function useDeleteMenu() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (menuId: number) => deleteMenu(menuId),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['menus'] }),
  });
}

export function useUploadMenuImage() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ menuId, file }: { menuId: number; file: File }) =>
      uploadMenuImage(menuId, file),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['menus'] }),
  });
}

export function useCreateCategory() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: CategoryCreateRequest) => createCategory(data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['categories'] }),
  });
}

export function useUpdateCategory() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ categoryId, data }: { categoryId: number; data: CategoryCreateRequest }) =>
      updateCategory(categoryId, data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['categories'] }),
  });
}

export function useDeleteCategory() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (categoryId: number) => deleteCategory(categoryId),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['categories'] }),
  });
}
