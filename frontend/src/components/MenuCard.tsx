import type { Menu } from '../types/menu';
import StarRating from './StarRating';

interface MenuCardProps {
  menu: Menu;
  onClick: (menu: Menu) => void;
}

export default function MenuCard({ menu, onClick }: MenuCardProps) {
  return (
    <button
      onClick={() => onClick(menu)}
      className="flex w-full flex-col overflow-hidden rounded-xl border bg-white shadow-sm transition-shadow hover:shadow-md active:shadow-none"
      style={{ minHeight: '44px' }}
      data-testid={`menu-card-${menu.id}`}
    >
      {menu.imageUrl ? (
        <img
          src={menu.imageUrl}
          alt={menu.name}
          className="h-36 w-full object-cover"
        />
      ) : (
        <div className="flex h-36 w-full items-center justify-center bg-gray-100 text-gray-400">
          No Image
        </div>
      )}
      <div className="flex flex-1 flex-col p-3">
        <h3 className="text-sm font-semibold text-gray-900 line-clamp-1">{menu.name}</h3>
        <p className="mt-1 text-base font-bold text-blue-600">
          {menu.price.toLocaleString()}원
        </p>
        {menu.averageRating > 0 && (
          <div className="mt-1">
            <StarRating score={menu.averageRating} size="sm" />
          </div>
        )}
      </div>
    </button>
  );
}
