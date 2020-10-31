import {Entity} from "../../src/domain/Entity";

export class Dev extends Entity {
    readonly name: string = this.state.name;
    readonly language: string = this.state.language ?? "TypeScript";

    static readonly Sander = new Dev({name: "Sander"});
}

