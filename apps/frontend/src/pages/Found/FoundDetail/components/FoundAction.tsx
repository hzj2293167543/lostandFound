import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ReportDialog } from '@/components/ReportDialog/ReportDialog';
import { FoundDetail, ReportTargetType } from '@lostfound/shared';
import { Link } from 'react-router';
import { useState } from 'react';

interface FoundActionProps {
  foundDetail: FoundDetail;
}

export default function FoundAction({ foundDetail }: FoundActionProps) {
  const [reportOpen, setReportOpen] = useState(false);

  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle>相关操作</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4 flex flex-col gap-1">
          <Link to="/found">
            <Button className="w-full bg-green-600 hover:bg-green-700 ">发布招领信息</Button>
          </Link>
          <Link to="/lost">
            <Button variant="outline" className="w-full">
              查看失物信息
            </Button>
          </Link>
          <Button variant="outline" className="w-full" onClick={() => setReportOpen(true)}>
            举报信息
          </Button>
        </div>
      </CardContent>
      <ReportDialog
        open={reportOpen}
        onOpenChange={setReportOpen}
        targetType={ReportTargetType.FoundItem}
        targetId={foundDetail.id}
        targetSnapshot={{ title: foundDetail.title, content: foundDetail.description }}
      />
    </Card>
  );
}
