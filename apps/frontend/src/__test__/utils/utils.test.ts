import { describe, it, expect } from 'vitest';
import {
  formatDateForInput,
  buildTree,
  getFirstError,
  getErrorMsg,
  mapObjToFormData,
  safeParse,
} from '../../utils';

describe('utils', () => {
  describe('formatDateForInput', () => {
    it('returns empty string for undefined', () => {
      // @ts-expect-error – 故意传入错误类型以测试组件容错性
      expect(formatDateForInput()).toBe('');
    });

    it('returns empty string for invalid date', () => {
      expect(formatDateForInput('invalid-date')).toBe('');
    });

    it('returns YYYY-MM-DD format as is', () => {
      expect(formatDateForInput('2024-01-15')).toBe('2024-01-15');
    });

    it('converts YYYY/MM/DD to YYYY-MM-DD', () => {
      expect(formatDateForInput('2024/01/15')).toBe('2024-01-15');
    });
  });

  describe('buildTree', () => {
    it('returns empty array for empty input', () => {
      expect(buildTree([])).toEqual([]);
    });

    it('builds tree with root comments only', () => {
      const comments = [
        {
          id: 1,
          parentId: null,
          time: '2024-01-01',
          content: 'root1',
          user: { id: 1, name: 'User1', avatar: '' },
          children: [],
        },
        {
          id: 2,
          parentId: null,
          time: '2024-01-02',
          content: 'root2',
          user: { id: 2, name: 'User2', avatar: '' },
          children: [],
        },
      ];
      const tree = buildTree(comments as any);
      expect(tree).toHaveLength(2);
      expect(tree[0].id).toBe(1);
    });

    it('builds tree with nested comments', () => {
      const comments = [
        {
          id: 1,
          parentId: null,
          time: '2024-01-01',
          content: 'root',
          user: { id: 1, name: 'User1', avatar: '' },
          children: [],
        },
        {
          id: 2,
          parentId: 1,
          time: '2024-01-02',
          content: 'reply',
          user: { id: 2, name: 'User2', avatar: '' },
          children: [],
        },
      ];
      const tree = buildTree(comments as any);
      expect(tree).toHaveLength(1);
      expect(tree[0].children).toHaveLength(1);
    });
  });
});

describe('form', () => {
  describe('getFirstError', () => {
    it('returns first error message', () => {
      const errors = {
        email: { message: 'Invalid email' },
        name: { message: 'Name required' },
      } as any;
      expect(getFirstError(errors)).toBe('Invalid email');
    });

    it('returns empty string for empty errors', () => {
      expect(getFirstError({})).toBe('');
    });
  });

  describe('getErrorMsg', () => {
    it('returns default message for unknown error', () => {
      expect(getErrorMsg('unknown')).toBe('请求失败');
    });

    it('returns custom default message', () => {
      expect(getErrorMsg('unknown', 'Error')).toBe('Error');
    });
  });

  describe('mapObjToFormData', () => {
    it('converts object to FormData', () => {
      const obj = { name: 'test', age: 20 };
      const formData = mapObjToFormData(obj);
      expect(formData.get('name')).toBe('test');
      expect(formData.get('age')).toBe('20');
    });

    it('filters included keys', () => {
      const obj = { name: 'test', age: 20, hidden: 'value' };
      const formData = mapObjToFormData(obj, ['name']);
      expect(formData.get('name')).toBe('test');
      expect(formData.get('age')).toBeNull();
    });
  });

  describe('safeParse', () => {
    it('parses valid data', () => {
      const schema = { parse: (data: any) => data };
      const result = safeParse(schema, { name: 'test' });
      expect(result).toEqual({ name: 'test' });
    });

    it('returns null for invalid data', () => {
      const schema = {
        parse: () => {
          throw new Error('invalid');
        },
      };
      expect(safeParse(schema, {})).toBeNull();
    });
  });
});
