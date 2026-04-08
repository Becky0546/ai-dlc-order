import type { Category, Menu, MenuRatingSummary } from '../types/menu';
import type { TableResponse, OrderHistoryResponse, PagedResponse } from '../types/table';
import type { OrderResponse } from '../types/order';
import type { TableDashboardResponse } from '../types/dashboard';
import type { RecommendationResponse } from '../types/recommendation';

export const categories: Category[] = [
  { id: 1, name: '메인 메뉴', displayOrder: 1 },
  { id: 2, name: '사이드', displayOrder: 2 },
  { id: 3, name: '음료', displayOrder: 3 },
  { id: 4, name: '디저트', displayOrder: 4 },
];

export const menus: Menu[] = [
  {
    id: 1, name: '불고기 정식', price: 12000, description: '부드러운 소고기 불고기와 밑반찬',
    imageUrl: 'https://picsum.photos/seed/menu1/300/200', categoryId: 1, categoryName: '메인 메뉴',
    displayOrder: 1, averageRating: 4.5,
  },
  {
    id: 2, name: '김치찌개', price: 9000, description: '깊은 맛의 김치찌개와 공기밥',
    imageUrl: 'https://picsum.photos/seed/menu2/300/200', categoryId: 1, categoryName: '메인 메뉴',
    displayOrder: 2, averageRating: 4.2,
  },
  {
    id: 3, name: '된장찌개', price: 8500, description: '구수한 된장찌개와 공기밥',
    imageUrl: 'https://picsum.photos/seed/menu3/300/200', categoryId: 1, categoryName: '메인 메뉴',
    displayOrder: 3, averageRating: 4.0,
  },
  {
    id: 4, name: '비빔밥', price: 10000, description: '신선한 야채와 고추장 비빔밥',
    imageUrl: 'https://picsum.photos/seed/menu4/300/200', categoryId: 1, categoryName: '메인 메뉴',
    displayOrder: 4, averageRating: 4.3,
  },
  {
    id: 5, name: '계란말이', price: 5000, description: '폭신한 계란말이',
    imageUrl: 'https://picsum.photos/seed/menu5/300/200', categoryId: 2, categoryName: '사이드',
    displayOrder: 1, averageRating: 4.1,
  },
  {
    id: 6, name: '김치전', price: 7000, description: '바삭한 김치전',
    imageUrl: 'https://picsum.photos/seed/menu6/300/200', categoryId: 2, categoryName: '사이드',
    displayOrder: 2, averageRating: 3.9,
  },
  {
    id: 7, name: '떡볶이', price: 6000, description: '매콤달콤 떡볶이',
    imageUrl: 'https://picsum.photos/seed/menu7/300/200', categoryId: 2, categoryName: '사이드',
    displayOrder: 3, averageRating: 4.4,
  },
  {
    id: 8, name: '콜라', price: 2000, description: '시원한 콜라 500ml',
    imageUrl: 'https://picsum.photos/seed/menu8/300/200', categoryId: 3, categoryName: '음료',
    displayOrder: 1, averageRating: 3.5,
  },
  {
    id: 9, name: '사이다', price: 2000, description: '시원한 사이다 500ml',
    imageUrl: 'https://picsum.photos/seed/menu9/300/200', categoryId: 3, categoryName: '음료',
    displayOrder: 2, averageRating: 3.5,
  },
  {
    id: 10, name: '아이스 아메리카노', price: 3000, description: '진한 아이스 아메리카노',
    imageUrl: 'https://picsum.photos/seed/menu10/300/200', categoryId: 3, categoryName: '음료',
    displayOrder: 3, averageRating: 4.0,
  },
  {
    id: 11, name: '식혜', price: 3500, description: '달콤한 전통 식혜',
    imageUrl: 'https://picsum.photos/seed/menu11/300/200', categoryId: 4, categoryName: '디저트',
    displayOrder: 1, averageRating: 4.2,
  },
  {
    id: 12, name: '호떡', price: 2500, description: '바삭하고 달콤한 호떡',
    imageUrl: 'https://picsum.photos/seed/menu12/300/200', categoryId: 4, categoryName: '디저트',
    displayOrder: 2, averageRating: 4.6,
  },
];

export const menuRatings: MenuRatingSummary[] = menus.map((m) => ({
  menuId: m.id,
  averageScore: m.averageRating,
  totalCount: Math.floor(Math.random() * 50) + 10,
}));

