import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../utils/axios';

// Async Thunks
export const fetchCart = createAsyncThunk(
  'cart/fetchCart',
  async (token, { rejectWithValue }) => {
    try {
      const { data } = await api.get('/cart', {
        headers: { Authorization: `Bearer ${token}` }
      });
      return data.data.items.map(item => ({
        ...item.product,
        qty: item.qty,
        backendId: item._id // Store the item ID from DB for easier updates/removals
      }));
    } catch (error) {
      return rejectWithValue(error.response.data.message);
    }
  }
);

export const syncCartItem = createAsyncThunk(
  'cart/syncItem',
  async ({ product, qty, token }, { rejectWithValue }) => {
    try {
      const { data } = await api.post('/cart', 
        { productId: product._id, qty },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      return data.data;
    } catch (error) {
      return rejectWithValue(error.response.data.message);
    }
  }
);

export const clearCartBackend = createAsyncThunk(
  'cart/clearBackend',
  async (token, { rejectWithValue }) => {
    try {
      await api.delete('/cart', {
        headers: { Authorization: `Bearer ${token}` }
      });
      return true;
    } catch (error) {
      return rejectWithValue(error.response.data.message);
    }
  }
);

const getInitialCart = () => {
  try {
    const saved = localStorage.getItem('cartItems');
    if (!saved || saved === 'undefined') return [];
    return JSON.parse(saved);
  } catch (error) {
    console.error('Failed to parse cart items:', error);
    return [];
  }
};

const initialState = {
  items: getInitialCart(),
  status: 'idle',
  error: null,
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
    setCart: (state, action) => {
      state.items = action.payload;
      localStorage.setItem('cartItems', JSON.stringify(state.items));
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCart.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchCart.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.items = action.payload;
        localStorage.setItem('cartItems', JSON.stringify(state.items));
      })
      .addCase(fetchCart.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      });
  }
});

export const { addToCart, updateCartQty, removeFromCart, clearCart, setCart } = cartSlice.actions;
export default cartSlice.reducer;
