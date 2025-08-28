import { createAsyncThunk } from "@reduxjs/toolkit";
import { api } from "../../api/client";

/** ---- Tipi di dominio coerenti con BE ---- */
export type ProfileDoc = {
  _id: string;
  user_id?: number;
  firstName?: string;
  lastName?: string;
  email: string;
  phone?: string;
  companyName?: string;
  vatNumber?: string;
  region?: string;
  verified?: boolean;
  referralCode?: string;
  referredBy?: string;
  referralsCount?: number;
  dateJoined?: string;
  createdAt?: string;
  updatedAt?: string;
};

export type ReferralEmailsPage = {
  total: number; // totale referrals
  page: number; // pagina corrente
  limit: number; // per_page
  count: number; // elementi in questa pagina
  emails: string[]; // lista email referrals
};

export type GetProfileByIdResponse = {
  ok: boolean;
  profile: ProfileDoc;
  referrals: ReferralEmailsPage;
};

export type ApiError = { status?: number; message: string; data?: unknown };

/** ---- Input ---- */
export type GetProfileByIdParams = {
  profileId: string;
  page?: number;
  limit?: number;
  fields?: string; // es: "firstName,lastName,email"
  token: string; // 👈 aggiunto qui
};

/** ---- Thunk ---- */
export const getProfileByIdThunk = createAsyncThunk<
  GetProfileByIdResponse, // fulfilled value
  GetProfileByIdParams, // arg
  { rejectValue: ApiError } // rejected value
>("profiles/getById", async (params, { rejectWithValue }) => {
  try {
    const { profileId, page, limit, fields, token } = params;

    const { data } = await api.get<GetProfileByIdResponse>(
      `${import.meta.env.VITE_API_URL}/profile/${profileId}`,
      {
        params: {
          ...(page ? { page } : {}),
          ...(limit ? { limit } : {}),
          ...(fields ? { fields } : {}),
        },
        headers: {
          Authorization: `Bearer ${token}`, // 👈 aggiunto qui
        },
      }
    );

    return data;
  } catch (e) {
    return rejectWithValue(e as ApiError);
  }
});
