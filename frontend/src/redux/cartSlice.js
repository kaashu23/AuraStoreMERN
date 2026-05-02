import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  items: JSON.parse(localStorage.getItem('cartItems')) || [],
};

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    addToCart: (state, action) => {
      const { product, qty } = action.payload;
      const existItem = state.items.find((x) => x._id === product._id);

      if (existItem) {
        state.items = state.items.map((x) =>
          x._id === existItem._id ? { ...x, qty: x.qty + qty } : x
        );
      } else {
        state.items.push({ ...product, qty });
      }
      localStorage.setItem('cartItems', JSON.stringify(state.items));
    },
    updateCartQty: (state, action) => {
      const { id, qty } = action.payload;
      state.items = state.items.map((x) =>
        x._id === id ? { ...x, qty } : x
      );
      localStorage.setItem('cartItems', JSON.stringify(state.items));
    },
    removeFromCart: (state, action) => {
      state.items = state.items.filter((x) => x._id !== action.payload);
      localStorage.setItem('cartItems', JSON.stringify(state.items));
    },
    clearCart: (state) => {
      state.items = [];
      localStorage.removeItem('cartItems');
    },
  },
});

export const { addToCart, updateCartQty, removeFromCart, clearCart } = cartSlice.actions;
export default cartSlice.reducer;
