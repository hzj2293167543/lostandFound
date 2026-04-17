import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
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
import { memo, useEffect, useEffectEvent, useState } from 'react';
import { useActionData, useSubmit } from 'react-router-dom';
import { LOST_DETAIL_INTENT } from '../../../type';
import CommentItem from './CommentItem';
import { zodResolver } from '@hookform/resolvers/zod';
import { FieldErrors, useForm } from 'react-hook-form';
import * as z from 'zod';
import { Form, FormControl, FormField, FormItem, FormMessage } from '@/components/ui/form';
import { getErrorMsg, getPageNumbers, PAGE_SIZE } from '@/utils';
import { toast } from 'sonner';
import { useItemCommentInfinite } from '@/hooks/useItemCommentInfinite';

const commentSchema = z.object({
  content: z.string().min(1, '评论内容不能为空'),
});

type CommentFormValues = z.infer<typeof commentSchema>;

export default memo(function Comments({ itemId }: { itemId: number }) {
  'use no memo';
  const actionData = useActionData<{ success: boolean; intent?: number; error?: string }>();
  const submit = useSubmit();
  const [currentPage, setCurrentPage] = useState(1);

  const { data, isLoading, fetchNextPage, refetch } = useItemCommentInfinite(
    itemId,
    ItemTypeMap.LOST
  );

  const comments = data?.pages.flatMap((p) => p.items) || [];
  const totalComments = data?.pages[0]?.total || 0;
  const totalPages = data?.pages[0]?.totalPages || 1;

  const form = useForm<CommentFormValues>({
    resolver: zodResolver(commentSchema),
    defaultValues: {
      content: '',
    },
  });

  const handleSuccessEffect = useEffectEvent(() => {
    form.reset();
    setCurrentPage(1);
    refetch();
  });
  useEffect(() => {
    if (actionData?.intent !== LOST_DETAIL_INTENT.COMMENT) return;
    if (actionData.success) {
      handleSuccessEffect();
    } else if (!actionData.success) {
      toast.error(actionData.error || '发布失败');
    }
  }, [actionData]);

  const [replyState, setReplyState] = useState<{ replyId: number | undefined }>({
    replyId: undefined,
  });
  const handleReplyStateChange = (id: number | undefined) => {
    setReplyState((prev) => ({ replyId: prev.replyId === id ? undefined : id }));
  };

  const onSubmit = async (formData: CommentFormValues) => {
    const payload = {
      intent: LOST_DETAIL_INTENT.COMMENT,
      parentId: null,
      itemId,
      itemType: ItemTypeMap.LOST,
      content: formData.content,
    };
    await submit(JSON.stringify(payload), { method: 'POST', encType: 'application/json' });
  };

  const onError = (errors: FieldErrors<CommentFormValues>) => {
    const errorMsg = getErrorMsg(errors);
    if (errorMsg) {
      toast.error(errorMsg);
    }
  };

  const displayedComments = comments.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    if (page <= totalPages) {
      fetchNextPage();
    }
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>评论</CardTitle>
        </CardHeader>
        <CardContent className="flex justify-center py-8">
          <Skeleton className="h-6 w-24" />
        </CardContent>
      </Card>
    );
  }

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

        {comments.length === 0 ? null : (
          <>
            <div className="space-y-6">
              {displayedComments.map((commentItem) => (
                <CommentItem
                  key={commentItem.id}
                  comment={commentItem}
                  itemId={itemId}
                  replyState={{
                    replyId: replyState.replyId,
                    setReplyState: handleReplyStateChange,
                  }}
                  onCommentChange={() => refetch()}
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
                          handlePageChange(Math.max(1, currentPage - 1));
                        }}
                        className={currentPage <= 1 ? 'pointer-events-none opacity-50' : ''}
                      />
                    </PaginationItem>
                    {getPageNumbers(currentPage, totalPages).map((page) => (
                      <PaginationItem key={page}>
                        <PaginationLink
                          href="#"
                          isActive={page === currentPage}
                          onClick={(e) => {
                            e.preventDefault();
                            handlePageChange(page);
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
                          handlePageChange(Math.min(totalPages, currentPage + 1));
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
