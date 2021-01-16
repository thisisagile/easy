import { DevTable } from '../ref';
import '@thisisagile/easy-test';

describe('Delete', () => {
  const devs = new DevTable();

  test('Simple', () => {
    expect(devs.delete()).toMatchText('DELETE FROM DevTable');
  });

  test('With with one clause', () => {
    expect(devs.delete().where(devs.level.less(3))).toMatchText("DELETE FROM DevTable WHERE DevTable.CodingLevel < '3'");
  });

  test('With with multiple clauses', () => {
    expect(devs.delete().where(devs.level.less(3), devs.language.is('Python'))).toMatchText(
      "DELETE FROM DevTable WHERE DevTable.CodingLevel < '3' AND DevTable.Language = 'Python'"
    );
  });
});
