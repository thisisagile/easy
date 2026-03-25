import React from 'react';
import { mock } from '@thisisagile/easy-test';
import { Uri } from '@thisisagile/easy';
import { ElementTester, renders, Tester } from '../src';

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

  test('byHref finds link by string href', () => {
    const container = document.createElement('div');
    container.innerHTML = '<a href="https://example2.com">link</a>';
    expect(new Tester(container).byHref('example2')).not.toBeNull();
  });

  test('byHref finds link by Uri href', () => {
    const container = document.createElement('div');
    container.innerHTML = '<a href="https://example.com">link</a>';
    const u = mock.a<Uri>({ toString: () => 'example' });
    expect(new Tester(container).byHref(u)).not.toBeNull();
  });

  test('atHref returns ElementTester', () => {
    const container = document.createElement('div');
    container.innerHTML = '<a href="https://example.com">link</a>';
    expect(new Tester(container).atHref('example')).toBeInstanceOf(ElementTester);
  });

  test('isEmpty is true when container has no content', () => {
    const empty = document.createElement('div');
    expect(new Tester(empty).isEmpty).toBeTruthy();
  });

  test('isEmpty is false when container has content', () => {
    const full = document.createElement('div');
    full.innerHTML = '<span />';
    expect(new Tester(full).isEmpty).toBeFalsy();
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
