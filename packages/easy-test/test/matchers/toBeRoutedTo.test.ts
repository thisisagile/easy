import { mock, toBeRoutedTo } from "../../src";
import { asString } from "@thisisagile/easy";
import Mock = jest.Mock;

describe('toBeRoutedTo', () => {
  const uri = { route: '/devs', complete: '$host/$resource/devs', toString: () => '$host/$resource/devs' };
  const uri2 = { route: '/managers', complete: '$host/$resource/managers', toString: () => '$host/$resource/managers' };
  const un: Mock = undefined as unknown as Mock;
  const empty = mock.return();
  const query = { mock: { calls: [[{ toString: () => asString(uri) }]] } } as unknown as Mock;

  test('fails', () => {
    expect(un).not.toBeRoutedTo(uri);
    expect(empty).not.toBeRoutedTo(uri);
    expect(query).toBeRoutedTo(uri);
    expect(query).not.toBeRoutedTo(uri2);
    expect(toBeRoutedTo(un, '')).toFailMatcherWith('Uri is unknown.');
    expect(toBeRoutedTo(empty, '')).toFailMatcherWith('Method was not called.');
    expect(toBeRoutedTo(query, uri2)).toFailMatcherWith("We expected uri '$host/$resource/managers', but we received uri '$host/$resource/devs' instead.");
  });

  test('passes', () => {
    expect(query).toBeRoutedTo(uri);
    expect(toBeRoutedTo(query, uri)).toPassMatcherWith("Called uri does match '$host/$resource/devs', which we did not expect.");
  });
});
