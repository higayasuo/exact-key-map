import { describe, it, expect } from 'vitest';
import { version } from '../index';

describe('index', () => {
  it('should return the same object and preserve types', () => {
    expect(version).toBe('0.1.0');
  });
});


