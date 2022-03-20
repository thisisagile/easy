import '@thisisagile/easy-test';
import { View, view } from '../../src';


describe('View', () => {

  test('construct default view', () => {
    const v = new View();
    expect(v.views).toHaveLength(0);
    expect(v.from).toBe('scratch');
  });

  test('construct non-default view', () => {
    const v = new View([{}], 'source');
    expect(v.views).toHaveLength(1);
    expect(v.from).toBe('source');
  });

  test('construct from view()', () => {
    const v = view({}, 'source');
    expect(v.views).toHaveLength(0);
    expect(v.from).toBe('source');
  });

  const persons = view({
    first: 'FirstName'
  }, 'source');

  test('construct with actual view', () => {
    expect(persons.views).toHaveLength(0);
    expect(persons.from).toBe('source');
  });


});
