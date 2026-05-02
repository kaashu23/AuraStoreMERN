import { configureStore } from '@reduxjs/toolkit';
import cartReducer from './cartSlice';
import themeReducer from './themeSlice';
import wishlistReducer from './wishlistSlice';

export const store = configureStore({
  reducer: {
    cart: cartReducer,
    theme: themeReducer,
    wishlist: wishlistReducer,
  },
});