export const tables: TableResponse[] = [
  { id: 1, number: 1, name: '테이블 1', password: '1234', currentSessionId: 1, sessionStatus: 'ACTIVE' },
  { id: 2, number: 2, name: '테이블 2', password: '1234', currentSessionId: 2, sessionStatus: 'ACTIVE' },
  { id: 3, number: 3, name: '테이블 3', password: '1234', currentSessionId: null, sessionStatus: null as TableResponse['sessionStatus'] },
  { id: 4, number: 4, name: '테이블 4', password: '1234', currentSessionId: null, sessionStatus: null as TableResponse['sessionStatus'] },
  { id: 5, number: 5, name: '테이블 5', password: '1234', currentSessionId: 3, sessionStatus: 'ACTIVE' },
];

export const orders: OrderResponse[] = [
  {
    orderId: 1, orderNumber: 'ORD-001',
    items: [
      { menuId: 1, menuName: '불고기 정식', quantity: 2, unitPrice: 12000 },
      { menuId: 8, menuName: '콜라', quantity: 2, unitPrice: 2000 },
    ],
    totalAmount: 28000, status: 'COMPLETED', createdAt: '2026-04-08T12:00:00',
  },
  {
    orderId: 2, orderNumber: 'ORD-002',
    items: [
      { menuId: 2, menuName: '김치찌개', quantity: 1, unitPrice: 9000 },
      { menuId: 5, menuName: '계란말이', quantity: 1, unitPrice: 5000 },
    ],
    totalAmount: 14000, status: 'PREPARING', createdAt: '2026-04-08T12:30:00',
  },
  {
    orderId: 3, orderNumber: 'ORD-003',
    items: [
      { menuId: 4, menuName: '비빔밥', quantity: 3, unitPrice: 10000 },
      { menuId: 7, menuName: '떡볶이', quantity: 1, unitPrice: 6000 },
    ],
    totalAmount: 36000, status: 'PENDING', createdAt: '2026-04-08T13:00:00',
  },
];

export const dashboard: TableDashboardResponse[] = [
  {
    tableId: 1, tableNumber: 1, totalAmount: 28000, hasNewOrder: false,
    recentOrders: [
      { orderId: 1, orderNumber: 'ORD-001', menuSummary: '불고기 정식 외 1건', totalAmount: 28000, status: 'COMPLETED', createdAt: '2026-04-08T12:00:00' },
    ],
  },
  {
    tableId: 2, tableNumber: 2, totalAmount: 14000, hasNewOrder: true,
    recentOrders: [
      { orderId: 2, orderNumber: 'ORD-002', menuSummary: '김치찌개 외 1건', totalAmount: 14000, status: 'PREPARING', createdAt: '2026-04-08T12:30:00' },
    ],
  },
  {
    tableId: 5, tableNumber: 5, totalAmount: 36000, hasNewOrder: true,
    recentOrders: [
      { orderId: 3, orderNumber: 'ORD-003', menuSummary: '비빔밥 외 1건', totalAmount: 36000, status: 'PENDING', createdAt: '2026-04-08T13:00:00' },
    ],
  },
];

export const orderHistory: PagedResponse<OrderHistoryResponse> = {
  content: [
    {
      orderId: 100, orderNumber: 'ORD-100',
      items: [
        { menuName: '불고기 정식', quantity: 1, unitPrice: 12000 },
        { menuName: '콜라', quantity: 1, unitPrice: 2000 },
      ],
      totalAmount: 14000, completedAt: '2026-04-07T18:30:00',
    },
    {
      orderId: 101, orderNumber: 'ORD-101',
      items: [
        { menuName: '비빔밥', quantity: 2, unitPrice: 10000 },
      ],
      totalAmount: 20000, completedAt: '2026-04-07T19:00:00',
    },
  ],
  totalPages: 1, totalElements: 2, number: 0,
};

export const recommendations: RecommendationResponse = {
  gender: 'MALE',
  ageGroup: 'TWENTIES',
  recommendedMenus: [
    { menuId: 1, menuName: '불고기 정식', imageUrl: 'https://picsum.photos/seed/menu1/300/200', orderCount: 120, averageRating: 4.5 },
    { menuId: 4, menuName: '비빔밥', imageUrl: 'https://picsum.photos/seed/menu4/300/200', orderCount: 95, averageRating: 4.3 },
    { menuId: 7, menuName: '떡볶이', imageUrl: 'https://picsum.photos/seed/menu7/300/200', orderCount: 80, averageRating: 4.4 },
  ],
};
