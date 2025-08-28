// src/hooks/useAppSelector.ts
import { useSelector, type TypedUseSelectorHook } from "react-redux";
import type { RootState } from "../app/store";

/**
 * Hook tipato per selezionare dati dallo store Redux.
 * Uso: const value = useAppSelector(state => state.auth.token);
 */
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
