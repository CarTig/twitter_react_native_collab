import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import myAxios from '../(tabs)/utils/interceptor';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const registerUser = createAsyncThunk('auth/registerUser', async (userData) => {
  const response = await myAxios.post('/register', userData);
  return response.data;
});

export const loginUser = createAsyncThunk('auth/loginUser', async (userData) => {
  const response = await myAxios.post('/login', userData);
  await AsyncStorage.setItem('token', response.data.token);
  return response.data;
});

const authSlice = createSlice({
  name: 'auth',
  initialState: { user: null, token: null },
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(registerUser.fulfilled, (state, action) => {
      state.user = action.payload;
    });
    builder.addCase(loginUser.fulfilled, (state, action) => {
      state.user = action.payload.user;
      state.token = action.payload.token;
    });
  },
});

export default authSlice.reducer;