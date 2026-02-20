// ============================================
// Domain Types (shaped by API responses)
// ============================================

export interface User {
  id: number;
  email: string;
  role: 'user' | 'admin';
}

export interface Meal {
  id: string;
  name: string;
  price: number;
  description: string;
  image: string;
}

export interface MealCount {
  meals: Meal[];
  count: number;
}

export interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  totalPrice: number;
}

export interface OrderItem {
  mealId: string;
  name: string;
  price: number;
  quantity: number;
  totalPrice: number;
}

export interface Order {
  id: number;
  created_at: string;
  total_quantity: number;
  total_price: number;
  customer_name: string;
  city: string;
  street: string;
  postal_code: string;
  items: OrderItem[];
}

// ============================================
// Redux State Types
// ============================================

export interface UiState {
  cartIsVisible: boolean;
}

export interface UserState {
  user: Partial<User>;
  token: string | null;
}

export interface CartState {
  items: CartItem[];
  totalQuantity: number;
}

export interface MealsState {
  items: Meal[];
  count: number;
  page: number;
  min: string;
  max: string;
}

// ============================================
// Modal Handle (for forwardRef + useImperativeHandle)
// ============================================

export interface ModalHandle {
  open: () => void;
}
