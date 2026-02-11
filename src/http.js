import { AppConfig } from './config';

export async function fetchAllMeals() {
  const response = await fetch(AppConfig.toApiUrl('meals'));
  const resData = await response.json();

  if (!response.ok) {
    throw new Error('Failed to fetch places');
  }

  return resData;
}

export async function fetchAllOrders(token) {
  const response = await fetch(AppConfig.toApiUrl('orders'), {
    method: 'GET', // optional, GET is default
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

export async function postOrders(order) {
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
