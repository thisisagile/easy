import '@thisisagile/easy-test';
import { we } from '../../src';


describe('We', () => {

  test('check it', () => {
    expect(we.could.not.update.id(42)).toMatchText('We could not update id \'42\'.');
    expect(we.did.not.find.any('devs')).toMatchText('We did not find any devs.');
    expect(we.did.add.your('dev')).toMatchText('We did add your dev.');
    expect(we.did.fetch.your()).toMatchText('We did fetch your item.');
    expect(we.did.add.a('dev')).toMatchText('We did add a dev.');
    expect(we.did.fetch.a()).toMatchText('We did fetch an item.');
    expect(we.did.remove.an('item')).toMatchText('We did remove an item.');
    expect(we.did.remove.an()).toMatchText('We did remove an item.');
    expect(we.did.not.find.any('items')).toMatchText('We did not find any items.');
    expect(we.did.not.find.any()).toMatchText('We did not find any items.');
  });
});
