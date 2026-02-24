// pages/ErrorPage.tsx
import { useRouteError } from 'react-router-dom';

export default function ErrorPage() {
  const error = useRouteError() as any;
  return (
    <div>
      <h1>出错了！</h1>
      <p>{error.statusText || error.message}</p>
    </div>
  );
}
