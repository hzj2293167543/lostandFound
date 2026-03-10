import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { type SyntheticEvent, useState } from 'react';
import { Comment } from '@lostfound/shared';
export default function Comments({
  comments,
  setComments,
}: {
  comments: Comment[];
  setComments: (comments: Comment[]) => void;
}) {
  const [comment, setComment] = useState('');
  // 提交评论
  const handleSubmitComment = (e: SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!comment.trim()) return;

    const newComment = {
      id: comments.length + 1,
      user: {
        id: 5,
        name: '当前用户',
        avatar:
          'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=user%20avatar%20default&image_size=square',
      },
      content: comment,
      time: new Date().toLocaleString('zh-CN'),
    };

    setComments([...comments, newComment]);
    setComment('');
  };
  return (
    <Card>
      <CardHeader>
        <CardTitle>评论 ({comments.length})</CardTitle>
        <CardDescription>请文明发言，确认物品信息</CardDescription>
      </CardHeader>
      <CardContent>
        {/* 发表评论 */}
        <form onSubmit={handleSubmitComment} className="mb-8">
          <div className="space-y-2">
            <Label htmlFor="comment">发表评论</Label>
            <Textarea
              id="comment"
              placeholder="请输入你的评论..."
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              className="resize-none"
            />
          </div>
          <Button type="submit" className="mt-4 bg-green-600 hover:bg-green-700">
            提交评论
          </Button>
        </form>

        {/* 评论列表 */}
        <div className="space-y-6">
          {comments.map((commentItem) => (
            <div key={commentItem.id} className="flex space-x-4">
              <img
                src={commentItem.user.avatar}
                alt={commentItem.user.name}
                className="w-10 h-10 rounded-full flex-shrink-0"
              />
              <div className="flex-1">
                <div className="flex justify-between items-start mb-1">
                  <h4 className="font-medium text-gray-800">{commentItem.user.name}</h4>
                  <span className="text-xs text-gray-500">{commentItem.time}</span>
                </div>
                <p className="text-gray-600">{commentItem.content}</p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
