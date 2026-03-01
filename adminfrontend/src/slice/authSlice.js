import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { supabase } from '../lib/supabaseClient';

export const signUp = createAsyncThunk('auth/signUp', async ({ email, password }, { rejectWithValue }) => {
  const { data, error } = await supabase.auth.signUp({ email, password });
  if (error) return rejectWithValue(error.message);
  return data;
});

export const signIn = createAsyncThunk('auth/signIn', async ({ email, password }, { rejectWithValue }) => {
  const { data, error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) return rejectWithValue(error.message);
  return data;
});

export const signOut = createAsyncThunk('auth/signOut', async (_, { rejectWithValue }) => {
  const { error } = await supabase.auth.signOut();
  if (error) return rejectWithValue(error.message);
  return {};
});

export const loadSession = createAsyncThunk('auth/loadSession', async (_, { rejectWithValue }) => {
  const { data, error } = await supabase.auth.getSession();
  if (error) return rejectWithValue(error.message);
  return data.session || null;
});

export const resetPassword = createAsyncThunk('auth/resetPassword', async ({ email }, { rejectWithValue }) => {
  const { data, error } = await supabase.auth.resetPasswordForEmail(email, { redirectTo: window.location.origin });
  if (error) return rejectWithValue(error.message);
  return data;
});

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    session: null,
    loading: false,
    error: null,
  },
  reducers: {
    setSession(state, action) {
      state.session = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(signUp.pending, (state) => { state.loading = true; state.error = null; })
      .addCase(signUp.fulfilled, (state, action) => { state.loading = false; state.session = action.payload.session || null; })
      .addCase(signUp.rejected, (state, action) => { state.loading = false; state.error = action.payload || action.error.message; })
      .addCase(signIn.pending, (state) => { state.loading = true; state.error = null; })
      .addCase(signIn.fulfilled, (state, action) => { state.loading = false; state.session = action.payload.session || null; })
      .addCase(signIn.rejected, (state, action) => { state.loading = false; state.error = action.payload || action.error.message; })
      .addCase(signOut.fulfilled, (state) => { state.session = null; })
      .addCase(loadSession.fulfilled, (state, action) => { state.session = action.payload; })
      .addCase(loadSession.rejected, (state, action) => { state.error = action.payload || action.error.message; });
  }
});

export const { setSession } = authSlice.actions;
export default authSlice.reducer;
