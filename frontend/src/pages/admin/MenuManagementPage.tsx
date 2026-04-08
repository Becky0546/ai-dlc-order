import { useState } from 'react';
import { useCategories, useMenus } from '../../hooks/useMenus';
import { useCreateMenu, useUpdateMenu, useDeleteMenu, useUploadMenuImage, useCreateCategory, useDeleteCategory } from '../../hooks/useMenuMutations';
import ConfirmDialog from '../../components/ConfirmDialog';
import type { MenuCreateRequest } from '../../api/menuAdminApi';

const EMPTY_FORM: MenuCreateRequest = { name: '', price: 0, description: '', categoryId: 0, displayOrder: 0 };

export default function MenuManagementPage() {
  const { data: categories = [] } = useCategories();
  const { data: menus = [], isLoading } = useMenus();
  const createMenu = useCreateMenu();
  const updateMenu = useUpdateMenu();
  const deleteMenuMut = useDeleteMenu();
  const uploadImage = useUploadMenuImage();
  const createCategory = useCreateCategory();
  const deleteCategory = useDeleteCategory();

  const [showMenuForm, setShowMenuForm] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [form, setForm] = useState<MenuCreateRequest>(EMPTY_FORM);
  const [deleteTarget, setDeleteTarget] = useState<number | null>(null);
  const [newCategoryName, setNewCategoryName] = useState('');
  const [deleteCategoryTarget, setDeleteCategoryTarget] = useState<number | null>(null);

  const openCreate = () => { setForm(EMPTY_FORM); setEditingId(null); setShowMenuForm(true); };
  const openEdit = (menu: typeof menus[0]) => {
    setForm({ name: menu.name, price: menu.price, description: menu.description, categoryId: menu.categoryId, displayOrder: menu.displayOrder });
    setEditingId(menu.id);
    setShowMenuForm(true);
  };

  const handleSubmit = () => {
    if (!form.name.trim() || form.price <= 0 || !form.categoryId) return;
    if (editingId) {
      updateMenu.mutate({ menuId: editingId, data: form }, { onSuccess: () => setShowMenuForm(false) });
    } else {
      createMenu.mutate(form, { onSuccess: () => { setShowMenuForm(false); setForm(EMPTY_FORM); } });
    }
  };

  const handleImageUpload = (menuId: number, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) uploadImage.mutate({ menuId, file });
  };

  const handleDelete = () => {
    if (!deleteTarget) return;
    deleteMenuMut.mutate(deleteTarget, { onSuccess: () => setDeleteTarget(null) });
  };

  if (isLoading) return <div className="flex items-center justify-center p-12"><p className="text-gray-400">로딩 중...</p></div>;

  return (
    <div>
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold text-gray-900">메뉴 관리</h1>
        <button onClick={openCreate} className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700" data-testid="menu-add-button">+ 메뉴 추가</button>
      </div>

      {/* 카테고리 관리 */}
      <div className="mt-4 rounded-lg border bg-white p-4">
        <h2 className="text-sm font-bold text-gray-700">카테고리</h2>
        <div className="mt-2 flex flex-wrap gap-2">
          {categories.map((cat) => (
            <span key={cat.id} className="inline-flex items-center gap-1 rounded-full bg-gray-100 px-3 py-1 text-sm">
              {cat.name}
              <button onClick={() => setDeleteCategoryTarget(cat.id)} className="text-red-400 hover:text-red-600">×</button>
            </span>
          ))}
          <div className="flex gap-1">
            <input type="text" placeholder="새 카테고리" value={newCategoryName} onChange={(e) => setNewCategoryName(e.target.value)} className="rounded-lg border px-2 py-1 text-sm" data-testid="category-new-name" />
            <button onClick={() => { if (newCategoryName.trim()) { createCategory.mutate({ name: newCategoryName.trim(), displayOrder: categories.length }); setNewCategoryName(''); } }} className="rounded-lg bg-green-600 px-2 py-1 text-xs text-white" data-testid="category-add-button">추가</button>
          </div>
        </div>
      </div>

      {/* 메뉴 등록/수정 폼 */}
      {showMenuForm && (
        <div className="mt-4 rounded-lg border bg-white p-4">
          <h2 className="text-sm font-bold text-gray-700">{editingId ? '메뉴 수정' : '메뉴 등록'}</h2>
          <div className="mt-2 grid grid-cols-2 gap-3">
            <input type="text" placeholder="메뉴명" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="rounded-lg border px-3 py-2 text-sm" data-testid="menu-form-name" />
            <input type="number" placeholder="가격" min={0} value={form.price || ''} onChange={(e) => setForm({ ...form, price: Number(e.target.value) })} className="rounded-lg border px-3 py-2 text-sm" data-testid="menu-form-price" />
            <select value={form.categoryId || ''} onChange={(e) => setForm({ ...form, categoryId: Number(e.target.value) })} className="rounded-lg border px-3 py-2 text-sm" data-testid="menu-form-category">
              <option value="">카테고리 선택</option>
              {categories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
            <input type="number" placeholder="순서" min={0} value={form.displayOrder || ''} onChange={(e) => setForm({ ...form, displayOrder: Number(e.target.value) })} className="rounded-lg border px-3 py-2 text-sm" data-testid="menu-form-order" />
            <textarea placeholder="설명" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} className="col-span-2 rounded-lg border px-3 py-2 text-sm" rows={2} data-testid="menu-form-description" />
          </div>
          <div className="mt-3 flex gap-2">
            <button onClick={handleSubmit} className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700" data-testid="menu-form-submit">{editingId ? '수정' : '등록'}</button>
            <button onClick={() => setShowMenuForm(false)} className="rounded-lg border px-4 py-2 text-sm text-gray-600">취소</button>
          </div>
        </div>
      )}

      {/* 메뉴 목록 */}
      <div className="mt-4 space-y-3">
        {menus.map((menu) => (
          <div key={menu.id} className="flex items-center gap-4 rounded-lg border bg-white p-4" data-testid={`menu-row-${menu.id}`}>
            {menu.imageUrl ? (
              <img src={menu.imageUrl} alt={menu.name} className="h-16 w-16 rounded-lg object-cover" />
            ) : (
              <div className="flex h-16 w-16 items-center justify-center rounded-lg bg-gray-100 text-xs text-gray-400">No Img</div>
            )}
            <div className="flex-1">
              <p className="font-semibold text-gray-900">{menu.name}</p>
              <p className="text-sm text-blue-600">{menu.price.toLocaleString()}원</p>
              <p className="text-xs text-gray-500">{menu.categoryName} · 순서 {menu.displayOrder}</p>
            </div>
            <div className="flex gap-2">
              <label className="cursor-pointer rounded bg-gray-100 px-2 py-1 text-xs text-gray-600 hover:bg-gray-200">
                이미지
                <input type="file" accept="image/*" className="hidden" onChange={(e) => handleImageUpload(menu.id, e)} data-testid={`menu-upload-${menu.id}`} />
              </label>
              <button onClick={() => openEdit(menu)} className="rounded bg-yellow-100 px-2 py-1 text-xs text-yellow-700 hover:bg-yellow-200" data-testid={`menu-edit-${menu.id}`}>수정</button>
              <button onClick={() => setDeleteTarget(menu.id)} className="rounded bg-red-100 px-2 py-1 text-xs text-red-700 hover:bg-red-200" data-testid={`menu-delete-${menu.id}`}>삭제</button>
            </div>
          </div>
        ))}
      </div>

      <ConfirmDialog isOpen={!!deleteTarget} title="메뉴 삭제" message="이 메뉴를 삭제하시겠습니까?" confirmLabel="삭제" onConfirm={handleDelete} onCancel={() => setDeleteTarget(null)} isLoading={deleteMenuMut.isPending} />
      <ConfirmDialog isOpen={!!deleteCategoryTarget} title="카테고리 삭제" message="이 카테고리를 삭제하시겠습니까?" confirmLabel="삭제" onConfirm={() => { if (deleteCategoryTarget) deleteCategory.mutate(deleteCategoryTarget, { onSuccess: () => setDeleteCategoryTarget(null) }); }} onCancel={() => setDeleteCategoryTarget(null)} />
    </div>
  );
}
