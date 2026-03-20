import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Link } from 'react-router';

export default function FoundAction() {
  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle>相关操作</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4 flex flex-col gap-1">
          <Link to="/found">
            <Button className="w-full bg-green-600 hover:bg-green-700">发布招领信息</Button>
          </Link>
          <Link to="/lost">
            <Button variant="outline" className="w-full bg-white text-black hover:bg-gray-100">
              查看失物信息
            </Button>
          </Link>
          <Button variant="outline" className="w-full">
            举报信息
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
