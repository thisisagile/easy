import { DevTable } from '../ref';
import '@thisisagile/easy-test';
import { ParathesizedClause } from '../../src';

describe('Clause', () => {
  const devs = new DevTable();

  test('and works', () => {
    const and = devs.name.is('Sander').and(devs.level.not(3));
    expect(and).toMatchText("(DevTable.Name = 'Sander' AND DevTable.CodingLevel <> '3')");
  });

  test('or works', () => {
    const or = devs.name.is('Sander').or(devs.level.not(3));
    expect(or).toMatchText("(DevTable.Name = 'Sander' OR DevTable.CodingLevel <> '3')");
  });
});

describe('ParenthesisedClause', () => {
  const devs = new DevTable();

  test('toString', () => {
    expect(new ParathesizedClause(devs.name.is('Sander'), 'AND', devs.level.not(3))).toMatchText("(DevTable.Name = 'Sander' AND DevTable.CodingLevel <> '3')");
  });
});
