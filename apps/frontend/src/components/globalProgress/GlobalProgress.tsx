// src/components/globalProgress/GlobalProgress.tsx
import { useEffect } from 'react';
import { useNavigation } from 'react-router-dom';
import { useIsFetching, useIsMutating } from '@tanstack/react-query';
import NProgress from 'nprogress';
import 'nprogress/nprogress.css';

NProgress.configure({ showSpinner: false, trickleSpeed: 200 });

export default function GlobalProgress() {
  const navigation = useNavigation();
  const isFetching = useIsFetching(); // 全局查询请求数
  const isMutating = useIsMutating(); // 全局变更请求数

  const isLoadingRoute = navigation.state === 'loading';
  const isRequesting = isFetching + isMutating > 0;

  useEffect(() => {
    if (isLoadingRoute || isRequesting) {
      NProgress.start();
    } else {
      NProgress.done();
    }
  }, [isLoadingRoute, isRequesting]);

  return null;
}
