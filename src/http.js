export async function fetchAllMeals() {
  const response = await fetch('http://localhost:3000/meals');
  const resData = await response.json();

  if (!response.ok) {
    throw new Error('Failed to fetch places');
  }

  return resData;
}

export async function postOrders(order) {
  const response = await fetch('http://localhost:3000/orders', {
    method: 'POST',
    body: JSON.stringify({ order }),
    headers: {
      'Content-Type': 'application/json',
    },
  });

  const resData = await response.json();

  if (!response.ok) {
    throw new Error('Failed to update user data.');
  }

  return resData.message;
}
