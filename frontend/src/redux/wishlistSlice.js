import { createSlice } from '@reduxjs/toolkit';

const getInitialWishlist = () => {
  try {
    const saved = localStorage.getItem('wishlistItems');
    if (!saved || saved === 'undefined') return [];
    return JSON.parse(saved);
  } catch (error) {
    console.error('Failed to parse wishlist items:', error);
    return [];
  }
};

const initialState = {
  items: getInitialWishlist(),
};

const wishlistSlice = createSlice({
  name: 'wishlist',
  initialState,
  reducers: {
    toggleWishlist: (state, action) => {
      const product = action.payload;
      const exists = state.items.find((item) => item._id === product._id);

      if (exists) {
        state.items = state.items.filter((item) => item._id !== product._id);
      } else {
        state.items.push(product);
      }
      localStorage.setItem('wishlistItems', JSON.stringify(state.items));
    },
    removeFromWishlist: (state, action) => {
      state.items = state.items.filter((item) => item._id !== action.payload);
      localStorage.setItem('wishlistItems', JSON.stringify(state.items));
    },
    clearWishlist: (state) => {
      state.items = [];
      localStorage.removeItem('wishlistItems');
    },
  },
});

export const { toggleWishlist, removeFromWishlist, clearWishlist } = wishlistSlice.actions;
export default wishlistSlice.reducer;
