import { mock } from '@thisisagile/easy-test';
import { ElementHandle, JSHandle } from 'puppeteer';
import { PuppeteerElement } from '../src';

describe('PuppeteerElement', () => {
  test('click.', async () => {
    const eh = mock.empty<ElementHandle>({ click: mock.return() });
    const pe = new PuppeteerElement(Promise.resolve(eh));

    await pe.click();
    expect(eh.click).toHaveBeenCalled();
  });

  test('type.', async () => {
    const eh = mock.empty<ElementHandle>({ type: mock.return() });
    const pe = new PuppeteerElement(Promise.resolve(eh));
    await pe.type('123');
    expect(eh.type).toHaveBeenCalledWith('123');
  });

  test('press.', async () => {
    const eh = mock.empty<ElementHandle>({ press: mock.return() });
    const pe = new PuppeteerElement(Promise.resolve(eh));
    await pe.press('Enter');
    expect(eh.press).toHaveBeenCalledWith('Enter');
  });

  test('property.', async () => {
    const p = mock.empty<JSHandle>({ jsonValue: mock.return() });
    const eh = mock.empty<ElementHandle>({ getProperty: mock.resolve(p) });
    const pe = new PuppeteerElement(Promise.resolve(eh));
    await pe.property('textContent');
    expect(eh.getProperty).toHaveBeenCalledWith('textContent');
    expect(p.jsonValue).toHaveBeenCalled();
  });

  test('exists.', async () => {
    const found = new PuppeteerElement(Promise.resolve(mock.empty<ElementHandle>()));
    const notFound = new PuppeteerElement(Promise.resolve(undefined as unknown as ElementHandle));
    await expect(found.exists()).resolves.toBeTruthy();
    await expect(notFound.exists()).resolves.toBeFalsy();
  });
});
