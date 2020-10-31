import {Record} from "./Record";
import {Id} from "../types/Id";

export class Entity extends Record {
    readonly id: Id = this.state.id;
}
