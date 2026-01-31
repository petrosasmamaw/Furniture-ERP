import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const API_BASE = 'http://localhost:5000/api';

export const fetchOrderReports = createAsyncThunk('orderReports/fetchOrderReports', async () => {
  const response = await axios.get(`${API_BASE}/order-reports`);
  return response.data;
});

export const fetchOrderReportById = createAsyncThunk('orderReports/fetchOrderReportById', async (id) => {
  const response = await axios.get(`${API_BASE}/order-reports/${id}`);
  return response.data;
});

export const createOrderReport = createAsyncThunk('orderReports/createOrderReport', async (report) => {
  const response = await axios.post(`${API_BASE}/order-reports`, report);
  return response.data;
});

export const updateOrderReport = createAsyncThunk('orderReports/updateOrderReport', async ({ id, report }) => {
  const response = await axios.put(`${API_BASE}/order-reports/${id}`, report);
  return response.data;
});

export const deleteOrderReport = createAsyncThunk('orderReports/deleteOrderReport', async (id) => {
  await axios.delete(`${API_BASE}/order-reports/${id}`);
  return id;
});

const orderReportsSlice = createSlice({
  name: 'orderReports',
  initialState: {
    orderReports: [],
    currentOrderReport: null,
    status: 'idle',
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchOrderReports.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchOrderReports.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.orderReports = action.payload;
      })
      .addCase(fetchOrderReports.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      })
      .addCase(fetchOrderReportById.fulfilled, (state, action) => {
        state.currentOrderReport = action.payload;
      })
      .addCase(createOrderReport.fulfilled, (state, action) => {
        state.orderReports.push(action.payload);
      })
      .addCase(updateOrderReport.fulfilled, (state, action) => {
        const index = state.orderReports.findIndex(report => report._id === action.payload._id);
        if (index !== -1) {
          state.orderReports[index] = action.payload;
        }
      })
      .addCase(deleteOrderReport.fulfilled, (state, action) => {
        state.orderReports = state.orderReports.filter(report => report._id !== action.payload);
      });
  },
});

export default orderReportsSlice.reducer;