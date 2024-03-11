import { ErrorOrigin, Exception, Get, ofGet, Parser, reject, resolve } from '../../src';
import { Dev } from '../ref';

class TestParser<T, V> extends Parser<T, V> {
  positive = (): V => ofGet(this.valid ? this.f : this.alt, this.value);
}

const parse = (value: number) =>
  new TestParser(
    value,
    v => v * 2,
    v => v * 3
  );
const parseObject = (value: { id: number }) =>
  new TestParser(
    value,
    v => v.id * 2,
    v => v.id * 3
  );

describe('TestParser', () => {
  test('just parse', () => {
    expect(parse(2).positive()).toBe(4);
  });

  test('parse with if', () => {
    expect(parse(2).if.empty().positive()).toBe(6);
    expect(parse(2).if.not.empty().positive()).toBe(4);
  });

  test('parse with if defined', () => {
    expect(parse(2).if.defined().positive()).toBe(4);
    expect(parse(2).if.not.defined().positive()).toBe(6);
  });

  test('parse with object and predicate', () => {
    expect(parse(2).if.is.object().positive()).toBe(6);
    expect(parse(2).if.is.string().positive()).toBe(6);
  });

  test('parse with not object and predicate', () => {
    expect(parseObject({ id: 5 }).positive()).toBe(10);
    expect(parseObject({ id: 5 }).if.is.object().positive()).toBe(10);
    expect(parseObject({ id: 5 }).if.empty().positive()).toBe(15);
    expect(parseObject({ id: 5 }).if.not.empty().positive()).toBe(10);
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

const when = <T>(value: T) =>
  new WhenParser<T, T>(
    value,
    v => v,
    v => v,
    false
  );

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
