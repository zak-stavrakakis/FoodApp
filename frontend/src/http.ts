import { AppConfig } from './config';
import type { Meal, Order, CartItem } from './types';

export async function fetchAllMeals(): Promise<Meal[]> {
  const response = await fetch(AppConfig.toApiUrl('meals'));
  const resData = await response.json();

  if (!response.ok) {
    throw new Error('Failed to fetch places');
  }

  return resData;
}

export async function fetchAllOrders(token: string): Promise<Order[]> {
  const response = await fetch(AppConfig.toApiUrl('orders'), {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  const resData = await response.json();

  if (!response.ok) {
    throw new Error('Failed to fetch places');
  }

  return resData;
}

interface PostOrderPayload {
  customer: Record<string, FormDataEntryValue>;
  items: CartItem[];
}

export async function postOrders(order: PostOrderPayload): Promise<string> {
  const token = localStorage.getItem('token');
  const response = await fetch(AppConfig.toApiUrl('orders'), {
    method: 'POST',
    body: JSON.stringify({ order }),
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
  });

  const resData = await response.json();

  if (!response.ok) {
    throw new Error('Failed to update user data.');
  }

  return resData.message;
}
