import { isDefined } from '../../src/types';
import { Dev } from '../ref/Dev';
import { choose } from '../../src/utils/Case';

describe('Case', () => {

  const witch = (name?: string) =>
    choose<string, Dev>(name)
      .case(n => !isDefined(n), Dev.Jeroen)
      .case(n => n.includes('an'), Dev.Naoufal)
      .case(n => n.includes('San'), Dev.Sander)
      .else(Dev.Wouter);

  test("Only else", () => {
    const out = choose<string, Dev>("")
      .else(Dev.Naoufal);
    expect(out).toMatchObject(Dev.Naoufal);
  });

  test("Empty else", () => {
    const out = choose<string, Dev>("")
      .else();
    expect(out).toBeUndefined();
  });

  test("Simple true", () => {
    const out = choose<string, Dev>("")
      .case(true, Dev.Wouter)
      .else(Dev.Naoufal);
    expect(out).toMatchObject(Dev.Wouter);
  });

  test("Double true, should find first", () => {
    const out = choose<string, Dev>("")
      .case(true, Dev.Wouter)
      .case(true, Dev.Sander)
      .else(Dev.Naoufal);
    expect(out).toMatchObject(Dev.Wouter);
  });

  test("Double true with predicate, should find first", () => {
    const out = choose<string, Dev>("sander")
      .case(s => s.includes("and"), Dev.Sander)
      .case(true, Dev.Wouter)
      .else(Dev.Naoufal);
    expect(out).toMatchObject(Dev.Sander);
  });

  test("Simple true, with function outcome", () => {
    const out = choose<string, Dev>("Bas")
      .case(true, name => new Dev({name}))
      .else(Dev.Naoufal);
    expect(out.name).toBe("Bas");
  });

  test("Full choose case", () => {
    expect(witch()).toMatchObject(Dev.Jeroen);
    expect(witch('an')).toMatchObject(Dev.Naoufal);
    expect(witch('San')).toMatchObject(Dev.Naoufal);
    expect(witch('Kim')).toMatchObject(Dev.Wouter);
  });
});
