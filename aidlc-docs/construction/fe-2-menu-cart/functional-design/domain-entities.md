# FE-2 Domain Entities

```typescript
interface Category {
  id: number;
  name: string;
  displayOrder: number;
}

interface Menu {
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

interface CartItem {
  menuId: number;
  menuName: string;
  price: number;
  imageUrl: string;
  quantity: number;
}

interface OrderCreateRequest {
  tableId: number;
  sessionId: number;
  items: OrderItemRequest[];
}

interface OrderItemRequest {
  menuId: number;
  quantity: number;
}

interface OrderResponse {
  orderId: number;
  orderNumber: string;
  items: OrderItemResponse[];
  totalAmount: number;
  status: string;
  createdAt: string;
}

interface OrderItemResponse {
  menuId: number;
  menuName: string;
  quantity: number;
  unitPrice: number;
}
```
