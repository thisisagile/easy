import React from 'react';
import { mock } from '@thisisagile/easy-test';

const render = mock.return({ container: <div /> });
const getAllByText = mock.return([<div />]);
const getAllByTestId = mock.return([<div />]);
const getAllByTitle = mock.return([<div />]);
const getAllByRole = mock.return([<div />]);
const getAllByPlaceholderText = mock.return([<div />]);
const getAllByAltText = mock.return([<div />]);
const getAllByLabelText = mock.return([<div />]);
const getAllByDisplayValue = mock.return([<div />]);
jest.mock('@testing-library/react', () => ({
  ...jest.requireActual('@testing-library/react'),
  render,
  screen: {
    getAllByText,
    getAllByTestId,
    getAllByTitle,
    getAllByRole,
    getAllByPlaceholderText,
    getAllByAltText,
    getAllByLabelText,
    getAllByDisplayValue,
  },
}));
import { ElementTester, renders, Tester } from '../src';

describe('Tester', () => {
  const a = <div />;

  test('renders returns Tester', () => {
    expect(renders(a)).toBeInstanceOf(Tester);
    expect(render).toHaveBeenCalledWith(a);
  });

  test('byText calls screen.getAllByText', () => {
    const t = renders(a);
    t.byText('');
    expect(getAllByText).toHaveBeenCalledWith('');
  });

  test('byId calls screen.getAllByTestId', () => {
    const t = renders(a);
    t.byId('');
    expect(getAllByTestId).toHaveBeenCalledWith('');
  });

  test('byTitle calls screen.getAllByTitle', () => {
    const t = renders(a);
    t.byTitle('');
    expect(getAllByTitle).toHaveBeenCalledWith('');
  });

  test('byRole calls screen.getAllByRole', () => {
    const t = renders(a);
    t.byRole('');
    expect(getAllByRole).toHaveBeenCalledWith('');
  });

  test('byPlaceholder calls screen.getAllByPlaceholderText', () => {
    const t = renders(a);
    t.byPlaceholder('');
    expect(getAllByPlaceholderText).toHaveBeenCalledWith('');
  });

  test('byAlt calls screen.getAllByAltText', () => {
    const t = renders(a);
    t.byAlt('');
    expect(getAllByAltText).toHaveBeenCalledWith('');
  });

  test('byLabel calls screen.getAllByLabelText', () => {
    const t = renders(a);
    t.byLabel('');
    expect(getAllByLabelText).toHaveBeenCalledWith('');
  });

  test('byValue calls screen.getAllByDisplayValue', () => {
    const t = renders(a);
    t.byValue('');
    expect(getAllByDisplayValue).toHaveBeenCalledWith('');
  });

  test('at returns ElementTester', () => {
    const t = renders(a);
    expect(t.atText('')).toBeInstanceOf(ElementTester);
    expect(t.atTitle('')).toBeInstanceOf(ElementTester);
    expect(t.atId('')).toBeInstanceOf(ElementTester);
    expect(t.atRole('')).toBeInstanceOf(ElementTester);
    expect(t.atPlaceholder('')).toBeInstanceOf(ElementTester);
    expect(t.atAlt('')).toBeInstanceOf(ElementTester);
    expect(t.atLabel('')).toBeInstanceOf(ElementTester);
    expect(t.atValue('')).toBeInstanceOf(ElementTester);
    expect(t.submit()).toBeInstanceOf(ElementTester);
  });
});
