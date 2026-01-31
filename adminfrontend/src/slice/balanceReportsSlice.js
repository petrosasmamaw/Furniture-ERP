import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const API_BASE = 'http://localhost:5000/api';

export const fetchBalanceReports = createAsyncThunk('balanceReports/fetchBalanceReports', async () => {
  const response = await axios.get(`${API_BASE}/balance-reports`);
  return response.data;
});

export const fetchBalanceReportById = createAsyncThunk('balanceReports/fetchBalanceReportById', async (id) => {
  const response = await axios.get(`${API_BASE}/balance-reports/${id}`);
  return response.data;
});

export const createBalanceReport = createAsyncThunk('balanceReports/createBalanceReport', async (report) => {
  const response = await axios.post(`${API_BASE}/balance-reports`, report);
  return response.data;
});

export const updateBalanceReport = createAsyncThunk('balanceReports/updateBalanceReport', async ({ id, report }) => {
  const response = await axios.put(`${API_BASE}/balance-reports/${id}`, report);
  return response.data;
});

export const deleteBalanceReport = createAsyncThunk('balanceReports/deleteBalanceReport', async (id) => {
  await axios.delete(`${API_BASE}/balance-reports/${id}`);
  return id;
});

const balanceReportsSlice = createSlice({
  name: 'balanceReports',
  initialState: {
    balanceReports: [],
    currentBalanceReport: null,
    status: 'idle',
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchBalanceReports.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchBalanceReports.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.balanceReports = action.payload;
      })
      .addCase(fetchBalanceReports.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      })
      .addCase(fetchBalanceReportById.fulfilled, (state, action) => {
        state.currentBalanceReport = action.payload;
      })
      .addCase(createBalanceReport.fulfilled, (state, action) => {
        state.balanceReports.push(action.payload);
      })
      .addCase(updateBalanceReport.fulfilled, (state, action) => {
        const index = state.balanceReports.findIndex(report => report._id === action.payload._id);
        if (index !== -1) {
          state.balanceReports[index] = action.payload;
        }
      })
      .addCase(deleteBalanceReport.fulfilled, (state, action) => {
        state.balanceReports = state.balanceReports.filter(report => report._id !== action.payload);
      });
  },
});

export default balanceReportsSlice.reducer;