export const ACTIONS = {
  NOTIFY: 'NOTIFY',
  AUTH: 'AUTH',
  ADD_CART: 'ADD_CART',
};

export const addToCart = (product, cart) => {
  if (product.inStock === 0) {
    return { type: 'NOTIFY', payload: { error: 'This product is out of stock!' } };
  }

  const check = cart.every((item) => item._id !== product._id);

  if (!check) {
    return { type: 'NOTIFY', payload: { error: 'The product has been added to cart!' } };
  }

  return { type: 'ADD_CART', payload: [...cart, { ...product, quantity: 1 }] };
};

export const decrease = (data, id) => {
  const newData = [...data];
  newData.forEach((item) => {
    if (item._id === id) {
      if (item.quantity === 1) {
        return;
      }

      item.quantity -= 1;
    }
  });

  return { type: 'ADD_CART', payload: newData };
};

export const increase = (data, id) => {
  const newData = [...data];
  newData.forEach((item) => {
    if (item._id === id) {
      if (item.quantity === item.inStock) {
        return;
      }

      item.quantity += 1;
    }
  });

  return { type: 'ADD_CART', payload: newData };
};

export const remove = (data, id) => {
  const newData = data.filter((item) => item._id !== id);

  return { type: 'ADD_CART', payload: newData };
};
