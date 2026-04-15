export function FallbackComponent() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4">
      <h1 className="text-2xl font-bold text-red-600 mb-4">出错了</h1>
      <p className="text-gray-600 mb-4">应用程序遇到了一个意外错误</p>
      <button
        onClick={() => window.location.reload()}
        className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
        刷新页面
      </button>
    </div>
  );
}
