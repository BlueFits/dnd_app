import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

interface User {
  id: string;
  username: string;
  email: string;
  isAuthenticated: boolean;
}

interface UserState {
  user: User | null;
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
}

const initialState: UserState = {
  user: null,
  status: 'idle',
  error: null,
};

// Async thunk for login
export const loginUser = createAsyncThunk(
  'user/login',
  async (
    credentials: { username: string; password: string },
    { rejectWithValue },
  ) => {
    try {
      const response = await new Promise<User>((resolve) => {
        setTimeout(() => {
          resolve({
            id: '1',
            username: credentials.username,
            email: `${credentials.username}@example.com`,
            isAuthenticated: true,
          });
        }, 1000);
      });
      return response;
    } catch (error: unknown) {
      if (error instanceof Error) {
        return rejectWithValue(error.message);
      }
      return rejectWithValue('Failed to login');
    }
  },
);

// Async thunk for logout
export const logoutUser = createAsyncThunk(
  'user/logout',
  async (_, { rejectWithValue }) => {
    try {
      await new Promise<void>((resolve) => {
        setTimeout(resolve, 1000);
      });
      return null;
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (err) {
      return rejectWithValue('Failed to logout');
    }
  },
);

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Login cases
      .addCase(loginUser.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.user = action.payload;
        state.error = null;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload as string;
      })
      // Logout cases
      .addCase(logoutUser.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(logoutUser.fulfilled, (state) => {
        state.status = 'succeeded';
        state.user = null;
        state.error = null;
      })
      .addCase(logoutUser.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload as string;
      });
  },
});

export const { clearError } = userSlice.actions;
export default userSlice.reducer;
