import { DevTable } from '../ref';
import { quote, toClause } from '../../src';
import '@thisisagile/easy-test';

describe('quote', () => {
  test('Works', () => {
    expect(quote(3)).toMatchText('3');
    expect(quote(true)).toMatchText('true');
    expect(quote('Jeroen')).toMatchText("'Jeroen'");
    expect(quote(toClause('name', '=', 'Jeroen'))).toMatchText("name = 'Jeroen'");
  });
});

describe('Column', () => {
  const devs = new DevTable();
  const name = devs.name;

  test('Clause', () => {
    expect(name.is(3)).toMatchText('DevTable.Name = 3');
    expect(name.is('Jan')).toMatchText("DevTable.Name = 'Jan'");
    expect(name.not(3)).toMatchText('DevTable.Name <> 3');
    expect(name.not('Jan')).toMatchText("DevTable.Name <> 'Jan'");
    expect(name.like(3)).toMatchText("DevTable.Name LIKE '%3%'");
    expect(name.like('Jan')).toMatchText("DevTable.Name LIKE '%Jan%'");
    expect(name.startsLike(3)).toMatchText("DevTable.Name LIKE '3%'");
    expect(name.startsLike('Jan')).toMatchText("DevTable.Name LIKE 'Jan%'");
    expect(name.endsLike(3)).toMatchText("DevTable.Name LIKE '%3'");
    expect(name.endsLike('Jan')).toMatchText("DevTable.Name LIKE '%Jan'");
    expect(name.unlike(3)).toMatchText("DevTable.Name NOT LIKE '%3%'");
    expect(name.unlike('Jan')).toMatchText("DevTable.Name NOT LIKE '%Jan%'");
    expect(name.less(3)).toMatchText('DevTable.Name < 3');
    expect(name.lessEqual(3)).toMatchText('DevTable.Name <= 3');
    expect(name.greater(3)).toMatchText('DevTable.Name > 3');
    expect(name.greaterEqual(3)).toMatchText('DevTable.Name >= 3');
  });
});
