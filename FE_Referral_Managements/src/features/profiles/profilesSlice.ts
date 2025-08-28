import { createSlice } from "@reduxjs/toolkit";
import { listProfilesThunk, ProfileDoc } from "./listProfilesThunk";
import {
  getProfileByIdThunk,
  type GetProfileByIdResponse,
} from "./getProfileByIdThunk";
import type { RootState } from "@/app/store";

type ProfilesState = {
  list: {
    docs: ProfileDoc[];
    totalDocs: number;
    totalPages: number;
    page: number;
    limit: number;
  } | null;
  listLoading: boolean;
  listError: string | null;

  // dettaglio
  detail: GetProfileByIdResponse | null;
  detailLoading: boolean;
  detailError: string | null;
};

const initialState: ProfilesState = {
  list: null,
  listLoading: false,
  listError: null,

  detail: null,
  detailLoading: false,
  detailError: null,
};

export const profilesSlice = createSlice({
  name: "profiles",
  initialState,
  reducers: {
    resetProfiles(state) {
      state.list = null;
      state.listError = null;
    },
    resetProfileDetail(state) {
      state.detail = null;
      state.detailError = null;
    },
  },
  extraReducers: (builder) => {
    // ---- LISTA ----
    builder
      .addCase(listProfilesThunk.pending, (state) => {
        state.listLoading = true;
        state.listError = null;
      })
      .addCase(listProfilesThunk.fulfilled, (state, action) => {
        state.listLoading = false;
        state.list = action.payload;
      })
      .addCase(listProfilesThunk.rejected, (state, action) => {
        state.listLoading = false;
        state.listError =
          (action.payload as { message?: string })?.message ??
          "Errore nel caricamento dei profili";
      });

    // ---- DETTAGLIO ----
    builder
      .addCase(getProfileByIdThunk.pending, (state) => {
        state.detailLoading = true;
        state.detailError = null;
      })
      .addCase(getProfileByIdThunk.fulfilled, (state, action) => {
        state.detailLoading = false;
        state.detail = action.payload;
      })
      .addCase(getProfileByIdThunk.rejected, (state, action) => {
        state.detailLoading = false;
        state.detailError =
          (action.payload as { message?: string })?.message ??
          "Errore nel recupero del profilo";
      });
  },
});

export const { resetProfiles, resetProfileDetail } = profilesSlice.actions;

/** ---- Selectors ---- */
export const selectProfiles = (s: RootState) => s.profiles.list?.docs ?? [];
export const selectProfilesMeta = (s: RootState) =>
  s.profiles.list
    ? {
        totalDocs: s.profiles.list.totalDocs,
        totalPages: s.profiles.list.totalPages,
        page: s.profiles.list.page,
        limit: s.profiles.list.limit,
      }
    : { totalDocs: 0, totalPages: 1, page: 1, limit: 10 };

export const selectProfilesLoading = (s: RootState) => s.profiles.listLoading;
export const selectProfilesError = (s: RootState) => s.profiles.listError;

// dettaglio
export const selectProfileDetail = (s: RootState) => s.profiles.detail?.profile;
export const selectProfileReferrals = (s: RootState) =>
  s.profiles.detail?.referrals;
export const selectProfileDetailLoading = (s: RootState) =>
  s.profiles.detailLoading;
export const selectProfileDetailError = (s: RootState) =>
  s.profiles.detailError;

export const profilesReducer = profilesSlice.reducer;
