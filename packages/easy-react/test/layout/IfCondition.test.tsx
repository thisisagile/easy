import React from 'react';
import '@thisisagile/easy-test';
import { rendersWait } from '@thisisagile/easy-test-react';
import { If } from '../../src/layout/If';

describe('If condition', () => {
  test.each([['text'], [1], [{}], [[]]])('renders children when condition is truthy %p', async condition => {
    const { atId } = await rendersWait(
      <If condition={condition}>
        <div data-testid="found">Hello</div>
      </If>
    );
    expect(atId('found')).toBeValid();
  });

  test.each([[undefined], [null], [0], ['']])('renders nothing when condition is falsy %p', async condition => {
    const { atId } = await rendersWait(
      <If condition={condition}>
        <div data-testid="found">Hello</div>
      </If>
    );
    expect(atId('found')).not.toBeValid();
  });
});
