import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormMessage } from '@/components/ui/form';
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
import { zodResolver } from '@hookform/resolvers/zod';
import { Comment } from '@lostfound/shared';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useActionData, useSubmit } from 'react-router-dom';
import * as z from 'zod';
import { FOUND_DETAIL_INTENT } from '../../type';
import { CommentItem } from './CommentItem';

const commentSchema = z.object({
  content: z.string().min(1, '评论内容不能为空'),
});

type CommentFormValues = z.infer<typeof commentSchema>;

const PAGE_SIZE = 10;

export default function Comments({ comments, itemId }: { comments: Comment[]; itemId: number }) {
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
    if (actionData?.intent === FOUND_DETAIL_INTENT.COMMENT && actionData.success) {
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
      intent: FOUND_DETAIL_INTENT.COMMENT,
      parentId: null,
      itemId,
      itemType: ItemTypeMap.FOUND,
      content: data.content,
    };
    await submit(JSON.stringify(payload), { method: 'POST', encType: 'application/json' });
  };

  const totalComments = comments?.length || 0;
  const totalPages = Math.ceil(totalComments / PAGE_SIZE);
  const displayedComments = comments.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);

  return (
    <Card>
      <CardHeader>
        <CardTitle>评论 ({totalComments})</CardTitle>
        <CardDescription>请文明发言，确认物品信息</CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="mb-8">
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
            <Button type="submit" className="mt-4 bg-green-600 hover:bg-green-700">
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
}
