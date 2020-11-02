import { isA } from "./IsA";

export type Result = { message: string, domain?: string, location?: string };

export const result = (message: string, domain?: string, location?: string) => ({ message, domain, location });

export const isResult = (r?: unknown): r is Result => isA<Result>(r, "message");
