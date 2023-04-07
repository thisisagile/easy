import { describe, expect, test } from 'vitest';
import { toMatchRoute } from '../../src';

const uri = { route: '/devs', complete: '$host/$resource/devs', toString: () => '$host/$resource/devs' };

describe('toMatchRoute', () => {
  test('fails', () => {
    expect(toMatchRoute(undefined)).toFailMatcherWith('Subject is undefined.');
    expect(toMatchRoute(uri)).toFailMatcherWith('Route to include is undefined.');
    expect(toMatchRoute(uri, '/managers')).toFailMatcherWith(`Uri '${uri}' does not include '/managers'.`);
  });

  test('passes', () => {
    expect(toMatchRoute(uri, '/devs')).toPassMatcherWith(`Uri '${uri}' includes '/devs'`);
    expect(toMatchRoute(uri, uri)).toPassMatcherWith(`Uri '${uri}' includes '${uri}'`);
  });
});
