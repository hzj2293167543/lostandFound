// pages/ErrorPage.tsx
import React from 'react';
import { useRouteError } from 'react-router-dom';

export default React.memo(function ErrorPage() {
  const error = useRouteError() as Error;
  return (
    <div>
      <h1>出错了！</h1>
      <p>{error.name + ': ' + error.message}</p>
    </div>
  );
});
