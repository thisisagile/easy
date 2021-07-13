import { MatchesJson, toMatchJson } from '../../src';

class Dev {
  constructor(readonly name: string) {}
}

class DevWithFunction {
  constructor(readonly name: string) {}

  initials = (): string => this.name[0];
}

describe('toMatchJson', () => {
  const json = { name: 'Sander', id: 3 };
  const dev = new Dev('Sander');
  const devWrong = new Dev('Wouter');
  const devFunction = new DevWithFunction('Wouter');
  const devFunction2 = new DevWithFunction('Wouter');

  test('fails', () => {
    expect(toMatchJson()).toFailMatcherWith(MatchesJson.SubjectUndefined);
    expect(toMatchJson(json)).toFailMatcherWith(MatchesJson.SubsetUndefined);
    expect(toMatchJson(json, 'Hi')).toFailMatcherWith(MatchesJson.DoesNotMatch);
    expect(toMatchJson(json, devWrong)).toFailMatcherWith(MatchesJson.DoesNotMatch);
    expect(toMatchJson(dev, json)).toFailMatcherWith(MatchesJson.DoesNotMatch);
    expect(toMatchJson(dev, devFunction)).toFailMatcherWith(MatchesJson.DoesNotMatch);
    expect(toMatchJson(devFunction, devFunction2)).toFailMatcherWith(MatchesJson.DoesNotMatch);
  });

  test('passes', () => {
    expect(toMatchJson(json, {})).toPassMatcherWith(MatchesJson.Yes);
    expect(toMatchJson(json, json)).toPassMatcherWith(MatchesJson.Yes);
    expect(toMatchJson(json, dev)).toPassMatcherWith(MatchesJson.Yes);
    expect(toMatchJson(devFunction, devFunction)).toPassMatcherWith(MatchesJson.Yes);
    expect(toMatchJson(devFunction, devWrong)).toPassMatcherWith(MatchesJson.Yes);
  });
});
