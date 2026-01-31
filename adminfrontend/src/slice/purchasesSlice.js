import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const API_BASE = 'http://localhost:5000/api';

export const fetchPurchases = createAsyncThunk('purchases/fetchPurchases', async () => {
  const response = await axios.get(`${API_BASE}/purchases`);
  return response.data;
});

export const fetchPurchaseById = createAsyncThunk('purchases/fetchPurchaseById', async (id) => {
  const response = await axios.get(`${API_BASE}/purchases/${id}`);
  return response.data;
});

export const createPurchase = createAsyncThunk('purchases/createPurchase', async (purchase) => {
  const response = await axios.post(`${API_BASE}/purchases`, purchase);
  return response.data;
});

export const updatePurchase = createAsyncThunk('purchases/updatePurchase', async ({ id, purchase }) => {
  const response = await axios.put(`${API_BASE}/purchases/${id}`, purchase);
  return response.data;
});

export const deletePurchase = createAsyncThunk('purchases/deletePurchase', async (id) => {
  await axios.delete(`${API_BASE}/purchases/${id}`);
  return id;
});

const purchasesSlice = createSlice({
  name: 'purchases',
  initialState: {
    purchases: [],
    currentPurchase: null,
    status: 'idle',
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchPurchases.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchPurchases.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.purchases = action.payload;
      })
      .addCase(fetchPurchases.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      })
      .addCase(fetchPurchaseById.fulfilled, (state, action) => {
        state.currentPurchase = action.payload;
      })
      .addCase(createPurchase.fulfilled, (state, action) => {
        state.purchases.push(action.payload);
      })
      .addCase(updatePurchase.fulfilled, (state, action) => {
        const index = state.purchases.findIndex(purchase => purchase._id === action.payload._id);
        if (index !== -1) {
          state.purchases[index] = action.payload;
        }
      })
      .addCase(deletePurchase.fulfilled, (state, action) => {
        state.purchases = state.purchases.filter(purchase => purchase._id !== action.payload);
      });
  },
});

export default purchasesSlice.reducer;