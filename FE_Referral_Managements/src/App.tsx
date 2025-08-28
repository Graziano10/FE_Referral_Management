// src/App.tsx
import React, { Suspense, useMemo, useCallback, useEffect } from "react";
import {
  Routes,
  Route,
  useLocation,
  Navigate,
  useNavigate,
} from "react-router-dom";
import Navbar from "./components/ui/Navbar";
import { useAppSelector, useAppDispatch } from "./hooks";
import {
  selectAuth,
  selectIsAuthenticated,
  logout,
} from "./features/auth/authSlice";
import Badge from "./components/ui/Badge";
import Avatar from "./components/ui/Avatar";
import { api } from "./api/client";

// Lazy pages
const Home = React.lazy(() => import("./pages/Home"));
const RankOverview = React.lazy(() => import("./pages/RankOverview"));
const NotFound = React.lazy(() => import("./pages/NotFound"));
const Login = React.lazy(() => import("./pages/Login"));

/** Helper semplice: legge il token da localStorage */
function getToken(): string | null {
  return localStorage.getItem("token");
}

/** Route protetta: consente accesso se Redux è autenticato OPPURE se esiste token in LS */
function ProtectedRoute({ children }: { children: React.ReactElement }) {
  const isAuthed = useAppSelector(selectIsAuthenticated);
  const token = getToken();
  if (isAuthed || token) return children;
  return <Navigate to="/login" replace />;
}

export default function App() {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const auth = useAppSelector(selectAuth);
  const isAuthed = useAppSelector(selectIsAuthenticated);

  // Imposta l'Authorization header all'avvio/refresh se troviamo il token
  useEffect(() => {
    const token = getToken();
    if (token) {
      api.defaults.headers.common.Authorization = `Bearer ${token}`;
    } else {
      delete api.defaults.headers.common.Authorization;
    }
  }, []);

  // Nascondi navbar su /login
  const hideNavbar = useMemo(
    () => location.pathname === "/login",
    [location.pathname]
  );

  // Nome visualizzato
  const displayName = useMemo(() => {
    const p = auth.profile;
    if (!p) return "Utente";
    if (p.firstName || p.lastName) {
      return (
        `${p.firstName ?? ""} ${p.lastName ?? ""}`.trim() || p.email || "Utente"
      );
    }
    return p.email ?? "Utente";
  }, [auth.profile]);

  // Logout minimale: rimuove token e resetta Redux
  const handleLogout = useCallback(() => {
    try {
      localStorage.removeItem("token");
      delete api.defaults.headers.common.Authorization;
    } finally {
      dispatch(logout());
      navigate("/login", { replace: true });
    }
  }, [dispatch, navigate]);

  const navLinks = useMemo(
    () => [
      { label: "Home", to: "/", end: true },
      { label: "Ranking", to: "/rank" },
    ],
    []
  );

  return (
    <div className="min-h-screen bg-gray-50 text-neutral-900">
      {!hideNavbar && (
        <Navbar
          logo={<img src="/vite.svg" alt="logo" className="h-6" />}
          links={navLinks}
          actions={
            isAuthed || getToken() ? (
              <div className="flex items-center gap-2">
                <Badge
                  color="brand"
                  variant="soft"
                  size="md"
                  className="pl-1.5 pr-2"
                >
                  <span className="mr-1.5 -ml-0.5">
                    <Avatar name={displayName} size="xs" />
                  </span>
                  <span className="hidden sm:inline">{displayName}</span>
                </Badge>
                <button
                  type="button"
                  onClick={handleLogout}
                  className="rounded-md border-2 border-neutral-700 px-3 py-1.5 text-sm hover:bg-neutral-100"
                  aria-label="Logout"
                  title="Logout"
                >
                  Logout
                </button>
              </div>
            ) : null
          }
        />
      )}

      <main className="mx-auto max-w-7xl px-4 py-6">
        <Suspense
          fallback={
            <div className="py-16 text-center text-neutral-600">
              Caricamento…
            </div>
          }
        >
          <Routes>
            {/* Public */}
            <Route path="/login" element={<Login />} />

            {/* Protected (consentono passaggio se esiste token in LS) */}
            <Route
              path="/"
              element={
                <ProtectedRoute>
                  <Home />
                </ProtectedRoute>
              }
            />
            <Route
              path="/home"
              element={
                <ProtectedRoute>
                  <Home />
                </ProtectedRoute>
              }
            />

            <Route
              path="/rank"
              element={
                <ProtectedRoute>
                  <RankOverview referralsCount={1} />
                </ProtectedRoute>
              }
            />

            {/* 404 */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Suspense>
      </main>
    </div>
  );
}
