import { DevTable } from '../ref';
import { quote, toClause } from '../../src';

describe('Column', () => {
  const devs = new DevTable();

  test('quote', () => {
    expect(quote(3)).toBe('3');
    expect(quote(true)).toBe('true');
    expect(quote('Jeroen')).toBe("'Jeroen'");
    expect(quote(toClause('name', '=', 'Jeroen'))).toBe("name = 'Jeroen'");
  });

  test('Clause', () => {
    const col = devs.name;
    expect(col.is(3).toString()).toBe('DevTable.Name = 3');
    expect(col.is('Jan').toString()).toBe("DevTable.Name = 'Jan'");
    expect(col.not(3).toString()).toBe('DevTable.Name <> 3');
    expect(col.not('Jan').toString()).toBe("DevTable.Name <> 'Jan'");
    expect(col.like(3).toString()).toBe("DevTable.Name LIKE '%3%'");
    expect(col.like('Jan').toString()).toBe("DevTable.Name LIKE '%Jan%'");
    expect(col.startsLike(3).toString()).toBe("DevTable.Name LIKE '3%'");
    expect(col.startsLike('Jan').toString()).toBe("DevTable.Name LIKE 'Jan%'");
    expect(col.endsLike(3).toString()).toBe("DevTable.Name LIKE '%3'");
    expect(col.endsLike('Jan').toString()).toBe("DevTable.Name LIKE '%Jan'");
    expect(col.unlike(3).toString()).toBe("DevTable.Name NOT LIKE '%3%'");
    expect(col.unlike('Jan').toString()).toBe("DevTable.Name NOT LIKE '%Jan%'");
    expect(col.less(3).toString()).toBe('DevTable.Name < 3');
    expect(col.lessEqual(3).toString()).toBe('DevTable.Name <= 3');
    expect(col.greater(3).toString()).toBe('DevTable.Name > 3');
    expect(col.greaterEqual(3).toString()).toBe('DevTable.Name >= 3');
  });
});
