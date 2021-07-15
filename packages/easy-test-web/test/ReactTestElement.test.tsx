import React from 'react';
import { mock } from '@thisisagile/easy-test';
const getByText = mock.return(<div />);
jest.mock('@testing-library/react', () => ({ ...jest.requireActual('@testing-library/react'), getByText }));
import { fireEvent } from '@testing-library/react';
import { renders, ReactTestElement } from '../src';

describe('ReactTestElement', () => {
  const a = <div />;
  let e: ReactTestElement;

  beforeEach(() => {
    e = renders(a).atText('');
  });

  test('click fires click event', () => {
    fireEvent.click = mock.return();
    e.click();
    expect(getByText).toHaveBeenCalledTimes(2);
    expect(fireEvent.click).toHaveBeenCalledWith(a);
  });

  test('type fires value change event', () => {
    fireEvent.change = mock.return();
    const value = 'hello';
    e.type(value);
    expect(getByText).toHaveBeenCalled();
    expect(fireEvent.change).toHaveBeenCalledWith(a, { target: { value } });
  });
});
