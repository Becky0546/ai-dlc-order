import { useState, useMemo } from 'react';
import { useCategories, useMenus, useMenuRatings } from '../../hooks/useMenus';
import { useCartStore } from '../../stores/useCartStore';
import MenuCard from '../../components/MenuCard';
import MenuDetailModal from '../../components/MenuDetailModal';
import type { Menu } from '../../types/menu';

export default function MenuPage() {
  const { data: categories = [] } = useCategories();
  const { data: menus = [], isLoading } = useMenus();
  const { data: ratings = [] } = useMenuRatings();
  const addItem = useCartStore((s) => s.addItem);

  const [selectedCategoryId, setSelectedCategoryId] = useState<number | null>(null);
  const [selectedMenu, setSelectedMenu] = useState<Menu | null>(null);

  // 카테고리 미선택 시 첫 번째 자동 선택
  const activeCategoryId = selectedCategoryId ?? categories[0]?.id ?? null;

  // 메뉴에 평점 데이터 병합
  const menusWithRatings = useMemo(() => {
    const ratingMap = new Map(ratings.map((r) => [r.menuId, r.averageScore]));
    return menus.map((m) => ({
      ...m,
      averageRating: ratingMap.get(m.id) ?? m.averageRating ?? 0,
    }));
  }, [menus, ratings]);

  // 선택된 카테고리 메뉴 필터
  const filteredMenus = activeCategoryId
    ? menusWithRatings.filter((m) => m.categoryId === activeCategoryId)
    : menusWithRatings;

  const handleAddToCart = (menu: Menu, quantity: number) => {
    addItem(
      { menuId: menu.id, menuName: menu.name, price: menu.price, imageUrl: menu.imageUrl },
      quantity,
    );
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-12">
        <p className="text-gray-400">메뉴를 불러오는 중...</p>
      </div>
    );
  }

  return (
    <div>
      {/* 카테고리 탭 */}
      <div className="sticky top-[88px] z-[5] overflow-x-auto border-b bg-white px-4 py-2">
        <div className="flex gap-2">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategoryId(cat.id)}
              className={`whitespace-nowrap rounded-full px-4 py-2 text-sm font-medium transition-colors ${
                activeCategoryId === cat.id
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
              style={{ minHeight: '44px' }}
              data-testid={`category-tab-${cat.id}`}
            >
              {cat.name}
            </button>
          ))}
        </div>
      </div>

      {/* 메뉴 그리드 */}
      <div className="grid grid-cols-2 gap-3 p-4">
        {filteredMenus.map((menu) => (
          <MenuCard key={menu.id} menu={menu} onClick={setSelectedMenu} />
        ))}
      </div>

      {filteredMenus.length === 0 && (
        <p className="py-12 text-center text-gray-400">해당 카테고리에 메뉴가 없습니다</p>
      )}

      {/* 메뉴 상세 모달 */}
      {selectedMenu && (
        <MenuDetailModal
          menu={selectedMenu}
          onClose={() => setSelectedMenu(null)}
          onAddToCart={handleAddToCart}
        />
      )}
    </div>
  );
}
