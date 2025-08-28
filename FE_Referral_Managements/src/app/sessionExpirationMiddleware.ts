// // src/app/sessionExpirationMiddleware.ts
// import type { Middleware } from "@reduxjs/toolkit";
// import { logoutUserThunk } from "../features/auth/logoutUserThunk";

// type RejectedAction = {
//   type: string;
//   payload?: { message?: string } | string | null;
//   error?: { message?: string } | null;
// };

// const extractMessage = (a: RejectedAction): string => {
//   if (typeof a.payload === "string") return a.payload;
//   if (a.payload && typeof a.payload === "object" && "message" in a.payload) {
//     return String(a.payload.message ?? "");
//   }
//   return a.error?.message ?? "";
// };

// export const sessionExpirationMiddleware: Middleware =
//   (store) => (next) => (action) => {
//     if (typeof action === "object" && action !== null && "type" in action) {
//       const a = action as RejectedAction;

//       if (a.type.endsWith("/rejected")) {
//         const msg = extractMessage(a).toLowerCase();
//         if (msg.includes("sessione scaduta")) {
//           console.warn("[Middleware] Sessione scaduta: logout automatico.");
//           store.dispatch(logoutUserThunk());
//           localStorage.removeItem("token");
//           localStorage.removeItem("role");
//           if (window.location.pathname !== "/login") {
//             window.location.href = "/login";
//           }
//         }
//       }
//     }
//     return next(action);
//   };
