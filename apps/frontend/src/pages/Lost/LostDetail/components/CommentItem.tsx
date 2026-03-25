import { commentApi } from '@/api';
import { Button } from '@/components/ui/button';
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
import { useAuthStore } from '@/stores/AuthStore';
import { ItemTypeMap } from '@/types/type';
import { getErrorMsg } from '@/utils';
import { zodResolver } from '@hookform/resolvers/zod';
import { Comment } from '@lostfound/shared';
import { ChevronDown, ChevronUp, ThumbsUp } from 'lucide-react';
import { useEffect, useState } from 'react';
import { FieldErrors, useForm } from 'react-hook-form';
import { Link, useActionData, useSubmit } from 'react-router';
import { toast } from 'sonner';
import * as z from 'zod';
import { LOST_DETAIL_INTENT } from '../../type';
import { queryClient } from '@/lib/queryClient';
import { commentKeys } from '@/queryKeys';

const replySchema = z.object({
  content: z.string().min(1, '回复内容不能为空'),
});

type ReplyFormValues = z.infer<typeof replySchema>;

export default function CommentItem({
  comment,
  rootCommentId,
  replyState,
  itemId,
}: {
  comment: Comment;
  rootCommentId: number;
  itemId: number;
  replyState: { replyId: number | undefined; setReplyState: (id: number | undefined) => void };
}) {
  'use no memo';
  const [isExpanded, setIsExpanded] = useState(false);
  const [childrenPage, setChildrenPage] = useState(1);
  const children = comment.children || [];
  const totalChildren = children.length;
  const childrenPageSize = 10;
  const totalChildrenPages = Math.ceil(totalChildren / childrenPageSize);
  const displayedChildren = children.slice(
    (childrenPage - 1) * childrenPageSize,
    childrenPage * childrenPageSize
  );
  const handleReplyClick = () => {
    replyState.setReplyState(comment.id);
  };

  const [isLiked, setIsLiked] = useState(comment.isLiked);
  const [likeCount, setLikeCount] = useState(comment.likeCount || 0);
  const handleLikeClick = async () => {
    setIsLiked(!isLiked);
    setLikeCount((prevCount) => (isLiked ? prevCount - 1 : prevCount + 1));

    try {
      await commentApi.likeComment(comment.id, !isLiked);
      queryClient.refetchQueries({
        queryKey: commentKeys.list(itemId, { type: ItemTypeMap.LOST }),
      });
    } catch {
      toast.error('点赞失败');
      setIsLiked(!isLiked);
      setLikeCount((prevCount) => (isLiked ? prevCount + 1 : prevCount - 1));
    }
  };
  return (
    <div key={comment.id} className="flex flex-col">
      <div className={`flex gap-x-4 ${comment.parentId && 'scale-80 transform -translate-x-25'}`}>
        <Link to={`/profile/${comment.user.id}`}>
          <img
            src={comment.user?.avatar}
            alt={comment.user.name}
            className="w-10 h-10 rounded-full flex-shrink-0"
          />
        </Link>

        <div className="flex-1 w-10">
          <div className="flex justify-between items-start mb-1">
            <div className="flex items-center gap-2">
              <Link to={`/profile/${comment.user.id}`}>
                <h4 className="font-medium text-gray-800">{comment.user.name}</h4>
              </Link>
              {comment.replyUser && comment.parentId !== rootCommentId && (
                <div>
                  <span className="font-medium text-gray-600">回复</span>
                  <Link
                    to={`/profile/${comment.replyUser.id}`}
                    className="font-medium text-blue-500 hover:text-blue-600">
                    @{comment.replyUser.name}：
                  </Link>
                </div>
              )}
            </div>
          </div>
          <p className="w-full break-words whitespace-pre-wrap text-gray-600">{comment.content}</p>

          <div className="flex justify-start items-center mt-2 gap-x-2">
            <span className="text-xs text-gray-500">{comment.time}</span>
            <Button
              size="sm"
              className="px-0 bg-transparent text-gray-500 hover:text-blue-300 hover:bg-transparent cursor-pointer"
              onClick={handleLikeClick}>
              <ThumbsUp className={`w-4 h-4  ${isLiked && 'fill-blue-400 text-blue-700'}`} />
              <span className="text-xs text-gray-500">{likeCount > 0 ? likeCount : ''}</span>
            </Button>
            <Button
              size="sm"
              className=" px-0 bg-transparent text-gray-700 hover:text-blue-300 hover:bg-transparent cursor-pointer"
              onClick={handleReplyClick}>
              回复
            </Button>
          </div>
          {totalChildren > 0 && (
            <div className="ml-4 mt-2">
              {isExpanded ? (
                <>
                  {displayedChildren.map((child) => (
                    <CommentItem
                      key={child.id}
                      rootCommentId={rootCommentId}
                      comment={child}
                      itemId={itemId}
                      replyState={replyState}
                    />
                  ))}
                  {totalChildren > childrenPageSize && (
                    <div className="mt-3">
                      <Pagination className="justify-start">
                        <PaginationContent>
                          <PaginationItem>
                            <PaginationPrevious
                              href="#"
                              onClick={(e) => {
                                e.preventDefault();
                                setChildrenPage((p) => Math.max(1, p - 1));
                              }}
                              className={childrenPage <= 1 ? 'pointer-events-none opacity-50' : ''}
                            />
                          </PaginationItem>
                          {Array.from({ length: totalChildrenPages }, (_, i) => i + 1).map(
                            (page) => (
                              <PaginationItem key={page}>
                                <PaginationLink
                                  href="#"
                                  isActive={page === childrenPage}
                                  onClick={(e) => {
                                    e.preventDefault();
                                    setChildrenPage(page);
                                  }}>
                                  {page}
                                </PaginationLink>
                              </PaginationItem>
                            )
                          )}
                          <PaginationItem>
                            <PaginationNext
                              href="#"
                              onClick={(e) => {
                                e.preventDefault();
                                setChildrenPage((p) => Math.min(totalChildrenPages, p + 1));
                              }}
                              className={
                                childrenPage >= totalChildrenPages
                                  ? 'pointer-events-none opacity-50'
                                  : ''
                              }
                            />
                          </PaginationItem>
                        </PaginationContent>
                      </Pagination>
                    </div>
                  )}
                  <Button
                    variant="link"
                    size="sm"
                    onClick={() => setIsExpanded(false)}
                    className="text-blue-500 pl-0 mt-1">
                    <ChevronUp className="w-4 h-4 mr-1" />
                    收起回复
                  </Button>
                </>
              ) : (
                <Button
                  variant="link"
                  size="sm"
                  onClick={() => setIsExpanded(true)}
                  className="text-blue-500 pl-0">
                  <ChevronDown className="w-4 h-4 mr-1" />
                  查看 {totalChildren} 条回复
                </Button>
              )}
            </div>
          )}
          {replyState?.replyId === comment.id && (
            <ReplyComment comment={comment} itemId={itemId} replyId={replyState?.replyId} />
          )}
        </div>
      </div>
      {comment.parentId === null && <div className={`my-4 border-t border-gray-200`} />}
    </div>
  );
}

