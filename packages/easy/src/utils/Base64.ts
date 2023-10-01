import { Json } from "../types";

export const base64 = {
  decode: (data: string): string => Buffer.from(data, "base64").toString("utf-8"),
  encode: (data: string): string => Buffer.from(data, "utf-8").toString("base64"),
  toJson: (data: string): Json => JSON.parse(base64.decode(data))
};
