import { isA } from "./IsA";

export type Text = { toString(): string };

export const isText = (t?: unknown): t is Text => isA<Text>(t, "toString");
