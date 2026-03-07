import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter,
} from '@/components/ui/card';
import { Comment } from '@lostfound/schema';
import { memo, useState } from 'react';

export default memo(function PersonalInfoDetailComments({ comments }: { comments: Comment[] }) {
  const [expandedComments, setExpandedComments] = useState<Record<number, boolean>>({});

  const toggleComment = (commentId: number) => {
    setExpandedComments((prev) => ({
      ...prev,
      [commentId]: !prev[commentId],
    }));
  };
  return (
    <>
      <h2 className="text-2xl font-bold mb-6">我的评论</h2>
      {comments.length === 0 ? (
        <Card>
          <CardContent>
            <p className="text-gray-600 text-center py-12">暂无评论记录</p>
          </CardContent>
        </Card>
      ) : (
        comments.map((comment) => {
          return (
            <Card key={comment.id} className="flex flex-col">
              <CardHeader>
                <CardTitle>发布时间：{new Date(comment.time).toLocaleString()}</CardTitle>
                <CardDescription className={expandedComments[comment.id] ? '' : 'line-clamp-3'}>
                  {comment.content}
                </CardDescription>
              </CardHeader>
              <CardFooter className="mt-auto">
                <Button
                  variant="outline"
                  className="ml-auto"
                  onClick={() => toggleComment(comment.id)}>
                  {expandedComments[comment.id] ? '收起' : '查看详情'}
                </Button>
              </CardFooter>
            </Card>
          );
        })
      )}
    </>
  );
});
