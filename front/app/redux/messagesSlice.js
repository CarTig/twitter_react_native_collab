import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import myAxios from '../../app/(tabs)/utils/interceptor';

export const fetchMessages = createAsyncThunk('messages/fetchMessages', async (userId) => {
  const response = await myAxios.get(`/messages/${userId}`);
  return response.data;
});

const messagesSlice = createSlice({
  name: 'messages',
  initialState: { messages: [] },
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(fetchMessages.fulfilled, (state, action) => {
      state.messages = action.payload;
    });
  },
});

export default messagesSlice.reducer;