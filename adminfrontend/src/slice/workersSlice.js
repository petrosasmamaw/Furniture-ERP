import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const API_BASE = 'http://localhost:5000/api';

export const fetchWorkers = createAsyncThunk('workers/fetchWorkers', async () => {
  const response = await axios.get(`${API_BASE}/workers`);
  return response.data;
});

export const fetchWorkerById = createAsyncThunk('workers/fetchWorkerById', async (id) => {
  const response = await axios.get(`${API_BASE}/workers/${id}`);
  return response.data;
});

export const createWorker = createAsyncThunk('workers/createWorker', async (worker) => {
  const response = await axios.post(`${API_BASE}/workers`, worker);
  return response.data;
});

export const updateWorker = createAsyncThunk('workers/updateWorker', async ({ id, worker }) => {
  const response = await axios.put(`${API_BASE}/workers/${id}`, worker);
  return response.data;
});

export const deleteWorker = createAsyncThunk('workers/deleteWorker', async (id) => {
  await axios.delete(`${API_BASE}/workers/${id}`);
  return id;
});

const workersSlice = createSlice({
  name: 'workers',
  initialState: {
    workers: [],
    currentWorker: null,
    status: 'idle',
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchWorkers.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchWorkers.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.workers = action.payload;
      })
      .addCase(fetchWorkers.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      })
      .addCase(fetchWorkerById.fulfilled, (state, action) => {
        state.currentWorker = action.payload;
      })
      .addCase(createWorker.fulfilled, (state, action) => {
        state.workers.push(action.payload);
      })
      .addCase(updateWorker.fulfilled, (state, action) => {
        const index = state.workers.findIndex(worker => worker._id === action.payload._id);
        if (index !== -1) {
          state.workers[index] = action.payload;
        }
      })
      .addCase(deleteWorker.fulfilled, (state, action) => {
        state.workers = state.workers.filter(worker => worker._id !== action.payload);
      });
  },
});

export default workersSlice.reducer;