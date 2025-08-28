// src/hooks/useAppDispatch.ts
import { useDispatch } from "react-redux";
import type { AppDispatch } from "../app/store";

/**
 * Hook tipato per dispatchare azioni/thunk Redux.
 * Uso: const dispatch = useAppDispatch();
 */
export const useAppDispatch = () => useDispatch<AppDispatch>();
