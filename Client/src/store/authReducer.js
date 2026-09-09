import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { login as loginRequest, register as registerRequest, loginByToken } from '../api/authApi.js';

// בדיוק אותה לוגיקה שהייתה ב-AuthContext: אם יש טוקן שמור - מאמתים אותו מול השרת בעת עליית האפליקציה.
export const initAuth = createAsyncThunk('auth/init', async () => {
  const token = localStorage.getItem('token');
  if (!token) return null;
  try {
    const data = await loginByToken();
    localStorage.setItem('token', data.token);
    return data.user;
  } catch {
    localStorage.removeItem('token');
    return null;
  }
});

export const login = createAsyncThunk('auth/login', async ({ tz, password }) => {
  const data = await loginRequest(tz, password);
  localStorage.setItem('token', data.token);
  return data.user;
});

export const register = createAsyncThunk('auth/register', async (payload) => {
  const data = await registerRequest(payload);
  localStorage.setItem('token', data.token);
  return data.user;
});

const initialState = {
  user: null,
  loading: true
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logout: (state) => {
      localStorage.removeItem('token');
      state.user = null;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(initAuth.fulfilled, (state, action) => {
        state.user = action.payload;
        state.loading = false;
      })
      .addCase(initAuth.rejected, (state) => {
        state.user = null;
        state.loading = false;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.user = action.payload;
      })
      .addCase(register.fulfilled, (state, action) => {
        state.user = action.payload;
      });
  }
});

export const { logout } = authSlice.actions;
export default authSlice.reducer;

// סלקטורים - כמו שה-useAuth הישן החזיר user/loading/isAdmin
export const selectUser = (state) => state.auth.user;
export const selectAuthLoading = (state) => state.auth.loading;
export const selectIsAdmin = (state) => state.auth.user?.role === 'admin';
