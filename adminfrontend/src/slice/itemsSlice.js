import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const API_BASE = 'http://localhost:5000/api';

export const fetchItems = createAsyncThunk('items/fetchItems', async () => {
  const response = await axios.get(`${API_BASE}/items`);
  return response.data;
});

export const fetchItemById = createAsyncThunk('items/fetchItemById', async (id) => {
  const response = await axios.get(`${API_BASE}/items/${id}`);
  return response.data;
});

export const createItem = createAsyncThunk('items/createItem', async (item) => {
  const response = await axios.post(`${API_BASE}/items`, item);
  return response.data;
});

export const updateItem = createAsyncThunk('items/updateItem', async ({ id, item }) => {
  const response = await axios.put(`${API_BASE}/items/${id}`, item);
  return response.data;
});

export const deleteItem = createAsyncThunk('items/deleteItem', async (id) => {
  await axios.delete(`${API_BASE}/items/${id}`);
  return id;
});

const itemsSlice = createSlice({
  name: 'items',
  initialState: {
    items: [],
    currentItem: null,
    status: 'idle',
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchItems.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchItems.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.items = action.payload;
      })
      .addCase(fetchItems.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      })
      .addCase(fetchItemById.fulfilled, (state, action) => {
        state.currentItem = action.payload;
      })
      .addCase(createItem.fulfilled, (state, action) => {
        state.items.push(action.payload);
      })
      .addCase(updateItem.fulfilled, (state, action) => {
        const index = state.items.findIndex(item => item._id === action.payload._id);
        if (index !== -1) {
          state.items[index] = action.payload;
        }
      })
      .addCase(deleteItem.fulfilled, (state, action) => {
        state.items = state.items.filter(item => item._id !== action.payload);
      });
  },
});

export default itemsSlice.reducer;