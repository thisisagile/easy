import React from 'react';
import { mock } from '@thisisagile/easy-test';
import { fireEvent, screen } from '@testing-library/react';
import { ElementTester, renders, Tester } from '../src';

jest.mock('@testing-library/react', () => ({
  ...jest.requireActual('@testing-library/react'),
  screen: { getByText: jest.fn().mockReturnValue(<div />) },
}));

describe('ElementTester', () => {
  const a = <div />;
  const e = mock.empty<Element & { value: string }>({ value: '43' });
  let et: ElementTester;

  beforeEach(() => {
    et = renders(a).atText('');
  });

  test('get value', () => {
    expect(new ElementTester(() => e).value).toBe('43');
  });

  test('is valid', () => {
    expect(new ElementTester(() => e).isValid).toBeTruthy();
  });

  test('is not valid', () => {
    expect(new ElementTester(undefined as unknown as () => Element).isValid).toBeFalsy();
  });

  test('then returns new Tester', () => {
    const t = new ElementTester(() => e).then;
    expect(t).toBeInstanceOf(Tester);
    expect(t.container).toBe(e);
  });

  test('click fires click event', () => {
    fireEvent.click = mock.return(true);
    expect(et.click()).toBe(et);
    expect(screen.getByText).toHaveBeenCalled();
    expect(fireEvent.click).toHaveBeenCalledWith(a);
  });

  test('click fires click event but fails', () => {
    fireEvent.click = mock.return(false);
    expect(et.click()).not.toBeValid();
    expect(screen.getByText).toHaveBeenCalled();
    expect(fireEvent.click).toHaveBeenCalledWith(a);
  });

  test('mouseDown fires mousedown event', () => {
    fireEvent.mouseDown = mock.return(true);
    expect(et.mouseDown()).toBe(et);
    expect(screen.getByText).toHaveBeenCalled();
    expect(fireEvent.mouseDown).toHaveBeenCalledWith(a);
  });

  test('mouseDown fires mousedown on child', () => {
    fireEvent.mouseDown = mock.return(true);
    const children = [mock.a<Element>()] as unknown as HTMLCollection;
    const elementTester = new ElementTester(() => mock.a<HTMLElement>({ children }));
    expect(elementTester.mouseDown(0)).toBe(elementTester);
    expect(fireEvent.mouseDown).toHaveBeenCalledWith(children[0]);
  });

  test('mouseDown fires mouseDown event but fails', () => {
    fireEvent.mouseDown = mock.return(false);
    expect(et.mouseDown()).not.toBeValid();
    expect(screen.getByText).toHaveBeenCalled();
    expect(fireEvent.mouseDown).toHaveBeenCalledWith(a);
  });

  test('type fires value change event', () => {
    fireEvent.change = mock.return();
    const value = 'hello';
    et.type(value);
    expect(screen.getByText).toHaveBeenCalled();
    expect(fireEvent.change).toHaveBeenCalledWith(a, { target: { value } });
  });

  test('keyDown fires keydown event', () => {
    fireEvent.keyDown = mock.return(true);
    const key = 'Enter';
    et.keyDown(key);
    expect(screen.getByText).toHaveBeenCalled();
    expect(fireEvent.keyDown).toHaveBeenCalledWith(a, { key });
  });

  test('pressEnter fires keydown event', () => {
    fireEvent.keyDown = mock.return(true);
    et.pressEnter();
    expect(screen.getByText).toHaveBeenCalled();
    expect(fireEvent.keyDown).toHaveBeenCalledWith(a, { key: 'Enter' });
  });
});
