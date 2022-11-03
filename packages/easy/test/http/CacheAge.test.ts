import {asNumber, cacheAge, CacheAge} from '../../src';
import '@thisisagile/easy-test';

describe('CacheAge', () => {

    const {toMilliseconds, toSeconds} = cacheAge;

    test('toMilliseconds works', () => {
        expect(asNumber('10ms')).toBe(10);
        expect(toMilliseconds(0)).toBe(0);
        expect(toMilliseconds(10)).toBe(10);
        expect(toMilliseconds('10ms')).toBe(10);
        expect(toMilliseconds('10s')).toBe(10000);
        expect(toMilliseconds('3m')).toBe(180000);
        expect(toMilliseconds('2h')).toBe(7200000);
        expect(toMilliseconds('1d')).toBe(86400000);
    });

    test('toSeconds works', () => {
        expect(asNumber('10s')).toBe(10);
        expect(toSeconds(0)).toBe(0);
        expect(toSeconds(10)).toBe(10);
        expect(toSeconds('1000ms')).toBe(1);
        expect(toSeconds('10s')).toBe(10);
        expect(toSeconds('3m')).toBe(180);
        expect(toSeconds('2h')).toBe(7200);
        expect(toSeconds('1d')).toBe(86400);
    });
});