import { describe, expect, test } from 'vitest';
import { toBeValid } from '../../src';

const valid = { isValid: true, isEmpty: false };
const invalid = { isValid: false, isEmpty: true };

describe('toBeValid', () => {
  test('fails', () => {
    expect(toBeValid()).toFailMatcherWith('Subject is undefined.');
    expect(toBeValid({})).toFailMatcherWith('Subject is not validatable.');
    expect(toBeValid(invalid)).toFailMatcherWith('Subject is not valid.');
  });

  test('passes', () => {
    expect(toBeValid(valid)).toPassMatcherWith('Subject is valid, which we did not expect.');
  });
});
