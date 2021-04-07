import { DevTable } from '../ref';
import '@thisisagile/easy-test';
import { Count } from '../../src/sql/Count';

describe('Count', () => {
  const query = 'SELECT COUNT(*) FROM DevTable;';
  const devs = new DevTable();
  let count: Count;

  beforeEach(() => {
    count = devs.count;
  });

  test('Without columns', () => {
    const select = devs.count;
    expect(select).toMatchText(query);
  });

  test('With columns and join', () => {
    const select = devs.count.from(devs.join(devs).on(devs.id, devs.language));
    expect(select).toMatchText('SELECT COUNT(*) FROM DevTable JOIN DevTable ON DevTable.Id = DevTable.Language;');
  });

  test('With a clause', () => {
    const select = devs.count.where(devs.level.lessEqual(4));
    expect(select).toMatchText("SELECT COUNT(*) FROM DevTable WHERE DevTable.CodingLevel <= '4';");
  });

  test('With one or clause', () => {
    const select = devs.count.where(devs.name.is('Naoufal').or(devs.level.greaterEqual(2)));
    expect(select).toMatchText("SELECT COUNT(*) FROM DevTable WHERE DevTable.Name = 'Naoufal' OR DevTable.CodingLevel >= '2';");
  });

  test('With two clauses', () => {
    const select = devs.count.where(devs.level.lessEqual(4), devs.level.greaterEqual(2));
    expect(select).toMatchText("SELECT COUNT(*) FROM DevTable WHERE DevTable.CodingLevel <= '4' AND DevTable.CodingLevel >= '2';");
  });

  test('With orderBy', () => {
    const select = devs.count.orderBy(devs.level.desc, devs.name.asc);
    expect(select).toMatchText(query);
  });

  test('With groupBy', () => {
    const select = devs.count.groupBy(devs.language);
    expect(select).toMatchText('SELECT COUNT(*) FROM DevTable GROUP BY DevTable.Language;');
  });

  test('With top', () => {
    const select = devs.count.top(100);
    expect(select).toMatchText('SELECT COUNT(*) TOP 100 FROM DevTable;');
  });

  test('With limit', () => {
    const select = devs.count.limit(100);
    expect(select).toMatchText(query);
  });

  test('With limit and offset', () => {
    const select = devs.count.limit(100).offset(10);
    expect(select).toMatchText(query);
  });
});
