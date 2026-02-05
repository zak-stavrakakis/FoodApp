import { createContext, useReducer } from 'react';

export const FoodCartContext = createContext({
  items: [],
  addItemToCart: () => {},
  updateItemQuantity: () => {},
});

function foodCartReducer(state, action) {
  if (action.type === 'ADD_ITEM') {
    const updatedItems = [...state.items];

    const existingCartItemIndex = updatedItems.findIndex(
      (cartItem) => cartItem.id === action.payload.id,
    );
    const existingCartItem = updatedItems[existingCartItemIndex];

    if (existingCartItem) {
      const updatedItem = {
        ...existingCartItem,
        quantity: existingCartItem.quantity + 1,
      };
      updatedItems[existingCartItemIndex] = updatedItem;
    } else {
      console.log(action.payload);

      updatedItems.push({
        id: action.payload.id,
        name: action.payload.name,
        price: action.payload.price,
        quantity: 1,
      });
    }

    return {
      ...state, // not needed here because we have only one value
      items: updatedItems,
    };
  }

  if (action.type === 'UPDATE_ITEM') {
    const updatedItems = [...state.items];
    const updatedItemIndex = updatedItems.findIndex(
      (item) => item.id === action.payload.productId,
    );

    const updatedItem = {
      ...updatedItems[updatedItemIndex],
    };

    updatedItem.quantity += action.payload.amount;

    if (updatedItem.quantity <= 0) {
      updatedItems.splice(updatedItemIndex, 1);
    } else {
      updatedItems[updatedItemIndex] = updatedItem;
    }

    return {
      ...state,
      items: updatedItems,
    };
  }
  return state;
}

export default function FoodContextProvider({ children }) {
  const [foodCartState, foodCartDispatch] = useReducer(foodCartReducer, {
    items: [],
  });

  function handleAddItemToCart(meal) {
    foodCartDispatch({
      type: 'ADD_ITEM',
      payload: meal,
    });
  }

  function handleUpdateCartItemQuantity(productId, amount) {
    foodCartDispatch({
      type: 'UPDATE_ITEM',
      payload: {
        productId,
        amount,
      },
    });
  }

  const ctxValue = {
    items: foodCartState.items,
    addItemToCart: handleAddItemToCart,
    updateItemQuantity: handleUpdateCartItemQuantity,
  };

  return (
    <FoodCartContext.Provider value={ctxValue}>
      {children}
    </FoodCartContext.Provider>
  );
}
