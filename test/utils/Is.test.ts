import {is} from "../../src/utils/Is";
import {Dev} from "../ref/Dev";
import {Language} from "../ref/Language";

describe("Is", () => {

    test("Is constructed", () => {
        expect(is().isValid).toBeTruthy();
        expect(is().not.isValid).toBeFalsy();
    });

    test("And works", () => {
        expect(is(true).and(() => true).isValid).toBeTruthy();
        expect(is(true).and(() => false).isValid).toBeFalsy();
        expect(is(true).and(() => true).not.isValid).toBeFalsy();
        expect(is(true).and(() => false).not.isValid).toBeTruthy();
    });

    test("defined works", () => {
        expect(is().defined).toBeFalsy();
        expect(is(undefined).defined).toBeFalsy();
        expect(is(null).defined).toBeFalsy();
        expect(is({}).defined).toBeTruthy();
        expect(is({name: "Sander"}).defined).toBeTruthy();
        expect(is([]).defined).toBeTruthy();
        expect(is([{name: "Sander"}]).defined).toBeTruthy();
    });

    test("empty works", () => {
        expect(is().empty).toBeTruthy();
        expect(is(undefined).empty).toBeTruthy();
        expect(is(null).empty).toBeTruthy();
        expect(is({}).empty).toBeFalsy();
        expect(is({name: "Sander"}).empty).toBeFalsy();
        expect(is([]).empty).toBeFalsy();
        expect(is([{name: "Sander"}]).empty).toBeFalsy();
    });

    test("validatable works", () => {
        expect(is().validatable).toBeFalsy();
        expect(is(undefined).validatable).toBeFalsy();
        expect(is(null).validatable).toBeFalsy();
        expect(is({}).validatable).toBeFalsy();
        expect(is({name: "Sander"}).validatable).toBeFalsy();
        expect(is([]).validatable).toBeFalsy();
        expect(is([{name: "Sander"}]).validatable).toBeFalsy();
        expect(is({isValid: true}).validatable).toBeTruthy();
        expect(is(Dev.Sander).validatable).toBeTruthy();
    });
});

describe("IsAnType", () => {

    test("object works", () => {
        expect(is().an.object).toBeFalsy();
        expect(is(undefined).an.object).toBeFalsy();
        expect(is(null).an.object).toBeFalsy();
        expect(is({}).an.object).toBeTruthy();
        expect(is({name: "Sander"}).an.object).toBeTruthy();
        expect(is([]).an.object).toBeFalsy();
        expect(is([{name: "Sander"}]).an.object).toBeFalsy();
    })

    test("enum works", () => {
        expect(is(Dev.Sander).an.enum).toBeFalsy();
        expect(is(Language.JavaScript).an.enum).toBeTruthy();
    })

    test("entity works", () => {
        expect(is(undefined).an.entity).toBeFalsy();
        expect(is(Dev.Sander).an.entity).toBeTruthy();
        expect(is(Language.JavaScript).an.entity).toBeFalsy();
    })

    test("instanceOf works", () => {
        expect(is().an.instanceOf(Dev)).toBeFalsy();
        expect(is(undefined).an.instanceOf(Dev)).toBeFalsy();
        expect(is(null).an.instanceOf(Dev)).toBeFalsy();
        expect(is({}).an.instanceOf(Dev)).toBeFalsy();
        expect(is({name: "Sander"}).an.instanceOf(Dev)).toBeFalsy();
        expect(is([]).an.instanceOf(Dev)).toBeFalsy();
        expect(is([{name: "Sander"}]).an.instanceOf(Dev)).toBeFalsy();
        expect(is(Dev.Sander).an.instanceOf(Dev)).toBeTruthy();
        expect(is(Language.JavaScript).an.instanceOf(Language)).toBeTruthy();
    })
});
