import { createAsyncThunk } from "@reduxjs/toolkit";
import { api } from "../../api/client";

/** ---- Tipi ---- */
export type ProfileDoc = {
  _id: string;
  user_id: string;
  email: string;
  firstName?: string;
  lastName?: string;
  companyName?: string;
  vatNumber?: string;
  region?: string;
  phone?: string;
  verified?: boolean;
  referredBy?: string;
  referralCode?: string;
  createdAt?: string;
  updatedAt?: string;
};

export type ApiError = { status?: number; message: string; data?: unknown };

export type ListProfilesParams = {
  token: string;

  // filtri lato BE
  q?: string;
  region?: string;
  email?: string;
  companyName?: string;
  vatNumber?: string;
  referredBy?: string;
  ref?: string;
  type?: "azienda" | "persona";
  verified?: boolean;

  // ordinamento/paginazione
  sortBy?:
    | "createdAt"
    | "dateJoined"
    | "lastLogin"
    | "lastActivity"
    | "firstName"
    | "lastName"
    | "email"
    | "companyName";
  sortDir?: "asc" | "desc";
  limit?: 10 | 20 | 50;
  cursor?: string;
  page?: number; // 👈 pagina corrente
};

/** ---- Risposta dal BE ---- */
export type ListProfilesResponse = {
  docs: ProfileDoc[];
  totalDocs: number;
  totalPages: number;
  page: number;
  limit: number;
};

/** ---- Thunk: GET /profiles ---- */
export const listProfilesThunk = createAsyncThunk<
  ListProfilesResponse,
  ListProfilesParams,
  { rejectValue: ApiError }
>("profiles/list", async (params, { rejectWithValue }) => {
  try {
    const { token, verified, ...filters } = params;

    const { data } = await api.get<ListProfilesResponse>(`/profile`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      params: {
        ...filters,
        ...(verified !== undefined
          ? { verified: verified ? "true" : "false" }
          : {}),
      },
    });

    return data;
  } catch (e) {
    return rejectWithValue(e as ApiError);
  }
});
