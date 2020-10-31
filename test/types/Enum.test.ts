import {Enum} from "../../src/types/Enum";
import {Language} from "../ref/Language";

describe("Enum", () => {

    test("Is constructed correctly with name only", () => {
        expect(Language.Java.name).toBe("Java");
        expect(Language.Java.id).toBe("java");
        expect(Language.Java.code).toBe(Language.Java.id);
    });

    test("Is constructed correctly", () => {
        expect(Language.JavaScript.name).toBe("JavaScript");
        expect(Language.JavaScript.id).toBe("javascript");
        expect(Language.JavaScript.code).toBe("js");
    });
});
