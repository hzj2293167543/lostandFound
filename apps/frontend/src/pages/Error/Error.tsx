import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { ArrowLeft, Home } from 'lucide-react';
import { isRouteErrorResponse, Link, useRouteError } from 'react-router-dom';
import { memo } from 'react';

export default memo(function ErrorPage() {
  const error = useRouteError();

  let title = '出错了！';
  let message = '发生了未知错误';

  if (isRouteErrorResponse(error)) {
    title = error.status === 404 ? '页面不存在' : `错误 ${error.status}`;
    message = error.status === 404 ? '您访问的页面不存在或已被移除' : error.statusText || message;
  } else if (error instanceof Error) {
    message = error.message;
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <Card className="max-w-md w-full mx-4">
        <CardContent className="pt-6 pb-8 text-center">
          <h1 className="text-6xl font-bold text-gray-300 mb-4">
            {isRouteErrorResponse(error) && error.status === 404 ? '404' : '!'}
          </h1>
          <h2 className="text-2xl font-semibold text-gray-800 mb-2">{title}</h2>
          <p className="text-gray-600 mb-8">{message}</p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Button
              variant="outline"
              onClick={() => window.history.back()}
              className="flex items-center gap-2">
              <ArrowLeft className="w-4 h-4" />
              返回上一页
            </Button>
            <Button asChild className="flex items-center gap-2">
              <Link to="/">
                <Home className="w-4 h-4" />
                返回首页
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
});
