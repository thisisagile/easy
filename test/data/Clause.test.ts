import { DevTable } from '../ref';
import '@thisisagile/easy-test';

describe('Clause', () => {
  const devs = new DevTable();

  test('and works', () => {
    const and = devs.name.is('Sander').and(devs.level.not(3));
    expect(and).toMatchText("DevTable.Name = 'Sander' AND DevTable.CodingLevel <> 3");
  });

  test('or works', () => {
    const or = devs.name.is('Sander').or(devs.level.not(3));
    expect(or).toMatchText("DevTable.Name = 'Sander' OR DevTable.CodingLevel <> 3");
  });
});
