import { Record } from "./Record";
import { Id } from "../types";

export class Entity extends Record {
  readonly id: Id = this.state.id;
}

export const isEntity = (e?: unknown): e is Entity => e instanceof Entity;
