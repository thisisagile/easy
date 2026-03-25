import React from 'react';
import { mock } from '@thisisagile/easy-test';
import { Uri } from '@thisisagile/easy';
import { render, screen } from '@testing-library/react';
import { ElementTester, renders, Tester } from '../src';

jest.mock('@testing-library/react', () => ({
  ...jest.requireActual('@testing-library/react'),
  render: jest.fn().mockReturnValue({ container: document.createElement('div') }),
  screen: {
    getAllByText: jest.fn().mockReturnValue([document.createElement('div')]),
    getAllByTestId: jest.fn().mockReturnValue([document.createElement('div')]),
    getAllByTitle: jest.fn().mockReturnValue([document.createElement('div')]),
    getAllByRole: jest.fn().mockReturnValue([document.createElement('div')]),
    getAllByPlaceholderText: jest.fn().mockReturnValue([document.createElement('div')]),
    getAllByAltText: jest.fn().mockReturnValue([document.createElement('div')]),
    getAllByLabelText: jest.fn().mockReturnValue([document.createElement('div')]),
    getAllByDisplayValue: jest.fn().mockReturnValue([document.createElement('div')]),
  },
}));

describe('Tester', () => {
  const a = <div />;

  test('renders returns Tester', () => {
    expect(renders(a)).toBeInstanceOf(Tester);
    expect(render).toHaveBeenCalledWith(a);
  });

  test('byText calls screen.getAllByText', () => {
    renders(a).byText('');
    expect(screen.getAllByText).toHaveBeenCalledWith('');
  });

  test('byId calls screen.getAllByTestId', () => {
    renders(a).byId('');
    expect(screen.getAllByTestId).toHaveBeenCalledWith('');
  });

  test('byTitle calls screen.getAllByTitle', () => {
    renders(a).byTitle('');
    expect(screen.getAllByTitle).toHaveBeenCalledWith('');
  });

  test('byRole calls screen.getAllByRole', () => {
    renders(a).byRole('');
    expect(screen.getAllByRole).toHaveBeenCalledWith('');
  });

  test('byPlaceholder calls screen.getAllByPlaceholderText', () => {
    renders(a).byPlaceholder('');
    expect(screen.getAllByPlaceholderText).toHaveBeenCalledWith('');
  });

  test('byAlt calls screen.getAllByAltText', () => {
    renders(a).byAlt('');
    expect(screen.getAllByAltText).toHaveBeenCalledWith('');
  });

  test('byLabel calls screen.getAllByLabelText', () => {
    renders(a).byLabel('');
    expect(screen.getAllByLabelText).toHaveBeenCalledWith('');
  });

  test('byValue calls screen.getAllByDisplayValue', () => {
    renders(a).byValue('');
    expect(screen.getAllByDisplayValue).toHaveBeenCalledWith('');
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
