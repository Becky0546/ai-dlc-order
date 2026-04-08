import { http, HttpResponse } from 'msw';
import {
  categories,
  menus,
  menuRatings,
  tables,
  orders,
  dashboard,
  orderHistory,
  recommendations,
} from './data';

let nextOrderId = 100;
let nextMenuId = 100;
let nextCategoryId = 100;
let nextTableId = 100;

export const handlers = [
  // ── Auth ──
  http.post('/api/v1/auth/admin/login', () => {
    return HttpResponse.json({
      token: 'mock-admin-token',
      expiresAt: '2026-12-31T23:59:59',
      storeName: 'Mock 매장',
    });
  }),

  http.post('/api/v1/auth/table/login', () => {
    return HttpResponse.json({
      token: 'mock-table-token',
      storeId: 1,
      tableId: 1,
      tableName: '테이블 1',
      sessionId: 1,
    });
  }),

  http.post('/api/v1/auth/refresh', () => {
    return HttpResponse.json({
      token: 'mock-refreshed-token',
      expiresAt: '2026-12-31T23:59:59',
      storeName: 'Mock 매장',
    });
  }),

  // ── Categories ──
  http.get('/api/v1/categories', () => {
    return HttpResponse.json(categories);
  }),

  http.post('/api/v1/categories', async ({ request }) => {
    const body = (await request.json()) as { name: string; displayOrder: number };
    const newCategory = { id: nextCategoryId++, ...body };
    categories.push(newCategory);
    return HttpResponse.json(newCategory, { status: 201 });
  }),

  http.put('/api/v1/categories/:id', async ({ params, request }) => {
    const body = (await request.json()) as { name: string; displayOrder: number };
    const idx = categories.findIndex((c) => c.id === Number(params.id));
    if (idx !== -1) categories[idx] = { ...categories[idx], ...body };
    return HttpResponse.json(categories[idx]);
  }),

  http.delete('/api/v1/categories/:id', ({ params }) => {
    const idx = categories.findIndex((c) => c.id === Number(params.id));
    if (idx !== -1) categories.splice(idx, 1);
    return new HttpResponse(null, { status: 204 });
  }),

  // ── Menus ──
  http.get('/api/v1/menus', ({ request }) => {
    const url = new URL(request.url);
    const categoryId = url.searchParams.get('categoryId');
    const filtered = categoryId ? menus.filter((m) => m.categoryId === Number(categoryId)) : menus;
    return HttpResponse.json(filtered);
  }),

  http.post('/api/v1/menus', async ({ request }) => {
    const body = (await request.json()) as Record<string, unknown>;
    const cat = categories.find((c) => c.id === body.categoryId);
    const newMenu = {
      id: nextMenuId++,
      name: body.name as string,
      price: body.price as number,
      description: body.description as string,
      imageUrl: `https://picsum.photos/seed/menu${nextMenuId}/300/200`,
      categoryId: body.categoryId as number,
      categoryName: cat?.name ?? '',
      displayOrder: body.displayOrder as number,
      averageRating: 0,
    };
    menus.push(newMenu);
    return HttpResponse.json(newMenu, { status: 201 });
  }),

  http.put('/api/v1/menus/:id', async ({ params, request }) => {
    const body = (await request.json()) as Record<string, unknown>;
    const idx = menus.findIndex((m) => m.id === Number(params.id));
    if (idx !== -1) {
      const cat = categories.find((c) => c.id === body.categoryId);
      menus[idx] = { ...menus[idx], ...body, categoryName: cat?.name ?? menus[idx].categoryName } as typeof menus[number];
    }
    return HttpResponse.json(menus[idx]);
  }),

  http.delete('/api/v1/menus/:id', ({ params }) => {
    const idx = menus.findIndex((m) => m.id === Number(params.id));
    if (idx !== -1) menus.splice(idx, 1);
    return new HttpResponse(null, { status: 204 });
  }),

  http.post('/api/v1/menus/:id/image', () => {
    return HttpResponse.json({ imageUrl: 'https://picsum.photos/seed/uploaded/300/200' });
  }),

  http.put('/api/v1/menus/order', () => {
    return new HttpResponse(null, { status: 200 });
  }),

  // ── Menu Ratings ──
  http.get('/api/v1/ratings/menus', () => {
    return HttpResponse.json(menuRatings);
  }),

  http.post('/api/v1/ratings', () => {
    return new HttpResponse(null, { status: 201 });
  }),

  // ── Tables ──
  http.get('/api/v1/tables', () => {
    return HttpResponse.json(tables);
  }),

  http.post('/api/v1/tables', async ({ request }) => {
    const body = (await request.json()) as { number: number; name: string; password: string };
    const newTable = {
      id: nextTableId++,
      ...body,
      currentSessionId: null,
      sessionStatus: null,
    };
    tables.push(newTable);
    return HttpResponse.json(newTable, { status: 201 });
  }),

  http.put('/api/v1/tables/:id', async ({ params, request }) => {
    const body = (await request.json()) as { name: string; password: string };
    const idx = tables.findIndex((t) => t.id === Number(params.id));
    if (idx !== -1) tables[idx] = { ...tables[idx], ...body };
    return HttpResponse.json(tables[idx]);
  }),

  http.post('/api/v1/tables/:id/sessions/end', () => {
    return HttpResponse.json({ archivedOrderCount: 3, totalAmount: 45000 });
  }),

  // ── Orders ──
  http.get('/api/v1/orders', () => {
    return HttpResponse.json(orders);
  }),

  http.post('/api/v1/orders', async ({ request }) => {
    const body = (await request.json()) as { tableId: number; sessionId: number; items: { menuId: number; quantity: number }[] };
    const newOrder = {
      orderId: nextOrderId++,
      orderNumber: `ORD-${String(nextOrderId).padStart(3, '0')}`,
      items: body.items.map((item) => {
        const menu = menus.find((m) => m.id === item.menuId);
        return { menuId: item.menuId, menuName: menu?.name ?? '메뉴', quantity: item.quantity, unitPrice: menu?.price ?? 0 };
      }),
      totalAmount: body.items.reduce((sum, item) => {
        const menu = menus.find((m) => m.id === item.menuId);
        return sum + (menu?.price ?? 0) * item.quantity;
      }, 0),
      status: 'PENDING',
      createdAt: new Date().toISOString(),
    };
    orders.push(newOrder);
    return HttpResponse.json(newOrder, { status: 201 });
  }),

  http.delete('/api/v1/orders/:id', ({ params }) => {
    const idx = orders.findIndex((o) => o.orderId === Number(params.id));
    if (idx !== -1) orders.splice(idx, 1);
    return new HttpResponse(null, { status: 204 });
  }),

  http.patch('/api/v1/orders/:id/status', async ({ params, request }) => {
    const body = (await request.json()) as { status: string };
    const idx = orders.findIndex((o) => o.orderId === Number(params.id));
    if (idx !== -1) orders[idx] = { ...orders[idx], status: body.status };
    return HttpResponse.json(orders[idx]);
  }),

  // ── Order History / Dashboard ──
  http.get('/api/v1/orders/history', () => {
    return HttpResponse.json(orderHistory);
  }),

  http.get('/api/v1/orders/dashboard', () => {
    return HttpResponse.json(dashboard);
  }),

  // ── Recommendations ──
  http.post('/api/v1/recommendations/demographic', () => {
    return new HttpResponse(null, { status: 200 });
  }),

  http.get('/api/v1/recommendations', () => {
    return HttpResponse.json(recommendations);
  }),

  // ── SSE (no-op for MSW, return empty response) ──
  http.get('/api/v1/sse/orders', () => {
    return new HttpResponse(null, { status: 200 });
  }),
];
