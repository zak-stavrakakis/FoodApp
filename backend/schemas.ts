import { z } from 'zod';

// ============================================
// Auth Schemas
// ============================================

export const registerBodySchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

export const loginBodySchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(1, 'Password is required'),
});

// ============================================
// Cart Schemas
// ============================================

export const addToCartBodySchema = z.object({
  mealId: z.string().min(1, 'Meal ID is required'),
  name: z.string().min(1, 'Meal name is required'),
  price: z.number().positive('Price must be positive'),
});

export const removeFromCartBodySchema = z.object({
  mealId: z.string().min(1, 'Meal ID is required'),
});

// ============================================
// Order Schemas
// ============================================

export const createOrderBodySchema = z.object({
  order: z.object({
    items: z
      .array(
        z.object({
          id: z.string().min(1),
          name: z.string().min(1),
          price: z.number().positive(),
          quantity: z.number().int().positive(),
        }),
      )
      .min(1, 'Order must contain at least one item'),
    customer: z.object({
      name: z.string().min(1, 'Customer name is required'),
      city: z.string().min(1, 'City is required'),
      street: z.string().min(1, 'Street is required'),
      postalCode: z.string().min(1, 'Postal code is required'),
    }),
  }),
});

// ============================================
// Meal Schemas
// ============================================

export const updateMealBodySchema = z.object({
  name: z.string().min(1, 'Meal name is required'),
  price: z.union([
    z.number().positive('Price must be positive'),
    z.string().regex(/^\d+(\.\d{1,2})?$/, 'Price must be a valid number'),
  ]),
  description: z.string().min(1, 'Description is required'),
});

export const mealIdParamSchema = z.object({
  id: z.string().min(1, 'Meal ID is required'),
});

// ============================================
// Inferred Types (replace manual interfaces)
// ============================================

export type RegisterBody = z.infer<typeof registerBodySchema>;
export type LoginBody = z.infer<typeof loginBodySchema>;
export type AddToCartBody = z.infer<typeof addToCartBodySchema>;
export type RemoveFromCartBody = z.infer<typeof removeFromCartBodySchema>;
export type CreateOrderBody = z.infer<typeof createOrderBodySchema>;
export type UpdateMealBody = z.infer<typeof updateMealBodySchema>;
export type MealIdParam = z.infer<typeof mealIdParamSchema>;
