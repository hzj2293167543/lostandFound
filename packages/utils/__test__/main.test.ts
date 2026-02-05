import { expect } from 'vitest';
import { it } from 'vitest';
import { describe } from 'vitest';
import * as math from '../dist/math.js';

describe('math utils', () => {
    it('add:1+2=3', () => {
        expect(math.sum(1, 2)).toBe(3);
    });
    it('subtract:5-2=3', () => {
        expect(math.sub(5, 2)).toBe(3);
    });
    it('multiply:2 * 3= 6', () => {
        expect(math.mul(2, 3)).toBe(6);
    });
});
