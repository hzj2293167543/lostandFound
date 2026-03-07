import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Link } from 'react-router';
import FoundCreate from '../../components/FoundCreate';
import { Category } from '@lostfound/schema';

export default function FoundAction({ categories }: { categories: Category[] }) {
  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle>相关操作</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <Button className="w-full bg-green-600 hover:bg-green-700">
            <FoundCreate categories={categories} />
          </Button>
          <Button variant="outline" className="w-full">
            <Link to="/lost">查看失物信息</Link>
          </Button>
          <Button variant="outline" className="w-full">
            举报信息
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
