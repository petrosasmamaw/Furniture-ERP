import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const API_BASE = 'http://localhost:5000/api';

export const fetchMaterialReports = createAsyncThunk('materialReports/fetchMaterialReports', async () => {
  const response = await axios.get(`${API_BASE}/material-reports`);
  return response.data;
});

export const fetchMaterialReportById = createAsyncThunk('materialReports/fetchMaterialReportById', async (id) => {
  const response = await axios.get(`${API_BASE}/material-reports/${id}`);
  return response.data;
});

export const createMaterialReport = createAsyncThunk('materialReports/createMaterialReport', async (report) => {
  const response = await axios.post(`${API_BASE}/material-reports`, report);
  return response.data;
});

export const updateMaterialReport = createAsyncThunk('materialReports/updateMaterialReport', async ({ id, report }) => {
  const response = await axios.put(`${API_BASE}/material-reports/${id}`, report);
  return response.data;
});

export const deleteMaterialReport = createAsyncThunk('materialReports/deleteMaterialReport', async (id) => {
  await axios.delete(`${API_BASE}/material-reports/${id}`);
  return id;
});

const materialReportsSlice = createSlice({
  name: 'materialReports',
  initialState: {
    materialReports: [],
    currentMaterialReport: null,
    status: 'idle',
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchMaterialReports.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchMaterialReports.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.materialReports = action.payload;
      })
      .addCase(fetchMaterialReports.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      })
      .addCase(fetchMaterialReportById.fulfilled, (state, action) => {
        state.currentMaterialReport = action.payload;
      })
      .addCase(createMaterialReport.fulfilled, (state, action) => {
        state.materialReports.push(action.payload);
      })
      .addCase(updateMaterialReport.fulfilled, (state, action) => {
        const index = state.materialReports.findIndex(report => report._id === action.payload._id);
        if (index !== -1) {
          state.materialReports[index] = action.payload;
        }
      })
      .addCase(deleteMaterialReport.fulfilled, (state, action) => {
        state.materialReports = state.materialReports.filter(report => report._id !== action.payload);
      });
  },
});

export default materialReportsSlice.reducer;