
export function log<T>(t: T): T;
export function log<T>(label: string, t: T): T;
export function log<T>(labelOrT: string | T, t?: T): T {
  if (t) {
    console.log(labelOrT as string, t);
    return t;
  } else {
    console.log(labelOrT);
    return labelOrT as T;
  }
}