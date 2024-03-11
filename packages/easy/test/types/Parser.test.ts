import { ErrorOrigin, Exception, Get, isDefined, ofGet, Parser, reject, resolve } from '../../src';
import { Dev } from '../ref';

class TestParser extends Parser<number, number> {
  multiply = (): number => (this.valid ? this.value * 2 : this.value * 3);
}

const parse = (value: number) => new TestParser(value);

describe('TestParser', () => {
  test('just parse', () => {
    expect(parse(2).multiply()).toBe(4);
  });

  test('parse with if', () => {
    expect(parse(2).if.empty().multiply()).toBe(6);
    expect(parse(2).if.not.empty().multiply()).toBe(4);
  });

  test('parse with if defined', () => {
    expect(parse(2).if.defined().multiply()).toBe(4);
    expect(parse(2).if.not.defined().multiply()).toBe(6);
  });

  test('parse with object and predicate', () => {
    expect(parse(2).if.is.object().multiply()).toBe(6);
    expect(parse(2).if.is.string().multiply()).toBe(6);
  });
});

class WhenParser<T, V> extends Parser<T, V> {
  is = this.if;

  reject(error?: Get<ErrorOrigin, T>): Promise<NonNullable<T>> {
    return !this.valid ? resolve(this.value as NonNullable<T>) : reject(ofGet(error, this.value) ?? Exception.Unknown);
  }

  recover(f: (item: T) => T | Promise<T>): Promise<T> {
    return resolve(this.valid ? this.value : f(this.value));
  }
}

const when = <T>(value: T) => new WhenParser<T, T>(value, false);

describe('WhenParser', () => {
  test('just reject', async () => {
    await expect(when(2).reject()).resolves.toBe(2);
    await expect(when(2).reject('Error')).resolves.toBe(2);
    await expect(when(2).reject({ message: 'Error' })).resolves.toBe(2);
  });

  test('just recover', async () => {
    await expect(when(2).recover(() => 6)).resolves.toBe(6);
    await expect(when(2).recover(v => v * 2)).resolves.toBe(4);
  });

  test('just then', async () => {
    await expect(
      when(2)
        .if.empty()
        .reject()
        .then(v => v * 2)
    ).resolves.toBe(4);
    await expect(
      when(2)
        .if.not.empty()
        .reject()
        .then(v => v * 2)
    ).rejects.toBe(Exception.Unknown);
  });

  test('reject with if', async () => {
    await expect(when(2).is.empty().reject()).resolves.toBe(2);
    await expect(when(2).is.not.empty().reject()).rejects.toBe(Exception.Unknown);
  });

  test('reject with if defined', async () => {
    await expect(when(2).is.defined().reject()).rejects.toBe(Exception.Unknown);
    await expect(when(2).is.not.defined().reject()).resolves.toBe(2);
    await expect(when(undefined).is.not.defined().reject()).rejects.toBe(Exception.Unknown);
    await expect(
      when(undefined)
        .if.defined()
        .reject()
        .then(() => 2)
    ).resolves.toBe(2);
  });

  test('reject with object and predicate', async () => {
    await expect(when(2).if.is.object().reject()).resolves.toBe(2);
    await expect(when(2).if.not.is.string().reject()).rejects.toBe(Exception.Unknown);
  });

  test('reject with object', async () => {
    await expect(
      when({ id: 3 })
        .if.not.is.object()
        .reject()
        .then(i => i.id * 2)
    ).resolves.toBe(6);
    await expect(when({}).if.is.object().reject(Exception.IsNotValid)).rejects.toBe(Exception.IsNotValid);
    await expect(
      when({ id: 3 })
        .if.defined(i => i.id)
        .reject()
    ).rejects.toBe(Exception.Unknown);
    await expect(
      when({ id: 3 })
        .if.not.defined(i => i.id)
        .reject()
    ).resolves.toEqual({ id: 3 });
  });

  test('reject with instance', async () => {
    await expect(when(Dev.Sander).if.not.is.instance(Dev).reject()).resolves.toEqual(Dev.Sander);
    await expect(when(Dev.Eugen).if.is.instance(Dev).reject()).rejects.toBe(Exception.Unknown);
  });

  test('reject and recover with if.in and if.not.in', async () => {
    await expect(when(2).if.in(1, 2, 3).reject()).rejects.toBe(Exception.Unknown);
    await expect(when(2).if.not.in(1, 2, 3).reject()).resolves.toBe(2);
    await expect(
      when(2)
        .if.not.in(1, 2, 3)
        .recover(() => 3)
    ).resolves.toBe(3);
    await expect(
      when(2)
        .if.in(1, 2, 3)
        .recover(() => 3)
    ).resolves.toBe(2);
  });
});

type Test = { id: number; name?: string };

class Caller {
  double = (value: Test) => value.id * 2;
  add = (value: Test, add: number) => value.id + add;
}

class NestedParser extends Parser<Test, Test> {
  constructor(
    protected value: Test,
    protected caller = new Caller()
  ) {
    super(value, true);
  }

  call = () => (this.valid ? this.caller.double(this.value) : this.caller.add(this.value, 1));

  callerExists = () => isDefined(this.caller);
}

const nested = <T>(value: Test) => new NestedParser(value);

describe('NestedParser', () => {
  test('just call', () => {
    expect(nested({ id: 2 }).call()).toBe(4);
  });

  test('call with caller', () => {
    expect(nested({ id: 3 }).call()).toBe(6);
    expect(
      nested({ id: 4 })
        .if.empty(t => t.name)
        .call()
    ).toBe(8);
    expect(
      nested({ id: 5 })
        .if.not.empty(t => t.name)
        .call()
    ).toBe(6);
  });
});
