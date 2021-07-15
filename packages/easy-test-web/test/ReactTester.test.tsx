import React from 'react';
import { mock } from '@thisisagile/easy-test';

const render = mock.return({ container: <div /> });
const getByText = mock.return(<div />);
const getByTestId = mock.return(<div />);
const getByRole = mock.return(<div />);
const getByPlaceholderText = mock.return(<div />);
jest.mock('@testing-library/react', () => ({
  ...jest.requireActual('@testing-library/react'),
  render,
  getByText,
  getByTestId,
  getByRole,
  getByPlaceholderText,
}));
import { renders, ReactTester, ReactTestElement } from '../src';

describe('ReactTester', () => {
  const a = <div />;

  test('renders returns Tester', () => {
    expect(renders(a)).toBeInstanceOf(ReactTester);
    expect(render).toHaveBeenCalledWith(a);
  });

  test('byText calls screen.getByText', () => {
    const t = renders(a);
    t.byText('');
    expect(render).toHaveBeenCalledWith(a);
    expect(getByText).toHaveBeenCalledWith(a, '');
  });

  test('byId calls screen.getByTestId', () => {
    const t = renders(a);
    t.byId('');
    expect(render).toHaveBeenCalledWith(a);
    expect(getByTestId).toHaveBeenCalledWith(a, '');
  });

  test('byRole calls screen.getByTestId', () => {
    const t = renders(a);
    t.byRole('');
    expect(render).toHaveBeenCalledWith(a);
    expect(getByRole).toHaveBeenCalledWith(a, '');
  });

  test('byPlaceholder calls screen.getByTestId', () => {
    const t = renders(a);
    t.byPlaceholder('');
    expect(render).toHaveBeenCalledWith(a);
    expect(getByPlaceholderText).toHaveBeenCalledWith(a, '');
  });

  test('at returns ElementTester', () => {
    const t = renders(a);
    expect(render).toHaveBeenCalledWith(a);
    expect(t.atText('')).toBeInstanceOf(ReactTestElement);
    expect(t.atId('')).toBeInstanceOf(ReactTestElement);
    expect(t.atRole('')).toBeInstanceOf(ReactTestElement);
    expect(t.atPlaceholder('')).toBeInstanceOf(ReactTestElement);
  });
});
