import { ContentType, json } from '../../src';
import { Dev } from '../ref';
import '@thisisagile/easy-test';

describe('ContentType', () => {
  const j = json.omit(Dev.Wouter, 'created', 'lastModified');

  test('Json encode.', () => {
    const expected = { id: 4, name: 'Wouter', language: 'TypeScript', level: 3 };
    expect(ContentType.Json.encode(j)).toMatchJson(expected);
  });

  test('Check encoding of form.', () => {
    const expected = 'id=4&name=Wouter&language=TypeScript&level=3';
    expect(ContentType.Form.encode(j)).toBe(expected);
  });
});
