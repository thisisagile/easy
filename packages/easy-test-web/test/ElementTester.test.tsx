import React from 'react';
import { mock } from '@thisisagile/easy-test';
import { screen } from '@testing-library/dom';
import { renders, ElementTester } from '../src';
import { fireEvent } from '@testing-library/react';

describe('ElementTester', () => {
  const a = <div />;
  let e: ElementTester;

  beforeEach(() => {
    (screen as any).getByText = mock.return(a);
    e = renders(a).atText('');
  });

  test('click fires click event', () => {
    fireEvent.click = mock.return();
    e.click();
    expect(screen.getByText).toHaveBeenCalledTimes(2);
    expect(fireEvent.click).toHaveBeenCalledWith(a);
  });

  test('type fires value change event', () => {
    fireEvent.change = mock.return();
    const value = 'hello';
    e.type(value);
    expect(screen.getByText).toHaveBeenCalled();
    expect(fireEvent.change).toHaveBeenCalledWith(a, { target: { value } });
  });
});
