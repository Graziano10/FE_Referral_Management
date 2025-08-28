// src/features/auth/authSlice.ts
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { loginThunk, type LoginResponse } from "./loginThunk";
import { RootState } from "@/app/store";

type AuthState = {
  loading: boolean;
  error: string | null;
  profile: LoginResponse["profile"] | null;
  token: string | null;
};

const initialState: AuthState = {
  loading: false,
  error: null,
  profile: null,
  token: null,
};

export const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    logout(state) {
      state.profile = null;
      state.token = null;
      state.error = null;
      state.loading = false;
    },
    setSession(state, action: PayloadAction<LoginResponse>) {
      state.profile = action.payload.profile;
      state.token = action.payload.token;
      state.error = null;
      state.loading = false;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        state.profile = action.payload.profile;
        state.token = action.payload.token;
      })
      .addCase(loginThunk.rejected, (state, action) => {
        state.loading = false;

        const p = action.payload as
          | {
              message: string;
              errors?: Array<{ field: string; message: string }>;
            }
          | { message: string }
          | undefined;

        if (
          p &&
          "errors" in p &&
          Array.isArray(p.errors) &&
          p.errors.length > 0
        ) {
          state.error =
            p.errors.map((i) => `${i.field}: ${i.message}`).join(" | ") ||
            p.message ||
            "Validation error";
          return;
        }

        state.error = p?.message ?? "Login failed";
      });
  },
});

export const { logout, setSession } = authSlice.actions;

export const selectAuth = (s: RootState) => s.auth;
export const selectIsAuthenticated = (s: RootState) => Boolean(s.auth.token);

export const authReducer = authSlice.reducer;
