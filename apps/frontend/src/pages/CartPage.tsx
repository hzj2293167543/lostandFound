import { Form, useActionData, redirect } from 'react-router-dom';
import type { ActionFunctionArgs } from 'react-router-dom';

// action 用于处理表单提交
export async function action({ request }: ActionFunctionArgs) {
  const formData = await request.formData();
  const quantity = formData.get('quantity');
  // 处理加入购物车逻辑...
  // 可以返回数据给组件，或使用 redirect 跳转
  return redirect('/cart');
}

export default function CartPage() {
  const actionData = useActionData(); // 如果有返回数据，可以通过它获取
  return (
    <Form method="post">
      <input type="number" name="quantity" defaultValue={1} />
      <button type="submit">加入购物车</button>
    </Form>
  );
}
