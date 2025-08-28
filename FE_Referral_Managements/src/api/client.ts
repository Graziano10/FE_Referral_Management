// src/api/client.ts
import axios from "axios";

/** Chiave unica del token in localStorage */
export const TOKEN_KEY = "token";

/** API client */
export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL ?? "http://localhost:3000",
  timeout: 15_000,
});

/** Helpers token (solo localStorage) */
export function setAuthToken(token: string) {
  localStorage.setItem(TOKEN_KEY, token);
  // Non settiamo api.defaults.headers.common: evitiamo problemi di typing/spread
}

export function clearAuthToken() {
  localStorage.removeItem(TOKEN_KEY);
  // Non serve toccare api.defaults: il request interceptor leggerà da LS
}

/** Legge il token (solo localStorage) */
function readToken(): string | null {
  return localStorage.getItem(TOKEN_KEY);
}

/** Facoltativo: callback su 401 per orchestrare logout/redirect senza coupling */
let onUnauthorized: (() => void) | null = null;
export function setOnUnauthorized(handler: () => void) {
  onUnauthorized = handler;
}

/** ---------- Interceptors ---------- */

/* Request: Authorization + X-Requested-With
   NOTA: nessun tipo esplicito sul parametro `config`: lasciamo inferire ad axios,
   così non scatta l'errore “No overload matches this call”. */
api.interceptors.request.use((config) => {
  const token = readToken();

  config.headers = config.headers || {};

  config.headers["X-Requested-With"] = "XMLHttpRequest";
  if (token) {
    config.headers["Authorization"] = `Bearer ${token}`;
  }
  return config;
});

export type ErrorBody = {
  message?: string;
  error?: string;
  [k: string]: unknown;
};

/* Response: normalizza errori -> { status, message, data } */
api.interceptors.response.use(
  (res) => res,
  (err: unknown) => {
    const e = (err ?? {}) as {
      response?: { status?: number; data?: ErrorBody };
      message?: string;
    };

    const status = e.response?.status;
    const data = e.response?.data;
    const message =
      (typeof data?.message === "string" && data.message) ||
      (typeof data?.error === "string" && data.error) ||
      e.message ||
      "Errore di rete";

    if (status === 401 && onUnauthorized) {
      onUnauthorized(); // es. dispatch(logout()); navigate("/login");
    }

    return Promise.reject({
      status,
      message,
      data,
    } as { status?: number; message: string; data?: unknown });
  }
);
