import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:5000/api';

export const fetchProducts = createAsyncThunk('products/fetchProducts', async () => {
  const response = await fetch(`${API_BASE}/products`);
  if (!response.ok) throw new Error('Failed to fetch products');
  return response.json();
});

export const createProduct = createAsyncThunk('products/createProduct', async (formData) => {
  const response = await fetch(`${API_BASE}/products`, {
    method: 'POST',
    body: formData,
  });
  if (!response.ok) throw new Error('Failed to create product');
  return response.json();
});

export const updateProduct = createAsyncThunk('products/updateProduct', async ({ id, formData }) => {
  const response = await fetch(`${API_BASE}/products/${id}`, {
    method: 'PUT',
    body: formData,
  });
  if (!response.ok) throw new Error('Failed to update product');
  return response.json();
});

export const deleteProduct = createAsyncThunk('products/deleteProduct', async (id) => {
  const response = await fetch(`${API_BASE}/products/${id}`, {
    method: 'DELETE',
  });
  if (!response.ok) throw new Error('Failed to delete product');
  return id;
});

const initialState = {
  products: [],
  status: 'idle',
  error: null,
};

const productSlice = createSlice({
  name: 'products',
  initialState,
  extraReducers: (builder) => {
    builder
      .addCase(fetchProducts.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.products = action.payload;
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      })
      .addCase(createProduct.fulfilled, (state, action) => {
        state.products.unshift(action.payload.product);
      })
      .addCase(updateProduct.fulfilled, (state, action) => {
        const index = state.products.findIndex((p) => p._id === action.payload.product._id);
        if (index !== -1) {
          state.products[index] = action.payload.product;
        }
      })
      .addCase(deleteProduct.fulfilled, (state, action) => {
        state.products = state.products.filter((p) => p._id !== action.payload);
      });
  },
});

export default productSlice.reducer;
