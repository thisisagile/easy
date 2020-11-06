import { Query, where } from '../../src/data/Query';

describe("Query", () => {

  test("Query construction with string", () => {
    const q = new Query("name", "john");
    expect(q.toJSON()).toStrictEqual({name: "john"})
  });

  test("Query construction with json", () => {
    const q = new Query("person", {name: "john"});
    expect(q.toJSON()).toStrictEqual({person: {name: "john"}})
  });

  test("Where Query", () => {
    const q = where("temperature", 23);
    expect(q.toJSON()).toStrictEqual({temperature: 23})
  });
});

