// src/features/auth/loginThunk.ts
import axios from "axios";
import { createAsyncThunk } from "@reduxjs/toolkit";
import { AxiosError } from "node_modules/axios/index.cjs";

/** Payload richiesto dal tuo BE */
export type LoginRequest = {
  email: string;
  password: string;
};

/** Risposta del tuo endpoint */
export type LoginResponse = {
  profile: {
    id: string;
    email: string;
    firstName?: string;
    lastName?: string;
  };
  token: string;
};

/** Possibile forma di errore restituita dal BE */
export type BackendError = {
  message: string;
  errors?: Array<{ field: string; message: string }>;
};

/** Istanza axios minimale (puoi sostituirla con la tua globale) */
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL ?? "http://localhost:3000",
  timeout: 15000,
});

/** Thunk di login */
export const loginThunk = createAsyncThunk<
  LoginResponse, // tipo del valore "fulfilled"
  LoginRequest, // tipo dell'argomento passato al dispatch
  { rejectValue: BackendError | { message: string } } // tipo del valore "rejected"
>("auth/login", async (payload, { rejectWithValue }) => {
  try {
    // Il tuo router usa /profile/login
    const { data } = await api.post<LoginResponse>("/profile/login", {
      email: payload.email.trim().toLowerCase(),
      password: payload.password,
    });

    localStorage.setItem("token", data.token);
    return data; // { profile, token }
  } catch (err) {
    const e = err as AxiosError<BackendError>;
    if (e.response?.data) {
      return rejectWithValue(e.response.data);
    }
    return rejectWithValue({ message: e.message || "Network error" });
  }
});
