import { useQuery } from '@tanstack/react-query';
import { getCategories, getMenus, getMenuRatings } from '../api/menuApi';

export function useCategories() {
  return useQuery({
    queryKey: ['categories'],
    queryFn: getCategories,
  });
}

export function useMenus() {
  return useQuery({
    queryKey: ['menus'],
    queryFn: () => getMenus(),
  });
}

export function useMenuRatings() {
  return useQuery({
    queryKey: ['menuRatings'],
    queryFn: getMenuRatings,
  });
}
