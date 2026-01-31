import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const API_BASE = 'http://localhost:5000/api';

export const fetchReserveItems = createAsyncThunk('reserveItems/fetchReserveItems', async () => {
  const response = await axios.get(`${API_BASE}/reserve-items`);
  return response.data;
});

export const fetchReserveItemById = createAsyncThunk('reserveItems/fetchReserveItemById', async (id) => {
  const response = await axios.get(`${API_BASE}/reserve-items/${id}`);
  return response.data;
});

export const createReserveItem = createAsyncThunk('reserveItems/createReserveItem', async (item) => {
  const response = await axios.post(`${API_BASE}/reserve-items`, item);
  return response.data;
});

export const updateReserveItem = createAsyncThunk('reserveItems/updateReserveItem', async ({ id, item }) => {
  const response = await axios.put(`${API_BASE}/reserve-items/${id}`, item);
  return response.data;
});

export const deleteReserveItem = createAsyncThunk('reserveItems/deleteReserveItem', async (id) => {
  await axios.delete(`${API_BASE}/reserve-items/${id}`);
  return id;
});

const reserveItemsSlice = createSlice({
  name: 'reserveItems',
  initialState: {
    reserveItems: [],
    currentReserveItem: null,
    status: 'idle',
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchReserveItems.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchReserveItems.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.reserveItems = action.payload;
      })
      .addCase(fetchReserveItems.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      })
      .addCase(fetchReserveItemById.fulfilled, (state, action) => {
        state.currentReserveItem = action.payload;
      })
      .addCase(createReserveItem.fulfilled, (state, action) => {
        state.reserveItems.push(action.payload);
      })
      .addCase(updateReserveItem.fulfilled, (state, action) => {
        const index = state.reserveItems.findIndex(item => item._id === action.payload._id);
        if (index !== -1) {
          state.reserveItems[index] = action.payload;
        }
      })
      .addCase(deleteReserveItem.fulfilled, (state, action) => {
        state.reserveItems = state.reserveItems.filter(item => item._id !== action.payload);
      });
  },
});

export default reserveItemsSlice.reducer;