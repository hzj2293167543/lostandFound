import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination';
import { Textarea } from '@/components/ui/textarea';
import { ItemTypeMap } from '@/types/type';
import { Comment } from '@lostfound/shared';
import { memo, useEffect, useState } from 'react';
import { Form, useActionData } from 'react-router-dom';
import { LOST_DETAIL_INTENT } from '../../type';
import CommentItem from './CommentItem';

const PAGE_SIZE = 10;

export default memo(function Comments({
  comments,
  itemId,
}: {
  comments: Comment[];
  itemId: number;
}) {
  const [content, setContent] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const actionData = useActionData();
  useEffect(() => {
    if (actionData?.intent === LOST_DETAIL_INTENT.COMMENT) {
      setContent('');
      setCurrentPage(1);
    }
  }, [actionData]);

  const [replyState, setReplyState] = useState<{ replyId: number | undefined }>({
    replyId: undefined,
  });
  const handleReplyStateChange = (id: number | undefined) => {
    setReplyState((prev) => ({ replyId: prev.replyId === id ? undefined : id }));
  };

  const totalComments = comments?.length || 0;
  const totalPages = Math.ceil(totalComments / PAGE_SIZE);
  const displayedComments = comments.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);

  return (
    <Card>
      <CardHeader>
        <CardTitle>评论 ({totalComments})</CardTitle>
        <CardDescription>请文明发言，共同帮助失主找回物品</CardDescription>
      </CardHeader>
      <CardContent>
        <Form method="post" className="mb-8">
          <input type="hidden" name="intent" value={LOST_DETAIL_INTENT.COMMENT} />
          <input type="hidden" name="itemId" value={itemId} />
          <input type="hidden" name="itemType" value={ItemTypeMap.LOST} />
          <div className="space-y-2">
            <Label htmlFor="comment">发表评论</Label>
            <Textarea
              id="content"
              name="content"
              placeholder="请输入你的评论..."
              className="resize-none"
              value={content}
              onChange={(e) => setContent(e.target.value)}
            />
          </div>
          <Button type="submit" className="mt-4 bg-blue-600 hover:bg-blue-700">
            提交评论
          </Button>
        </Form>

        {totalComments === 0 ? null : (
          <>
            <div className="space-y-6">
              {displayedComments.map((commentItem) => (
                <CommentItem
                  key={commentItem.id}
                  rootCommentId={commentItem.id}
                  comment={commentItem}
                  itemId={itemId}
                  replyState={{
                    replyId: replyState.replyId,
                    setReplyState: handleReplyStateChange,
                  }}
                />
              ))}
            </div>
            {totalPages > 1 && (
              <div className="mt-6">
                <Pagination>
                  <PaginationContent>
                    <PaginationItem>
                      <PaginationPrevious
                        href="#"
                        onClick={(e) => {
                          e.preventDefault();
                          setCurrentPage((p) => Math.max(1, p - 1));
                        }}
                        className={currentPage <= 1 ? 'pointer-events-none opacity-50' : ''}
                      />
                    </PaginationItem>
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                      <PaginationItem key={page}>
                        <PaginationLink
                          href="#"
                          isActive={page === currentPage}
                          onClick={(e) => {
                            e.preventDefault();
                            setCurrentPage(page);
                          }}>
                          {page}
                        </PaginationLink>
                      </PaginationItem>
                    ))}
                    <PaginationItem>
                      <PaginationNext
                        href="#"
                        onClick={(e) => {
                          e.preventDefault();
                          setCurrentPage((p) => Math.min(totalPages, p + 1));
                        }}
                        className={
                          currentPage >= totalPages ? 'pointer-events-none opacity-50' : ''
                        }
                      />
                    </PaginationItem>
                  </PaginationContent>
                </Pagination>
              </div>
            )}
          </>
        )}
      </CardContent>
    </Card>
  );
});
