import { NORMAL_DELAY } from '@/constants';
import { debounce, isString } from '@lostfound/shared';
import { ChangeEvent, useEffect, useMemo, useRef, useState, useTransition } from 'react';
import { Input } from '../ui/input';
import { Label } from '../ui/label';

interface SearchInputProps {
  label?: string;
  onSearch: (value: string) => void;
  placeholder?: string;
  delay?: number;
  showPending?: boolean;
  value?: string;
}

/**
 * 搜索输入组件
 * @param param0 搜索输入组件的属性
 * @param param0.onSearch 搜索回调函数，用于处理搜索输入
 * @param param0.placeholder 搜索输入占位符文本
 * @param param0.delay 搜索输入防抖延迟时间（毫秒）
 * @param param0.showPending 是否显示搜索中状态
 * @param param0.value 外部设置的搜索输入值
 * @returns 搜索输入组件的 JSX 元素
 */
export function SearchInput({
  onSearch,
  label = '搜索',
  delay = NORMAL_DELAY,
  placeholder = '搜索...',
  showPending = true,
  value: externalValue,
}: SearchInputProps) {
  const [localValue, setLocalValue] = useState(externalValue ?? '');
  const [isPending, startTransition] = useTransition();

  const isComposingRef = useRef(false);

  const onSearchRef = useRef(onSearch);
  useEffect(() => {
    onSearchRef.current = onSearch;
  }, [onSearch]);

  useEffect(() => {
    setLocalValue(externalValue ?? '');
  }, [externalValue]);

  const debouncedUpdate = useMemo(
    () =>
      debounce((value) => {
        if (!isString(value)) return;
        startTransition(() => {
          onSearchRef.current(value);
        });
      }, delay),
    [delay]
  );

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setLocalValue(newValue);

    // 读取 ref 的当前值
    if (!isComposingRef.current) {
      debouncedUpdate(newValue);
    }
  };

  const handleCompositionStart = () => {
    // 改变 ref 的值不会触发 re-render
    isComposingRef.current = true;
  };

  const handleCompositionEnd = (e: React.CompositionEvent<HTMLInputElement>) => {
    isComposingRef.current = false;
    debouncedUpdate(e.currentTarget.value);
  };

  return (
    <div className="space-y-2">
      <Label htmlFor="search-input">{label}</Label>
      <div className="relative">
        <Input
          id="search-input"
          placeholder={placeholder}
          value={localValue}
          onChange={handleChange}
          onCompositionStart={handleCompositionStart}
          onCompositionEnd={handleCompositionEnd}
        />
        {showPending && isPending && (
          <div className="absolute top-0 right-0 flex items-center">
            {isPending ? '搜索中...' : ''}
          </div>
        )}
      </div>
    </div>
  );
}
