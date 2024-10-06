export type SuccessResponse<T = unknown> = { message: string; data?: T | null; };
export type ErrorResponse = { message: string; };
export type SignalHandler = (signal: string) => void;
export type EnvResolver = (key: string, fallback?: string) => string;
