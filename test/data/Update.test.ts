import { Dev, DevTable } from '../ref';
import '@thisisagile/easy-test';

describe('Update', () => {
  const devs = new DevTable();

  test('Create update', () => {
    expect(devs.update(Dev.Naoufal.toJSON()).where(devs.id.is(2))).toMatchText(
      "UPDATE DevTable SET Id = 2, Name = 'Naoufal', Language = 'TypeScript', CodingLevel = '3' OUTPUT INSERTED.* WHERE DevTable.Id = 2"
    );
  });
});
