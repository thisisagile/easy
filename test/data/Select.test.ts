import { DevTable } from '../ref';
import { Select } from '../../src';
import '@thisisagile/easy-test';

describe('Select', () => {
  const devs = new DevTable();
  let select: Select;

  beforeEach(() => {
    select = devs.select();
  });

  test('orderBy', () => {
    select.orderBy(devs.name.asc, devs.level.desc);
    expect(select.ordered).toHaveLength(2);
  });

  test('groupBy', () => {
    select.groupBy(devs.level);
    expect(select.grouped).toHaveLength(1);
  });

  test('Without columns', () => {
    const select = devs.select();
    expect(select).toMatchText('SELECT * FROM DevTable');
  });

  test('With columns', () => {
    const select = devs.select(devs.name, devs.level);
    expect(select).toMatchText('SELECT DevTable.Name, DevTable.CodingLevel FROM DevTable');
  });

  test('With a clause', () => {
    const select = devs.select().where(devs.level.lessEqual(4));
    expect(select).toMatchText('SELECT * FROM DevTable WHERE DevTable.CodingLevel <= 4');
  });

  test('With one or clause', () => {
    const select = devs.select().where(devs.name.is('Naoufal').or(devs.level.greaterEqual(2)));
    expect(select).toMatchText("SELECT * FROM DevTable WHERE DevTable.Name = 'Naoufal' OR DevTable.CodingLevel >= 2");
  });

  test('With two clauses', () => {
    const select = devs.select().where(devs.level.lessEqual(4), devs.level.greaterEqual(2));
    expect(select).toMatchText('SELECT * FROM DevTable WHERE DevTable.CodingLevel <= 4 AND DevTable.CodingLevel >= 2');
  });
});
