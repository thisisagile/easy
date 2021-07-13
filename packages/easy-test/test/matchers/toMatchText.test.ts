import { toMatchText } from '../../src';

describe('toMatchText', () => {
  const s = 'Hello';
  const o = { toString: () => 'Goodbye' };

  test('fails', () => {
    expect(toMatchText()).toFailMatcherWith('Subject is undefined.');
    expect(toMatchText(s)).toFailMatcherWith('Text to match with is undefined.');
    expect(toMatchText(s, 'Hi')).toFailMatcherWith("Text 'Hello' does not match with text 'Hi'.");
    expect(toMatchText(o, 'Hi')).toFailMatcherWith("Text 'Goodbye' does not match with text 'Hi'.");
    expect(toMatchText(o, s)).toFailMatcherWith("Text 'Goodbye' does not match with text 'Hello'.");
  });

  test('passes', () => {
    expect(toMatchText(s, 'Hello')).toPassMatcherWith("Text 'Hello' matches, which we did not expect.");
    expect(toMatchText(o, 'Goodbye')).toPassMatcherWith("Text 'Goodbye' matches, which we did not expect.");
    expect(toMatchText(o, o)).toPassMatcherWith("Text 'Goodbye' matches, which we did not expect.");
  });
});
