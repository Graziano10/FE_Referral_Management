import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { ApiError } from "./listProfilesThunk";
import { AxiosError } from "node_modules/axios/index.cjs";

type DeleteProfileResponse = {
  message: string;
  profile: { _id: string; email: string };
};

export const deleteProfileThunk = createAsyncThunk<
  { _id: string; email: string }, // return type
  { profileId: string; token: string }, // params
  { rejectValue: ApiError }
>(
  "profiles/deleteProfile",
  async ({ profileId, token }, { rejectWithValue }) => {
    try {
      const res = await axios.delete<DeleteProfileResponse>(
        `${import.meta.env.VITE_API_URL}/profile/${profileId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      return res.data.profile;
    } catch (err) {
      const error = err as AxiosError<ApiError>;
      return rejectWithValue(
        error.response?.data || { message: "Errore eliminazione profilo" }
      );
    }
  }
);
