import '@thisisagile/easy-test';
import { View } from '../../src';


describe('View', () => {

  let view: View;

  beforeEach(() => {
    view = new View([]);
  });

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

});
