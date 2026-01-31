import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const API_BASE = 'http://localhost:5000/api';

export const fetchCreditReports = createAsyncThunk('creditReports/fetchCreditReports', async () => {
  const response = await axios.get(`${API_BASE}/credit-reports`);
  return response.data;
});

export const fetchCreditReportById = createAsyncThunk('creditReports/fetchCreditReportById', async (id) => {
  const response = await axios.get(`${API_BASE}/credit-reports/${id}`);
  return response.data;
});

export const createCreditReport = createAsyncThunk('creditReports/createCreditReport', async (report) => {
  const response = await axios.post(`${API_BASE}/credit-reports`, report);
  return response.data;
});

export const updateCreditReport = createAsyncThunk('creditReports/updateCreditReport', async ({ id, report }) => {
  const response = await axios.put(`${API_BASE}/credit-reports/${id}`, report);
  return response.data;
});

export const deleteCreditReport = createAsyncThunk('creditReports/deleteCreditReport', async (id) => {
  await axios.delete(`${API_BASE}/credit-reports/${id}`);
  return id;
});

const creditReportsSlice = createSlice({
  name: 'creditReports',
  initialState: {
    creditReports: [],
    currentCreditReport: null,
    status: 'idle',
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchCreditReports.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchCreditReports.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.creditReports = action.payload;
      })
      .addCase(fetchCreditReports.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      })
      .addCase(fetchCreditReportById.fulfilled, (state, action) => {
        state.currentCreditReport = action.payload;
      })
      .addCase(createCreditReport.fulfilled, (state, action) => {
        state.creditReports.push(action.payload);
      })
      .addCase(updateCreditReport.fulfilled, (state, action) => {
        const index = state.creditReports.findIndex(report => report._id === action.payload._id);
        if (index !== -1) {
          state.creditReports[index] = action.payload;
        }
      })
      .addCase(deleteCreditReport.fulfilled, (state, action) => {
        state.creditReports = state.creditReports.filter(report => report._id !== action.payload);
      });
  },
});

export default creditReportsSlice.reducer;