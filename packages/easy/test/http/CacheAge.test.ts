import {asNumber, CacheAge, toMilliseconds} from '../../src';
import '@thisisagile/easy-test';

describe('CacheAge', () => {

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
});