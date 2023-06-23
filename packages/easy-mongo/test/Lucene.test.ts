import '@thisisagile/easy-test';
import {lucene} from "../src";

describe('Lucene', () => {

    // Operations

    const { text, lt, lte, gt, gte } = lucene.operations;

    test('text undefined', () => {
        const t = text(undefined)('size');
        expect(t).toBeUndefined();
    });

    test('text single value', () => {
        const t = text("42")('size');
        expect(t).toStrictEqual({text: {path: "size", query: ['42']}});
    });

    test('text multiple values', () => {
        const t = text(["42", "43"])('size');
        expect(t).toStrictEqual({text: {path: "size", query: ['42', "43"]}});
    });

    test('text multiple values and empty fuzzy', () => {
        const t = text(["42", "43"], {})('size');
        expect(t).toStrictEqual({text: {path: "size", query: ['42', "43"], fuzzy: {}}});
    });

    test('text multiple values and fuzzy', () => {
        const t = text(["42", "43"], {maxEdits: 2})('size');
        expect(t).toStrictEqual({text: {path: "size", query: ['42', "43"], fuzzy: {maxEdits: 2}}});
    });

    test('lt with undefined', () => {
        const v = lt(undefined)("size");
        expect(v).toBeUndefined();
    })

    test('lt', () => {
        const v = lt(42)("size");
        expect(v).toStrictEqual({range: {path: "size", lt: 42}});
    })

    test('lte with undefined', () => {
        const v = lte(undefined)("size");
        expect(v).toBeUndefined();
    })

    test('lte', () => {
        const v = lte(42)("size");
        expect(v).toStrictEqual({range: {path: "size", lte: 42}});
    })

    test('gt with undefined', () => {
        const v = gt(undefined)("size");
        expect(v).toBeUndefined();
    })

    test('gt', () => {
        const v = gt(42)("size");
        expect(v).toStrictEqual({range: {path: "size", gt: 42}});
    })

    test('gte with undefined', () => {
        const v = gte(undefined)("size");
        expect(v).toBeUndefined();
    })

    test('gte', () => {
        const v = gte(42)("size");
        expect(v).toStrictEqual({range: {path: "size", gte: 42}});
    })
});

