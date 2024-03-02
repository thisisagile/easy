import React from 'react';
import '@thisisagile/easy-test';
import { rendersWait } from '@thisisagile/easy-test-react';
import { HasId, resolve } from '@thisisagile/easy';
import { useOnce, UseOnceOptions } from '../../src';

describe('useOnce', () => {
  const Club = ({ f, options = {} }: { f: () => Promise<HasId>; options?: UseOnceOptions<HasId> }) => {
    const [o] = useOnce(f, options);
    return <div data-testid={o?.id}>Club</div>;
  };

  test('useOnce works.', async () => {
    const { container, atId } = await rendersWait(<Club f={() => resolve({ id: 42 })} />);
    expect(container).toMatchSnapshot();
    expect(atId('42')).toBeValid();
  });

  test('useOnce works with initial.', async () => {
    const { container, atId } = await rendersWait(<Club f={() => resolve({ id: 43 })} options={{ initial: { id: 44 } }} />);
    expect(container).toMatchSnapshot();
    expect(atId('43')).toBeValid();
  });

  test('useOnce works with deps.', async () => {
    const { container, atId } = await rendersWait(<Club f={() => resolve({ id: 44 })} options={{ deps: [{ id: 44 }] }} />);
    expect(container).toMatchSnapshot();
    expect(atId('44')).toBeValid();
  });
});
