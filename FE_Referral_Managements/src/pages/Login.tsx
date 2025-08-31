// src/pages/Login.tsx
import React, { useState } from "react";
import Card from "../components/ui/Card";
import { Icon } from "../ui/Icon";
import { Input } from "../components/ui/Input";
import Checkbox from "../components/ui/Checkbox";
import CTA_Button from "../components/ui/CTA_Button";
import LoadSpinner from "../components/ui/LoadSpinner";
import { Typography } from "../components/ui/Typography";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

import { useAppDispatch, useAppSelector } from "../hooks";
import { loginThunk } from "../features/auth/loginThunk";

type FormState = {
  email: string;
  password: string;
  remember: boolean;
};

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function Login() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const auth = useAppSelector((s) => s.auth);

  const [form, setForm] = useState<FormState>({
    email: "",
    password: "",
    remember: true,
  });
  const [showPwd, setShowPwd] = useState(false);
  const [errors, setErrors] = useState<{ email?: string; password?: string }>(
    {}
  );
  const [submitting, setSubmitting] = useState(false);

  const onChange =
    <K extends keyof FormState>(key: K) =>
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const value =
        key === "remember"
          ? (e.target as HTMLInputElement).checked
          : e.target.value;
      setForm((s) => ({ ...s, [key]: value as FormState[K] }));
    };

  const validate = () => {
    const next: typeof errors = {};
    if (!emailRegex.test(form.email))
      next.email = "Inserisci una email valida.";
    if (!form.password) next.password = "La password è obbligatoria.";
    setErrors(next);

    const firstError = next.email || next.password;
    return { ok: Object.keys(next).length === 0, firstError };
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const { ok, firstError } = validate();
    if (!ok) {
      toast.error(firstError ?? "Correggi gli errori evidenziati nel form.");
      return;
    }

    setSubmitting(true);
    const action = await dispatch(
      loginThunk({
        email: form.email.trim().toLowerCase(),
        password: form.password,
      })
    );
    setSubmitting(false);

    if (loginThunk.fulfilled.match(action)) {
      toast.success("Benvenuto!");
      // NB: attualmente il token viene salvato in localStorage dal thunk.
      // Se vuoi che 'remember' = false non persista il token, adeguiamo l'interceptor a leggere anche da sessionStorage.
      navigate("/home");
    } else if (loginThunk.rejected.match(action)) {
      const msg = action.payload?.message ?? "Credenziali non valide";
      toast.error(msg);
    }
  };

  const isLoading = submitting || auth.loading;

  return (
    <div className="min-h-screen grid place-items-center bg-neutral-50 px-4 py-10">
      <Card
        variant="outline"
        className="w-full max-w-md"
        title={
          <div className="flex flex-col items-center gap-3">
            {/* <img src={logo} alt="CRM Referral" className="h-12 w-12" /> */}
            <h1 className="text-2xl font-bold tracking-tight">Logo</h1>
            <span className="text-xl font-semibold">Accedi al tuo account</span>
          </div>
        }
        subtitle="Benvenuto nel CRM Referral. Inserisci le tue credenziali per continuare."
      >
        <form onSubmit={onSubmit} noValidate className="space-y-6">
          {/* Errori BE a vista (oltre al toast) */}
          {auth.error && (
            <div className="rounded-md border border-rose-200 bg-rose-50 px-3 py-2 text-sm text-rose-700">
              {auth.error}
            </div>
          )}

          <Input
            label="Email"
            type="email"
            autoComplete="email"
            placeholder="tu@azienda.com"
            value={form.email}
            onChange={onChange("email")}
            error={errors.email}
            required
            fullWidth
            endIcon={<Icon name="mail" />}
          />

          <div>
            <Input
              label="Password"
              type={showPwd ? "text" : "password"}
              autoComplete="current-password"
              placeholder="••••••••"
              value={form.password}
              onChange={onChange("password")}
              error={errors.password}
              required
              fullWidth
              endIcon={
                <button
                  type="button"
                  aria-label={showPwd ? "Nascondi password" : "Mostra password"}
                  onClick={() => setShowPwd((s) => !s)}
                  className="p-1 -mr-1 inline-flex items-center justify-center"
                >
                  <Icon name={showPwd ? "eye-off" : "eye"} />
                </button>
              }
            />

            <div className="mt-2 flex items-center justify-between">
              <Checkbox
                label="Ricordami"
                checked={form.remember}
                onChange={onChange("remember")}
              />
              {/* <a href="#" className="text-sm text-brand hover:underline">
                Password dimenticata?
              </a> */}
            </div>
          </div>

          <CTA_Button
            type="submit"
            className="w-full md:w-auto"
            loading={isLoading}
            disabled={isLoading}
          >
            {isLoading ? (
              <span className="inline-flex items-center gap-2">
                <LoadSpinner size="sm" color="white" /> Accesso in corso…
              </span>
            ) : (
              "Accedi"
            )}
          </CTA_Button>

          <Typography
            variant="span"
            className="block text-center text-sm text-neutral-600"
          >
            Non hai un account?{" "}
            <a href="/register" className="text-brand hover:underline">
              Registrati
            </a>
          </Typography>
        </form>
      </Card>
    </div>
  );
}
