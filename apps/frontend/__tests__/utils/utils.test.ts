import { describe, it, expect } from 'vitest';
import {
  formatDateForInput,
  buildTree,
  getFirstError,
  getErrorMsg,
  mapObjToFormData,
  safeParse,
} from '@/utils';
import { z } from 'zod';
import type { FieldErrors } from 'react-hook-form';
import type { CommentItem } from '@lostfound/shared';

describe('utils', () => {
  describe('formatDateForInput', () => {
    it('returns empty string for undefined', () => {
      expect(formatDateForInput(undefined)).toBe('');
    });

    it('returns empty string for invalid date', () => {
      expect(formatDateForInput('invalid-date')).toBe('');
    });

    it('formats valid date correctly', () => {
      const dateStr = '2024-01-15';
      const result = formatDateForInput(dateStr);
      expect(result).toMatch(/2024[-/]0?1[-/]0?15/);
    });

    it('returns same string if already in YYYY-MM-DD format', () => {
      expect(formatDateForInput('2024-01-15')).toBe('2024-01-15');
    });
  });

  describe('buildTree', () => {
    it('returns empty array for empty input', () => {
      expect(buildTree([])).toEqual([]);
    });

    it('builds tree structure correctly', () => {
      const items: CommentItem[] = [
        {
          id: 1,
          content: 'Root',
          parentId: null,
          rootId: null,
          replyUser: null,
          parent: undefined,
          user: { id: 1, name: 'User1' },
          time: new Date().toISOString(),
          isLiked: false,
          likeCount: 0,
          childrenCount: 1,
        },
        {
          id: 2,
          content: 'Child',
          parentId: 1,
          rootId: 1,
          replyUser: { id: 1, name: 'User1' },
          parent: undefined,
          user: { id: 2, name: 'User2' },
          time: new Date().toISOString(),
          isLiked: false,
          likeCount: 0,
          childrenCount: 0,
        },
      ];
      const result = buildTree(items);
      expect(result).toHaveLength(1);
      expect(result[0]?.children).toHaveLength(1);
    });
  });

  describe('getFirstError', () => {
    it('returns empty string for empty errors', () => {
      expect(getFirstError({} as FieldErrors)).toBe('');
    });

    it('returns first error message', () => {
      const errors = {
        name: { message: 'Name is required' },
        email: { message: 'Email is invalid' },
      } as unknown as FieldErrors;
      expect(getFirstError(errors)).toBe('Name is required');
    });
  });

  describe('getErrorMsg', () => {
    it('returns default message for null error', () => {
      expect(getErrorMsg(null)).toBe('请求失败');
    });

    it('returns default message for undefined error', () => {
      expect(getErrorMsg(undefined)).toBe('请求失败');
    });

    it('returns error message string for Error object', () => {
      const error = new Error('Error message');
      expect(getErrorMsg(error)).toBe('Error message');
    });

    it('returns error message string', () => {
      expect(getErrorMsg('Error message')).toBe('请求失败');
    });
  });

  describe('mapObjToFormData', () => {
    it('converts object to FormData', () => {
      const obj = { name: 'Test', value: 123 };
      const formData = mapObjToFormData(obj);
      expect(formData.get('name')).toBe('Test');
      expect(formData.get('value')).toBe('123');
    });
  });

  describe('safeParse', () => {
    it('throws error for invalid Zod schema', () => {
      expect(() => safeParse('not a schema', {})).toThrow('Invalid Zod schema');
    });

    it('throws error for invalid data', () => {
      const schema = z.object({ name: z.string() });
      expect(() => safeParse(schema, { name: 123 })).toThrow();
    });

    it('returns parsed object for valid data', () => {
      const schema = z.object({ name: z.string() });
      const result = safeParse(schema, { name: 'test' });
      expect(result).toEqual({ name: 'test' });
    });
  });
});
