import { useRef, useCallback, useEffect, useState, DependencyList } from 'react';

// 全局单例，存放观察者实例和元素到更新器的映射
let globalObserver: ResizeObserver | null = null;
const elementsMap = new Map<Element, (isOverflowing: boolean) => void>();

function initGlobalObserver() {
  if (globalObserver) return;
  globalObserver = new ResizeObserver((entries) => {
    for (const entry of entries) {
      const el = entry.target;
      const setOverflow = elementsMap.get(el);
      if (setOverflow) {
        // 计算是否溢出（这里可以根据需要传入 line-clamp 的高度阈值）
        const isOverflowing = el.scrollHeight > el.clientHeight + 2;
        setOverflow(isOverflowing);
      }
    }
  });
}

export function useOverflowDetector(isExpanded: boolean, deps: DependencyList = []) {
  const ref = useRef<HTMLElement | null>(null);
  const [showExpandBtn, setShowExpandBtn] = useState(false);

  // 注册/注销元素的回调
  const registerElement = useCallback((el: HTMLElement | null) => {
    if (!el) return;

    // 确保全局观察者已初始化
    initGlobalObserver();

    // 如果之前已经注册过，先清理
    if (ref.current && elementsMap.has(ref.current)) {
      globalObserver?.unobserve(ref.current);
      elementsMap.delete(ref.current);
    }

    ref.current = el;
    elementsMap.set(el, setShowExpandBtn);
    globalObserver?.observe(el);

    // 立即进行一次检测（确保初始状态正确）
    const isOverflowing = el.scrollHeight > el.clientHeight + 2;
    setShowExpandBtn(isOverflowing);
  }, []);

  // 当组件卸载或依赖变化时，注销元素
  useEffect(() => {
    return () => {
      if (ref.current && elementsMap.has(ref.current)) {
        globalObserver?.unobserve(ref.current);
        elementsMap.delete(ref.current);
        ref.current = null;
      }
    };
  }, []);

  // 当 isExpanded 变化时，重新检测一次（因为展开后可能不需要按钮）
  useEffect(() => {
    if (!isExpanded && ref.current) {
      const isOverflowing = ref.current.scrollHeight > ref.current.clientHeight + 2;
      setShowExpandBtn(isOverflowing);
    } else if (isExpanded) {
      // 展开时按钮应该由父组件控制，这里可以置为 false 或保持原来的状态
      // 为了避免闪烁，可以保留按钮，因为父组件会控制显示 "收起"
      // 但为了逻辑清晰，我们仍然保持现有值，不影响父组件传递的 isExpanded
    }
  }, [isExpanded]);

  // 依赖 deps 变化时重新检测（如 comment.content 变化）
  useEffect(() => {
    if (!isExpanded && ref.current) {
      const isOverflowing = ref.current.scrollHeight > ref.current.clientHeight + 2;
      setShowExpandBtn(isOverflowing);
    }
  }, [deps, isExpanded]);

  return { ref: registerElement, showExpandBtn };
}
