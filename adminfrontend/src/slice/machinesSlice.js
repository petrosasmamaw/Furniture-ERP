import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const API_BASE = 'http://localhost:5000/api';

export const fetchMachines = createAsyncThunk('machines/fetchMachines', async () => {
  const response = await axios.get(`${API_BASE}/machines`);
  return response.data;
});

export const fetchMachineById = createAsyncThunk('machines/fetchMachineById', async (id) => {
  const response = await axios.get(`${API_BASE}/machines/${id}`);
  return response.data;
});

export const createMachine = createAsyncThunk('machines/createMachine', async (machine) => {
  const response = await axios.post(`${API_BASE}/machines`, machine);
  return response.data;
});

export const updateMachine = createAsyncThunk('machines/updateMachine', async ({ id, machine }) => {
  const response = await axios.put(`${API_BASE}/machines/${id}`, machine);
  return response.data;
});

export const deleteMachine = createAsyncThunk('machines/deleteMachine', async (id) => {
  await axios.delete(`${API_BASE}/machines/${id}`);
  return id;
});

const machinesSlice = createSlice({
  name: 'machines',
  initialState: {
    machines: [],
    currentMachine: null,
    status: 'idle',
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchMachines.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchMachines.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.machines = action.payload;
      })
      .addCase(fetchMachines.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      })
      .addCase(fetchMachineById.fulfilled, (state, action) => {
        state.currentMachine = action.payload;
      })
      .addCase(createMachine.fulfilled, (state, action) => {
        state.machines.push(action.payload);
      })
      .addCase(updateMachine.fulfilled, (state, action) => {
        const index = state.machines.findIndex(machine => machine._id === action.payload._id);
        if (index !== -1) {
          state.machines[index] = action.payload;
        }
      })
      .addCase(deleteMachine.fulfilled, (state, action) => {
        state.machines = state.machines.filter(machine => machine._id !== action.payload);
      });
  },
});

export default machinesSlice.reducer;