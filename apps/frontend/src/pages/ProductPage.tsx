import { useLoaderData } from 'react-router-dom';
import type { LoaderFunctionArgs } from 'react-router-dom';

// 定义 loader 函数（可以是 async）
export async function loader({ params }: LoaderFunctionArgs) {
  const response = await fetch(`/api/products/${params.id}`);
  if (!response.ok) {
    throw new Response('Product not found', { status: 404 });
  }
  const product = await response.json();
  return product; // 返回的数据会通过 useLoaderData 获取
}

export default function ProductPage() {
  const product = useLoaderData(); // 自动获得 loader 返回的数据
  return (
    <div>
      <h1>{product.name}</h1>
      <p>{product.description}</p>
    </div>
  );
}
