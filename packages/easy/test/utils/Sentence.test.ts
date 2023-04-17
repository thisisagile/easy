import '@thisisagile/easy-test';
import { we } from '../../src';

describe('We', () => {
  test('check it', () => {
    expect(we.could.not.update.id(42)).toMatchText("We could not update id '42'.");
    expect(we.did.not.find.any('devs')).toMatchText('We did not find any devs.');
    expect(we.did.add.your('dev')).toMatchText('We did add your dev.');
    expect(we.did.fetch.your()).toMatchText('We did fetch your item.');
    expect(we.did.add.a('dev')).toMatchText('We did add a dev.');
    expect(we.did.fetch.a()).toMatchText('We did fetch an item.');
    expect(we.did.remove.an('item')).toMatchText('We did remove an item.');
    expect(we.did.remove.an()).toMatchText('We did remove an item.');
    expect(we.did.not.find.any('items')).toMatchText('We did not find any items.');
    expect(we.did.not.find.any()).toMatchText('We did not find any items.');
    expect(we.could.not.process.your('request')).toMatchText('We could not process your request.');
    expect(we.did.not.validate.your('request')).toMatchText('We did not validate your request.');
    expect(we.did.not.translate.your('request')).toMatchText('We did not translate your request.');
    expect(we.did.not.like.your('request')).toMatchText('We did not like your request.');
    expect(we.did.not.check.your('request')).toMatchText('We did not check your request.');
    expect(we.did.not.fetch.your('request')).toMatchText('We did not fetch your request.');
    expect(we.found.your('request')).toMatchText('We found your request.');
    expect(we.removed.your('request')).toMatchText('We removed your request.');
    expect(we.updated.your('request')).toMatchText('We updated your request.');
    expect(we.validated.your('request')).toMatchText('We validated your request.');
    expect(we.translated.your('request')).toMatchText('We translated your request.');
  });
});
