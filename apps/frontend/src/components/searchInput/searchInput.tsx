import { NORMAL_DELAY } from '@/constants';
import { isString } from '@lostfound/shared';
import { ChangeEvent, useEffect, useEffectEvent, useRef, useState, useTransition } from 'react';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import type { CompositionEvent } from 'react';

interface SearchInputProps {
  showLabel?: boolean;
  label?: string;
  onSearch: (value: string) => void;
  placeholder?: string;
  delay?: number;
  showPending?: boolean;
  value?: string;
  className?: string;
}

/**
 * 搜索输入组件
 */
export function SearchInput({
  onSearch,
  showLabel = true,
  label = '搜索',
  delay = NORMAL_DELAY,
  placeholder = '搜索...',
  showPending = true,
  value: externalValue,
  className,
}: SearchInputProps) {
  const [localValue, setLocalValue] = useState(externalValue ?? '');
  const [isPending, startTransition] = useTransition();

  const isComposingRef = useRef(false);
  // 1. 使用 ref 存储定时器 ID
  const timerRef = useRef<number | null>(null);

  // 2. 保存最新的 onSearch 引用
  const onSearchRef = useRef(onSearch);
  useEffect(() => {
    onSearchRef.current = onSearch;
  }, [onSearch]);

  const handleUpdateLocal = useEffectEvent(() => {
    setLocalValue(externalValue ?? '');
  });

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    handleUpdateLocal();
  }, [externalValue]);

  // 3. 组件卸载时清理定时器
  useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, []);

  // 4. 提取一个普通的防抖执行函数（不要用 useMemo 包裹！）
  // 因为它只是一个普通函数，只在事件处理函数中被调用，编译器不会报错
  const triggerSearch = (value: string) => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }

    timerRef.current = window.setTimeout(() => {
      if (!isString(value)) return;
      startTransition(() => {
        onSearchRef.current(value); // 安全读取 ref
      });
    }, delay);
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setLocalValue(newValue);

    if (!isComposingRef.current) {
      triggerSearch(newValue);
    }
  };

  const handleCompositionStart = () => {
    isComposingRef.current = true;
  };

  const handleCompositionEnd = (e: CompositionEvent<HTMLInputElement>) => {
    isComposingRef.current = false;
    triggerSearch(e.currentTarget.value);
  };

  return (
    <div className="space-y-2">
      {showLabel && (
        <Label key="label" className="block" htmlFor="search-input">
          {label}
        </Label>
      )}
      <div className="relative">
        <Input
          id="search-input"
          className={className}
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
