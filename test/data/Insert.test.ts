import { Dev, DevTable } from '../ref';
import '@thisisagile/easy-test';

describe('Insert', () => {
  const devs = new DevTable();

  test('Simple', () => {
    expect(devs.insert({ id: 3 })).toMatchText('INSERT INTO DevTable (Id) OUTPUT INSERTED.* VALUES (3)');
  });

  test('Full insert with converters', () => {
    expect(devs.insert(Dev.Naoufal.toJSON())).toMatchText(
      "INSERT INTO DevTable (Id, Name, Language, CodingLevel) OUTPUT INSERTED.* VALUES (2, 'Naoufal', 'TypeScript', '3')"
    );
  });
});
