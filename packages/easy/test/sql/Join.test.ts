import { Join } from '../../src/sql/Join';
import { DevTable } from '../ref/DevTable';

describe('Join', () => {
  test('uses the first table database and renders its join condition', () => {
    const first = new DevTable();
    const second = new DevTable();
    const join = new Join(first, second).on(first.id, second.id);

    expect(join.db).toBe(first.db);
    expect(join.toString()).toBe(`${first} JOIN ${second} ON ${first.id} = ${second.id}`);
  });
});
