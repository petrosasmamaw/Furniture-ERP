import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const API_BASE = 'http://localhost:5000/api';

export const fetchBalances = createAsyncThunk('balances/fetchBalances', async () => {
  const response = await axios.get(`${API_BASE}/balances`);
  return response.data;
});

export const fetchBalanceById = createAsyncThunk('balances/fetchBalanceById', async (id) => {
  const response = await axios.get(`${API_BASE}/balances/${id}`);
  return response.data;
});

export const createBalance = createAsyncThunk('balances/createBalance', async (balance) => {
  const response = await axios.post(`${API_BASE}/balances`, balance);
  return response.data;
});

export const updateBalance = createAsyncThunk('balances/updateBalance', async ({ id, balance }) => {
  const response = await axios.put(`${API_BASE}/balances/${id}`, balance);
  return response.data;
});

export const deleteBalance = createAsyncThunk('balances/deleteBalance', async (id) => {
  await axios.delete(`${API_BASE}/balances/${id}`);
  return id;
});

const balancesSlice = createSlice({
  name: 'balances',
  initialState: {
    balances: [],
    currentBalance: null,
    status: 'idle',
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchBalances.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchBalances.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.balances = action.payload;
      })
      .addCase(fetchBalances.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      })
      .addCase(fetchBalanceById.fulfilled, (state, action) => {
        state.currentBalance = action.payload;
      })
      .addCase(createBalance.fulfilled, (state, action) => {
        state.balances.push(action.payload);
      })
      .addCase(updateBalance.fulfilled, (state, action) => {
        const index = state.balances.findIndex(balance => balance._id === action.payload._id);
        if (index !== -1) {
          state.balances[index] = action.payload;
        }
      })
      .addCase(deleteBalance.fulfilled, (state, action) => {
        state.balances = state.balances.filter(balance => balance._id !== action.payload);
      });
  },
});

export default balancesSlice.reducer;