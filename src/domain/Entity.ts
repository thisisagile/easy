import { Record } from "./Record";
import { Id } from "../types/Id";
import { isAn } from "../utils/IsA";

export class Entity extends Record {
  readonly id: Id = this.state.id;
}

export const isEntity = (e?: unknown): e is Entity => isAn<Entity>(e, "id", "isValid");
