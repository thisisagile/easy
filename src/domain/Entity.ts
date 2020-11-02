import { Record } from "./Record";
import { Id } from "../types";

export abstract class Entity extends Record {
  readonly id: Id = this.state.id;
}

export const isEntity = (e?: unknown): e is Entity => e instanceof Entity;
