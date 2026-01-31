import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const API_BASE = 'http://localhost:5000/api';

export const fetchMachineReports = createAsyncThunk('machineReports/fetchMachineReports', async () => {
  const response = await axios.get(`${API_BASE}/machine-reports`);
  return response.data;
});

export const fetchMachineReportById = createAsyncThunk('machineReports/fetchMachineReportById', async (id) => {
  const response = await axios.get(`${API_BASE}/machine-reports/${id}`);
  return response.data;
});

export const createMachineReport = createAsyncThunk('machineReports/createMachineReport', async (report) => {
  const response = await axios.post(`${API_BASE}/machine-reports`, report);
  return response.data;
});

export const updateMachineReport = createAsyncThunk('machineReports/updateMachineReport', async ({ id, report }) => {
  const response = await axios.put(`${API_BASE}/machine-reports/${id}`, report);
  return response.data;
});

export const deleteMachineReport = createAsyncThunk('machineReports/deleteMachineReport', async (id) => {
  await axios.delete(`${API_BASE}/machine-reports/${id}`);
  return id;
});

const machineReportsSlice = createSlice({
  name: 'machineReports',
  initialState: {
    machineReports: [],
    currentMachineReport: null,
    status: 'idle',
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchMachineReports.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchMachineReports.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.machineReports = action.payload;
      })
      .addCase(fetchMachineReports.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      })
      .addCase(fetchMachineReportById.fulfilled, (state, action) => {
        state.currentMachineReport = action.payload;
      })
      .addCase(createMachineReport.fulfilled, (state, action) => {
        state.machineReports.push(action.payload);
      })
      .addCase(updateMachineReport.fulfilled, (state, action) => {
        const index = state.machineReports.findIndex(report => report._id === action.payload._id);
        if (index !== -1) {
          state.machineReports[index] = action.payload;
        }
      })
      .addCase(deleteMachineReport.fulfilled, (state, action) => {
        state.machineReports = state.machineReports.filter(report => report._id !== action.payload);
      });
  },
});

export default machineReportsSlice.reducer;