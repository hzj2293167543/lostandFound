import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Link } from 'react-router';

export default function LostAction() {
  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle>相关操作</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <Button className="w-full bg-blue-600 hover:bg-blue-700">
            <Link to="/lost">发布失物信息</Link>
          </Button>
          <Button variant="outline" className="w-full">
            <Link to="/found">查看招领信息</Link>
          </Button>
          <Button variant="outline" className="w-full">
            举报信息
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
