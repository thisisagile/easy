import '@thisisagile/easy-test';
import { Message, ofMessage } from '../../src';
import { Dev } from '../ref';

describe('ofMessage', () => {
  test('from string', () => {
    expect(ofMessage('Sander')).toBe('Sander');
  });

  test('from function', () => {
    const greeting = (dev: Dev): Message<Dev> => () => dev.name;
    expect(ofMessage(greeting(Dev.Sander))).toBe('Sander');
  });

});
