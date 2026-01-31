import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const API_BASE = 'http://localhost:5000/api';

export const fetchOrders = createAsyncThunk('orders/fetchOrders', async () => {
  const response = await axios.get(`${API_BASE}/orders`);
  return response.data;
});

export const fetchOrderById = createAsyncThunk('orders/fetchOrderById', async (id) => {
  const response = await axios.get(`${API_BASE}/orders/${id}`);
  return response.data;
});

export const createOrder = createAsyncThunk('orders/createOrder', async (order) => {
  const response = await axios.post(`${API_BASE}/orders`, order);
  return response.data;
});

export const updateOrder = createAsyncThunk('orders/updateOrder', async ({ id, order }) => {
  const response = await axios.put(`${API_BASE}/orders/${id}`, order);
  return response.data;
});

export const deleteOrder = createAsyncThunk('orders/deleteOrder', async (id) => {
  await axios.delete(`${API_BASE}/orders/${id}`);
  return id;
});

const ordersSlice = createSlice({
  name: 'orders',
  initialState: {
    orders: [],
    currentOrder: null,
    status: 'idle',
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchOrders.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchOrders.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.orders = action.payload;
      })
      .addCase(fetchOrders.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      })
      .addCase(fetchOrderById.fulfilled, (state, action) => {
        state.currentOrder = action.payload;
      })
      .addCase(createOrder.fulfilled, (state, action) => {
        state.orders.push(action.payload);
      })
      .addCase(updateOrder.fulfilled, (state, action) => {
        const index = state.orders.findIndex(order => order._id === action.payload._id);
        if (index !== -1) {
          state.orders[index] = action.payload;
        }
      })
      .addCase(deleteOrder.fulfilled, (state, action) => {
        state.orders = state.orders.filter(order => order._id !== action.payload);
      });
  },
});

export default ordersSlice.reducer;