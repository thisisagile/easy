import React from 'react';
import { renders, Tester, ElementTester } from '../src';
import { screen } from '@testing-library/dom';
import { mock } from '@thisisagile/easy-test';

describe('Tester', () => {
  const a = <div />;

  beforeEach(() => {
    (screen as any).getByText = mock.return(a);
    (screen as any).getByTestId = mock.return(a);
    (screen as any).getByRole = mock.return(a);
    (screen as any).getByPlaceholderText = mock.return(a);
  });

  test('renders returns Tester', () => {
    expect(renders(a)).toBeInstanceOf(Tester);
  });

  test('byText calls screen.getByText', () => {
    const t = renders(a);
    t.byText('');
    expect(screen.getByText).toHaveBeenCalledWith('');
  });

  test('byId calls screen.getByTestId', () => {
    const t = renders(a);
    t.byId('');
    expect(screen.getByTestId).toHaveBeenCalledWith('');
  });

  test('byRole calls screen.getByTestId', () => {
    const t = renders(a);
    t.byRole('');
    expect(screen.getByRole).toHaveBeenCalledWith('');
  });

  test('byPlaceholder calls screen.getByTestId', () => {
    const t = renders(a);
    t.byPlaceholder('');
    expect(screen.getByPlaceholderText).toHaveBeenCalledWith('');
  });

  test('at returns ElementTester', () => {
    const t = renders(a);
    expect(t.atText('')).toBeInstanceOf(ElementTester);
    expect(t.atId('')).toBeInstanceOf(ElementTester);
    expect(t.atRole('')).toBeInstanceOf(ElementTester);
    expect(t.atPlaceholder('')).toBeInstanceOf(ElementTester);
  });
});
