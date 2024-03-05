import React, { DependencyList } from 'react';
import '@thisisagile/easy-test';
import { rendersWait } from '@thisisagile/easy-test-react';
import { HasId, resolve } from '@thisisagile/easy';
import { useOnce } from '../../src';

describe('useOnce', () => {
  const Club = ({ f, initial, deps }: { f: () => Promise<HasId>; initial?: HasId; deps?: DependencyList }) => {
    const [o] = useOnce(f, { initial, deps });
    return <div data-testid={o?.id}>Club</div>;
  };

  test('useOnce works.', async () => {
    const { container, atId } = await rendersWait(<Club f={() => resolve({ id: 42 })} />);
    expect(container).toMatchSnapshot();
    expect(atId('42')).toBeValid();
  });

  test('useOnce works with initial.', async () => {
    const { container, atId } = await rendersWait(<Club f={() => resolve({ id: 43 })} initial={{ id: 44 }} />);
    expect(container).toMatchSnapshot();
    expect(atId('43')).toBeValid();
  });

  test('useOnce works with deps.', async () => {
    const { container, atId } = await rendersWait(<Club f={() => resolve({ id: 44 })} deps={[{ id: 44 }]} />);
    expect(container).toMatchSnapshot();
    expect(atId('44')).toBeValid();
  });

  test('useOnce works with deps and initial.', async () => {
    const { container, atId } = await rendersWait(<Club f={() => resolve({ id: 44 })} initial={{ id: 56 }} deps={[{ id: 44 }]} />);
    expect(container).toMatchSnapshot();
    expect(atId('44')).toBeValid();
  });
});
