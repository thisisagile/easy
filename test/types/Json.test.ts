import { jsonify } from '../../src/types';
import { Dev } from '../ref/Dev';

describe('Json', () => {

  test("jsonify nothing", () => {
    const json = jsonify();
    expect(json).toMatchObject({});
  })

  test("jsonify empty", () => {
    const json = jsonify({});
    expect(json).toMatchObject({});
  })

  test("jsonify undefined", () => {
    const json = jsonify(undefined);
    expect(json).toMatchObject({});
  })

  test("jsonify undefined", () => {
    const json = jsonify(null);
    expect(json).toMatchObject({});
  })

  test("jsonify simple", () => {
    const json = jsonify({name: "Sander"});
    expect(json).toMatchObject({name: "Sander"});
  })

  test("jsonify entity", () => {
    const json = jsonify(Dev.Wouter);
    expect(json).toMatchObject({name: "Wouter", language: "TypeScript", level: 3});
  })

  test("jsonify removes undefined", () => {
    const json = jsonify({name: "Wouter", language: "TypeScript", level: undefined});
    expect(json?.level).toBeUndefined();
  })
});
