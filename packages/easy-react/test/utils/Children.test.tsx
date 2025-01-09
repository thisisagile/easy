import React, { ReactNode } from 'react';
import '@thisisagile/easy-test';
import { rendersWait } from '@thisisagile/easy-test-react';
import { toChildren } from '../../src';

const Things = ({ children }: { children?: ReactNode }) => <div>{toChildren(children).length}</div>;

describe('Children', () => {
  test('renders correctly without children.', async () => {
    const { container, byText } = await rendersWait(<Things></Things>);
    expect(container).toMatchSnapshot();
    expect(byText('0')).toBeDefined();
  });

  test('renders correctly with children.', async () => {
    const { container, byText } = await rendersWait(<Things>Text</Things>);
    expect(container).toMatchSnapshot();
    expect(byText('1')).toBeDefined();
  });

  test('renders correctly with multiple children.', async () => {
    const { container, byText } = await rendersWait(
      <Things>
        <span>Hoi</span>
        <div>Hallo</div>
      </Things>
    );
    expect(container).toMatchSnapshot();
    expect(byText('2')).toBeDefined();
  });
});
