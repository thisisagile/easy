import React from 'react';
import { mock } from '@thisisagile/easy-test';

const render = mock.return({ container: <div /> });
const getByText = mock.return(<div />);
const getByTestId = mock.return(<div />);
const getByTitle = mock.return(<div />);
const getByRole = mock.return(<div />);
const getByPlaceholderText = mock.return(<div />);
jest.mock('@testing-library/react', () => ({
  ...jest.requireActual('@testing-library/react'),
  render,
  screen: {
    getByText,
    getByTestId,
    getByTitle,
    getByRole,
    getByPlaceholderText,
  }
}));
import { ElementTester, renders, Tester } from '../src';

describe('Tester', () => {
  const a = <div />;

  test('renders returns Tester', () => {
    expect(renders(a)).toBeInstanceOf(Tester);
    expect(render).toHaveBeenCalledWith(a);
  });

  test('byText calls screen.getByText', () => {
    const t = renders(a);
    t.byText('');
    expect(render).toHaveBeenCalledWith(a);
    expect(getByText).toHaveBeenCalledWith('');
  });

  test('byId calls screen.getByTestId', () => {
    const t = renders(a);
    t.byId('');
    expect(render).toHaveBeenCalledWith(a);
    expect(getByTestId).toHaveBeenCalledWith('');
  });

  test('byTitle calls screen.getByTitle', () => {
    const t = renders(a);
    t.byTitle('');
    expect(render).toHaveBeenCalledWith(a);
    expect(getByTitle).toHaveBeenCalledWith('');
  });

  test('byRole calls screen.getByTestId', () => {
    const t = renders(a);
    t.byRole('');
    expect(render).toHaveBeenCalledWith(a);
    expect(getByRole).toHaveBeenCalledWith('');
  });

  test('byPlaceholder calls screen.getByTestId', () => {
    const t = renders(a);
    t.byPlaceholder('');
    expect(render).toHaveBeenCalledWith(a);
    expect(getByPlaceholderText).toHaveBeenCalledWith('');
  });

  test('at returns ElementTester', () => {
    const t = renders(a);
    expect(render).toHaveBeenCalledWith(a);
    expect(t.atText('')).toBeInstanceOf(ElementTester);
    expect(t.atTitle('')).toBeInstanceOf(ElementTester);
    expect(t.atId('')).toBeInstanceOf(ElementTester);
    expect(t.submit()).toBeInstanceOf(ElementTester);
    expect(t.atRole('')).toBeInstanceOf(ElementTester);
    expect(t.atPlaceholder('')).toBeInstanceOf(ElementTester);
  });
});
