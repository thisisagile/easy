import React from 'react';
import '@thisisagile/easy-test';
import { rendersWait } from '@thisisagile/easy-test-react';
import { resolve } from '@thisisagile/easy';
import { useOnce } from '../../src';

describe('useOnce', () => {
  const Club = ({ f, initial }: { f: () => Promise<string>; initial?: string }) => {
    const [name] = useOnce(f, { initial });
    return <div data-testid={name}>Club</div>;
  };

  test('useOnce works.', async () => {
    const { container, atId } = await rendersWait(<Club f={() => resolve('barcelona')} />);
    expect(container).toMatchSnapshot();
    expect(atId('barcelona')).toBeValid();
  });

  test('useOnce works with initial.', async () => {
    const { container, atId } = await rendersWait(<Club f={() => resolve('barcelona')} initial="feyenoord" />);
    expect(container).toMatchSnapshot();
    expect(atId('barcelona')).toBeValid();
  });

  test('useOnce works with initial and undefined.', async () => {
    const { container, atId } = await rendersWait(<Club f={() => resolve(undefined as unknown as string)} initial={'feyenoord'} />);
    expect(container).toMatchSnapshot();
    expect(atId('feyenoord')).toBeValid();
  });
});
