// ============================================
// JWT & Auth Types
// ============================================

export interface JwtUserPayload {
  userId: number;
  role: 'user' | 'admin';
  iat?: number;
  exp?: number;
}

// Augment Express Request to include the user property
// set by authMiddleware after JWT verification
declare global {
  namespace Express {
    interface Request {
      user?: JwtUserPayload;
    }
  }
}

// ============================================
// Database Row Types (match SQL schema exactly)
// ============================================

export interface UserRow {
  id: number;
  email: string;
  password_hash: string;
  created_at: Date;
  role: 'user' | 'admin';
}

export interface MealRow {
  id: string;
  name: string;
  price: string; // pg returns NUMERIC as string
  description: string | null;
  image: string | null;
}

export interface CartRow {
  id: number;
  user_id: number;
  total_quantity: number;
  created_at: Date;
}

export interface CartItemRow {
  id: number;
  cart_id: number;
  meal_id: string;
  name: string;
  price: string;
  quantity: number;
  total_price: string;
}

export interface OrderRow {
  id: number;
  user_id: number;
  customer_name: string;
  city: string;
  street: string;
  postal_code: string;
  total_quantity: number;
  total_price: string;
  created_at: Date;
}

export interface OrderItemRow {
  id: number;
  order_id: number;
  meal_id: string;
  name: string;
  price: string;
  quantity: number;
  total_price: string;
}

// ============================================
// Response / Query Types
// ============================================

export interface OrderWithItemsItem {
  mealId: string;
  name: string;
  price: string;
  quantity: number;
  totalPrice: string;
}

export interface OrderWithItems extends OrderRow {
  items: OrderWithItemsItem[];
}
