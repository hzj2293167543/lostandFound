import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ReportDialog } from '@/components/ReportDialog/ReportDialog';
import { LostDetail, ReportTargetType } from '@lostfound/shared';
import { Link } from 'react-router';
import { useState } from 'react';

interface LostActionProps {
  lostDetail: LostDetail;
}

export default function LostAction({ lostDetail }: LostActionProps) {
  const [reportOpen, setReportOpen] = useState(false);

  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle>相关操作</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4 flex flex-col gap-1">
          <Link to="/lost" className="w-full">
            <Button
              variant="outline"
              className="w-full hover:bg-blue-600 text-white hover:text-white bg-blue-500">
              创建失物信息
            </Button>
          </Link>
          <Link to="/found">
            <Button variant="outline" className="w-full">
              查看招领信息
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
        targetType={ReportTargetType.LostItem}
        targetId={lostDetail.id}
        targetSnapshot={{ title: lostDetail.title, content: lostDetail.description }}
      />
    </Card>
  );
}
