import { ContentType } from '../../src/services';
import { Dev } from '../ref/Dev';

describe('ContentType', () => {

  const json = Dev.Wouter.toJSON();

  test('Json encode.', () => {
    const expected = '{"id":4,"name":"Wouter","language":"TypeScript","level":3}';
    expect(ContentType.Json.encode(json)).toBe(expected);
  });

  test('Check encoding of form.', () => {
    const expected = 'id=4&name=Wouter&language=TypeScript&level=3';
    expect(ContentType.Form.encode(json)).toBe(expected);
  });
});
