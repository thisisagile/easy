import '@thisisagile/easy-test';
import { we } from '../../src';


describe('We', () => {

  test('check it', () => {
    expect(we.could.not.update.id(42)).toMatchText('We could not update id \'42\'.');
    expect(we.did.not.find.any('devs')).toMatchText('We did not find any devs.');
    expect(we.did.add.a('dev')).toMatchText('We did add a dev.');
    expect(we.did.remove.an('item')).toMatchText('We did remove an item.');
  });
});
