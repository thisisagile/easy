import {HttpStatus} from "../../src/services";

describe("HttpStatus", () => {

    test("Is not an error", () => {
        expect(HttpStatus.Ok.isError).toBeFalsy();
    });

    test("Is an error", () => {
        expect(HttpStatus.BadRequest.isError).toBeTruthy();
    });
});
