export type DontInfer<T> = [T][T extends any ? 0 : never];
