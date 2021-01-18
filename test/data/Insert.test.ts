import { Dev, DevTable } from '../ref';
import '@thisisagile/easy-test';

describe('Insert', () => {
  const devs = new DevTable();

  test('Create insert', () => {
    expect(devs.insert(Dev.Naoufal.toJSON())).toMatchText(
      "INSERT INTO DevTable (Id, Name, Language, CodingLevel) OUTPUT INSERTED.* VALUES (2, 'Naoufal', 'TypeScript', '3')"
    );
  });
});
