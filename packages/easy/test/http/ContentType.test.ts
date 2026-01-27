import { ContentType, json } from '../../src';
import { Dev } from '../ref';
import '@thisisagile/easy-test';

describe('ContentType', () => {
  const j = json.omit(Dev.Wouter.toJSON(), 'created', 'lastModified');
  const expected = { id: 4, name: 'Wouter', language: 'TypeScript', level: 3 };

  test('Json encode.', () => {
    expect(ContentType.Json.encode(j)).toMatchJson(expected);
  });

  test('RawJson encode.', () => {
    expect(ContentType.RawJson.encode(j)).toMatchJson(expected);
  });

  test('Check encoding of form.', () => {
    expect(ContentType.Form.encode(j)).toMatchSnapshot();
  });
});
