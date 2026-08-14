import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import authService from "../services/authService";

const user = JSON.parse(localStorage.getItem("user"));

const initialState = {
  user: user ? user : null,
  error: false,
  success: false,
  loading: false,
  successMessage: "",
};

// Register an user and sign in
export const register = createAsyncThunk(
  "auth/register",
  async (user, thunkAPI) => {
    try {
      const data = await authService.register(user);
      return data;
    } catch (error) {
      const errors = error.data?.errors;

      if (Array.isArray(errors) && errors.length > 0) {
        const message = errors
          .map((err) => (typeof err === "string" ? err : err.msg))
          .join(". ");
        return thunkAPI.rejectWithValue(message);
      }

      const message =
        error.data?.message || error.message || "Something went wrong";
      return thunkAPI.rejectWithValue(message);
    }
  },
);

// Login an user
export const login = createAsyncThunk("auth/login", async (user, thunkAPI) => {
  try {
    const data = await authService.login(user);
    return data;
  } catch (error) {
    const message =
      error.data?.message || error.message || "Something went wrong";
    return thunkAPI.rejectWithValue(message);
  }
});

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    reset: (state) => {
      state.loading = false;
      state.error = false;
      state.successMessage = "";
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(register.pending, (state) => {
        state.loading = true;
        state.error = false;
        state.successMessage = false;
      })
      .addCase(register.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.error = null;
        state.user = action.payload;
        state.successMessage = "User registered successfully";
      })
      .addCase(register.rejected, (state, action) => {
        state.loading = false;
        state.success = false;
        state.error =
          typeof action.payload === "string"
            ? action.payload
            : "Something went wrong";
        state.user = null;
        state.successMessage = "";
      })
      .addCase(login.pending, (state) => {
        state.loading = true;
        state.success = false;
        state.error = false;
        state.successMessage = "";
      })
      .addCase(login.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.error = null;
        state.user = action.payload;
        state.successMessage = "User logged in successfully";
      })
      .addCase(login.rejected, (state, action) => {
        state.loading = false;
        state.success = false;
        state.error =
          typeof action.payload === "string"
            ? action.payload
            : "Something went wrong";
        state.user = null;
        state.successMessage = "";
      });
  },
});

export const { reset } = authSlice.actions;

export default authSlice.reducer;
