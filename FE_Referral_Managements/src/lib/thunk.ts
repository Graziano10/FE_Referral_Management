// // src/lib/thunk.ts
// export type ApiError = { status?: number; message: string; data?: unknown };

// export const isRecord = (v: unknown): v is Record<string, unknown> =>
//   typeof v === "object" && v !== null;

// export const hasStringMessage = (v: unknown): v is { message: string } =>
//   isRecord(v) && typeof (v as any).message === "string";

// export const hasNumericStatus = (v: unknown): v is { status: number } =>
//   isRecord(v) && typeof (v as any).status === "number";

// export const hasData = (v: unknown): v is { data: unknown } =>
//   isRecord(v) && "data" in (v as Record<string, unknown>);

// export const asReject = (e: unknown): ApiError => {
//   const message = hasStringMessage(e) ? e.message : "Errore sconosciuto";
//   const status = hasNumericStatus(e) ? e.status : undefined;
//   const data = hasData(e) ? e.data : undefined;
//   return { status, message, data };
// };
