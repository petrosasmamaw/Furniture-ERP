import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const API_BASE = 'http://localhost:5000/api';

export const fetchCredits = createAsyncThunk('credits/fetchCredits', async () => {
  const response = await axios.get(`${API_BASE}/credits`);
  return response.data;
});

export const fetchCreditById = createAsyncThunk('credits/fetchCreditById', async (id) => {
  const response = await axios.get(`${API_BASE}/credits/${id}`);
  return response.data;
});

export const createCredit = createAsyncThunk('credits/createCredit', async (credit) => {
  const response = await axios.post(`${API_BASE}/credits`, credit);
  return response.data;
});

export const updateCredit = createAsyncThunk('credits/updateCredit', async ({ id, credit }) => {
  const response = await axios.put(`${API_BASE}/credits/${id}`, credit);
  return response.data;
});

export const deleteCredit = createAsyncThunk('credits/deleteCredit', async (id) => {
  await axios.delete(`${API_BASE}/credits/${id}`);
  return id;
});

const creditsSlice = createSlice({
  name: 'credits',
  initialState: {
    credits: [],
    currentCredit: null,
    status: 'idle',
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchCredits.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchCredits.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.credits = action.payload;
      })
      .addCase(fetchCredits.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      })
      .addCase(fetchCreditById.fulfilled, (state, action) => {
        state.currentCredit = action.payload;
      })
      .addCase(createCredit.fulfilled, (state, action) => {
        state.credits.push(action.payload);
      })
      .addCase(updateCredit.fulfilled, (state, action) => {
        const index = state.credits.findIndex(credit => credit._id === action.payload._id);
        if (index !== -1) {
          state.credits[index] = action.payload;
        }
      })
      .addCase(deleteCredit.fulfilled, (state, action) => {
        state.credits = state.credits.filter(credit => credit._id !== action.payload);
      });
  },
});

export default creditsSlice.reducer;