function ReplyComment({
  comment,
  itemId,
  replyId,
}: {
  comment: Comment;
  itemId: number;
  replyId: number | null;
}) {
  'use no memo';
  const user = useAuthStore.use.user();
  const actionData = useActionData<{ success: boolean; intent?: number; error?: string }>();
  const submit = useSubmit();

  const form = useForm<ReplyFormValues>({
    resolver: zodResolver(replySchema),
    defaultValues: {
      content: '',
    },
  });

  useEffect(() => {
    if (actionData?.intent === LOST_DETAIL_INTENT.COMMENT && actionData.success) {
      form.reset();
    }
  }, [actionData, form]);

  useEffect(() => {
    if (replyId === comment.id) {
      form.setFocus('content');
    }
  }, [replyId, comment.id, form]);

  const onSubmit = async (data: ReplyFormValues) => {
    const payload = {
      intent: LOST_DETAIL_INTENT.COMMENT,
      parentId: replyId || null,
      itemId,
      itemType: ItemTypeMap.LOST,
      content: data.content,
    };
    await submit(JSON.stringify(payload), { method: 'POST', encType: 'application/json' });
  };

  const onError = (errors: FieldErrors<ReplyFormValues>) => {
    const errorMsg = getErrorMsg(errors);
    if (errorMsg) {
      toast.error(errorMsg);
    }
  };

  return (
    <div className="flex items-start gap-x-4 mt-2">
      <img src={user?.avatar} alt={user?.name} className="w-10 h-10 rounded-full flex-shrink-0" />
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit, onError)}
          className="w-full flex flex-col items-end gap-x-2">
          <FormField
            control={form.control}
            name="content"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormControl>
                  <Textarea
                    rows={3}
                    className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400 resize-none max-h-24"
                    placeholder={`回复 @${comment.user.name}：`}
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button size="sm" className="mt-2 px-6 bg-blue-400 text-white hover:bg-blue-500">
            发布
          </Button>
        </form>
      </Form>
    </div>
  );
}
