import React from 'react';
import '@thisisagile/easy-test';
import { rendersWait } from '@thisisagile/easy-test-react';
import { If } from '../../src';

describe('If', () => {
  const component1 = (
    <If condition={true}>
      <div data-testid="found">Hello</div>
    </If>
  );
  const component2 = (
    <If condition={false}>
      <div data-testid="found">Hello</div>
    </If>
  );

  test('renders correctly.', async () => {
    const { container } = await rendersWait(component1);
    expect(container).toMatchSnapshot();
  });

  test('is found', async () => {
    const { atId } = await rendersWait(component1);
    expect(atId('found')).toBeValid();
  });

  test('renders correctly 2.', async () => {
    const { container } = await rendersWait(component2);
    expect(container).toMatchSnapshot();
  });

  test('is not found', async () => {
    const { atId } = await rendersWait(component2);
    expect(atId('found')).not.toBeValid();
  });
});
