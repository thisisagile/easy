import { describe, expect, test } from 'vitest';
import { MatchesExactJson, toMatchExactJson } from '../../src';

class Dev {
  constructor(readonly name: string) {}
}

class DevWithFunction {
  constructor(readonly name: string) {}

  initials = (): string => this.name[0];
}

describe('toMatchExactJson', () => {
  const json = { name: 'Sander', id: 3 };
  const dev = new Dev('Sander');
  const devWrong = new Dev('Wouter');
  const devFunction = new DevWithFunction('Wouter');
  const devFunction2 = new DevWithFunction('Wouter');

  test('fails', () => {
    expect(toMatchExactJson()).toFailMatcherWith(MatchesExactJson.SubjectUndefined);
    expect(toMatchExactJson(json)).toFailMatcherWith(MatchesExactJson.SubsetUndefined);
    expect(toMatchExactJson(json, {})).toFailMatcherWith(MatchesExactJson.DoesNotMatch);
    expect(toMatchExactJson(json, 'Hi')).toFailMatcherWith(MatchesExactJson.DoesNotMatch);
    expect(toMatchExactJson(json, devWrong)).toFailMatcherWith(MatchesExactJson.DoesNotMatch);
    expect(toMatchExactJson(dev, json)).toFailMatcherWith(MatchesExactJson.DoesNotMatch);
    expect(toMatchExactJson(json, dev)).toFailMatcherWith(MatchesExactJson.DoesNotMatch);
    expect(toMatchExactJson(dev, devFunction)).toFailMatcherWith(MatchesExactJson.DoesNotMatch);
    expect(toMatchExactJson(devFunction, devFunction2)).toFailMatcherWith(MatchesExactJson.DoesNotMatch);
    expect(toMatchExactJson(devFunction, devWrong)).toFailMatcherWith(MatchesExactJson.DoesNotMatch);
  });

  test('passes', () => {
    expect(toMatchExactJson('json', 'json')).toPassMatcherWith(MatchesExactJson.Yes);
    expect(toMatchExactJson(json, json)).toPassMatcherWith(MatchesExactJson.Yes);
    expect(toMatchExactJson(devFunction, devFunction)).toPassMatcherWith(MatchesExactJson.Yes);
  });
});
