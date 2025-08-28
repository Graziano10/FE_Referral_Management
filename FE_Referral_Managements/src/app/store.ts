import { profilesReducer } from "../features/profiles/profilesSlice";
import { authReducer } from "../features/auth/authSlice";
import { configureStore } from "@reduxjs/toolkit";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    profiles: profilesReducer, // 👈 adesso la chiave è coerente
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
