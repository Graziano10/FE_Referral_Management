// src/utils/fetchAllProfiles.ts
import { AppDispatch } from "../app/store";
import {
  listProfilesThunk,
  type ProfileDoc,
} from "../features/profiles/listProfilesThunk";

type FetchProfilesParams = {
  dispatch: AppDispatch;
  token: string;
  limit?: 10 | 20 | 50;
  q?: string;
  region?: string;
  type?: "azienda" | "persona";
  verified?: boolean;
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
};

export async function fetchAllProfiles({
  dispatch,
  token,
  limit = 50 as const,
  q,
  region,
  type,
  verified,
  sortBy = "createdAt",
  sortDir = "desc",
}: FetchProfilesParams): Promise<ProfileDoc[]> {
  const all: ProfileDoc[] = [];
  let page = 1;
  let totalPages = 1;

  while (page <= totalPages) {
    const res = await dispatch(
      listProfilesThunk({
        token,
        limit,
        page,
        q,
        region,
        type,
        verified,
        sortBy,
        sortDir,
      })
    ).unwrap();

    all.push(...res.docs);
    totalPages = res.totalPages;
    page++;
  }
  return all;
}
