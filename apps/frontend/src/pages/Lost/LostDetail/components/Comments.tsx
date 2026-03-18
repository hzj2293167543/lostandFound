import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationPrevious,
  PaginationLink,
  PaginationNext,
} from '@/components/ui/pagination';
import { Textarea } from '@/components/ui/textarea';
import { ItemTypeMap } from '@/types/type';
import { Comment } from '@lostfound/shared';
import { memo, useEffect, useState } from 'react';
import { useActionData, useSubmit } from 'react-router-dom';
import { LOST_DETAIL_INTENT } from '../../type';
import CommentItem from './CommentItem';
import { zodResolver } from '@hookform/resolvers/zod';
import { FieldErrors, useForm } from 'react-hook-form';
import * as z from 'zod';
import { Form, FormControl, FormField, FormItem, FormMessage } from '@/components/ui/form';
import { getErrorMsg } from '@/utils';
import { toast } from 'sonner';

const commentSchema = z.object({
  content: z.string().min(1, '评论内容不能为空'),
});

type CommentFormValues = z.infer<typeof commentSchema>;

const PAGE_SIZE = 10;

export default memo(function Comments({
  comments,
  itemId,
}: {
  comments: Comment[];
  itemId: number;
}) {
  'use no memo';
  const [currentPage, setCurrentPage] = useState(1);
  const actionData = useActionData<{ success: boolean; intent?: number; error?: string }>();
  const submit = useSubmit();

  const form = useForm<CommentFormValues>({
    resolver: zodResolver(commentSchema),
    defaultValues: {
      content: '',
    },
  });

  useEffect(() => {
    if (actionData?.intent === LOST_DETAIL_INTENT.COMMENT && actionData.success) {
      form.reset();
      setCurrentPage(1);
    }
  }, [actionData, form]);

  const [replyState, setReplyState] = useState<{ replyId: number | undefined }>({
    replyId: undefined,
  });
  const handleReplyStateChange = (id: number | undefined) => {
    setReplyState((prev) => ({ replyId: prev.replyId === id ? undefined : id }));
  };

  const onSubmit = async (data: CommentFormValues) => {
    const payload = {
      intent: LOST_DETAIL_INTENT.COMMENT,
      parentId: null,
      itemId,
      itemType: ItemTypeMap.LOST,
      content: data.content,
    };
    await submit(JSON.stringify(payload), { method: 'POST', encType: 'application/json' });
  };

  const onError = (errors: FieldErrors<CommentFormValues>) => {
    const errorMsg = getErrorMsg(errors);
    if (errorMsg) {
      toast.error(errorMsg);
    }
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
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit, onError)} className="mb-8">
            <FormField
              control={form.control}
              name="content"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Textarea placeholder="请输入你的评论..." className="resize-none" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" className="mt-4 bg-blue-600 hover:bg-blue-700">
              提交评论
            </Button>
          </form>
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
