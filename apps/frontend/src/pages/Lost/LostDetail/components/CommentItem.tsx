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
import { Spinner } from '@/components/ui/spinner';
import { Textarea } from '@/components/ui/textarea';
import { useAuthStore } from '@/stores/AuthStore';
import { ItemTypeMap } from '@/types/type';
import { CHILD_PAGE_SIZE, getErrorMsg, getPageNumbers } from '@/utils';
import { zodResolver } from '@hookform/resolvers/zod';
import { CommentItem as CommentItemVo } from '@lostfound/shared';
import { ChevronDown, ChevronUp, ThumbsUp } from 'lucide-react';
import { useEffect, useEffectEvent, useState } from 'react';
import { FieldErrors, useForm } from 'react-hook-form';
import { Link, useFetcher } from 'react-router';
import { toast } from 'sonner';
import * as z from 'zod';
import { LOST_DETAIL_INTENT } from '../../type';

const replySchema = z.object({
  content: z.string().min(1, '回复内容不能为空'),
});

type ReplyFormValues = z.infer<typeof replySchema>;

export default function CommentItem({
  comment,
  replyState,
  itemId,
  onCommentChange,
  reloadRootChildren, // 新增 prop：用于子评论调用以刷新根评论列表
}: {
  comment: CommentItemVo;
  itemId: number;
  replyState: { replyId: number | undefined; setReplyState: (id: number | undefined) => void };
  onCommentChange?: undefined | (() => void);
  reloadRootChildren?: () => void; // 刷新父级列表的回调
}) {
  'use no memo';
  const isRootComment = comment.rootId === null;

  const [showChildren, setShowChildren] = useState(false);
  const [children, setChildren] = useState<CommentItemVo[]>([]);
  const [childrenPage, setChildrenPage] = useState(1);
  const [totalChildrenPages, setTotalChildrenPages] = useState(1);
  const [loadingChildren, setLoadingChildren] = useState(false);

  const [isLiked, setIsLiked] = useState(comment.isLiked);
  const [likeCount, setLikeCount] = useState(comment.likeCount || 0);
  const [isLiking, setIsLiking] = useState(false);

  const loadChildren = async (page: number) => {
    console.log('加载回复', page);
    setLoadingChildren(true);
    try {
      const rootId = isRootComment ? comment.id : comment.rootId;
      const res = await commentApi.getChildComments(rootId!, page, CHILD_PAGE_SIZE);
      setChildren(res.items);
      setChildrenPage(page);
      setTotalChildrenPages(res.totalPages);
    } catch {
      toast.error('加载回复失败');
    } finally {
      setLoadingChildren(false);
    }
  };

  const handleExpand = () => {
    setShowChildren(true);
    loadChildren(1);
  };

  const handleChildrenPageChange = (page: number) => {
    loadChildren(page);
  };

  console.log(children);
  const handleLikeClick = async () => {
    if (isLiking) return;
    setIsLiking(true);
    setIsLiked(!isLiked);
    setLikeCount((prevCount) => (isLiked ? prevCount - 1 : prevCount + 1));

    try {
      await commentApi.likeComment(comment.id, !isLiked);
      onCommentChange?.();
    } catch {
      toast.error('点赞失败');
      setIsLiked(!isLiked);
      setLikeCount((prevCount) => (isLiked ? prevCount + 1 : prevCount - 1));
    } finally {
      setIsLiking(false);
    }
  };

  // 定义回复成功后的处理逻辑
  const handleReplySuccess = () => {
    if (isRootComment) {
      onCommentChange?.();
      loadChildren(childrenPage);
    } else {
      // 如果是子评论，调用从父级传下来的刷新方法
      reloadRootChildren?.();
    }
  };

  return (
    <div key={comment.id} className="flex flex-col">
      <div className="flex gap-x-4">
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
              {comment.replyUser && (
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
              onClick={handleLikeClick}
              disabled={isLiking}>
              <ThumbsUp className={`w-4 h-4 ${isLiked && 'fill-blue-400 text-blue-700'}`} />
              <span className="text-xs text-gray-500">{likeCount > 0 ? likeCount : ''}</span>
            </Button>
            <Button
              size="sm"
              className="px-0 bg-transparent text-gray-700 hover:text-blue-300 hover:bg-transparent cursor-pointer"
              onClick={() => replyState?.setReplyState(comment.id)}>
              回复
            </Button>
          </div>
          {!showChildren && isRootComment && comment.childrenCount > 0 && (
            <Button
              variant="link"
              size="sm"
              onClick={handleExpand}
              className="text-blue-500 pl-0 mt-1">
              <ChevronDown className="w-4 h-4 mr-1" />
              查看 {comment.childrenCount} 条回复
            </Button>
          )}
          {showChildren && (
            <div className="ml-4 mt-2 min-h-[100px] relative">
              {children.map((child) => (
                <CommentItem
                  key={child.id}
                  comment={child}
                  itemId={itemId}
                  replyState={replyState}
                  onCommentChange={onCommentChange}
                  // 关键修改：将当前的刷新函数传递给子组件
                  // 如果当前是根评论，传递自己的 loadData 逻辑（封装一下以便传递当前页码）
                  reloadRootChildren={() => loadChildren(childrenPage)}
                />
              ))}
              {loadingChildren && (
                <div className="absolute inset-0 flex justify-center items-center bg-white/80 z-10">
                  <Spinner className=" h-4   " />
                </div>
              )}
              {totalChildrenPages > 1 && (
                <div className="mt-4">
                  <Pagination>
                    <PaginationContent>
                      <PaginationItem>
                        <PaginationPrevious
                          href="#"
                          onClick={(e) => {
                            e.preventDefault();
                            handleChildrenPageChange(Math.max(1, childrenPage - 1));
                          }}
                          className={childrenPage <= 1 ? 'pointer-events-none opacity-50' : ''}
                        />
                      </PaginationItem>
                      {getPageNumbers(childrenPage, totalChildrenPages).map((page) => (
                        <PaginationItem key={page}>
                          <PaginationLink
                            href="#"
                            isActive={page === childrenPage}
                            onClick={(e) => {
                              e.preventDefault();
                              handleChildrenPageChange(page);
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
                            handleChildrenPageChange(
                              Math.min(totalChildrenPages, childrenPage + 1)
                            );
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
                onClick={() => setShowChildren(false)}
                className="text-blue-500 pl-0 mt-2">
                <ChevronUp className="w-4 h-4 mr-1" />
                收起回复
              </Button>
            </div>
          )}
          {replyState?.replyId === comment.id && (
            <ReplyComment
              comment={comment}
              itemId={itemId}
              replyId={replyState.replyId}
              onSuccess={handleReplySuccess} // 使用新的处理逻辑
            />
          )}
        </div>
      </div>
      {isRootComment && <div className="my-4 border-t border-gray-200" />}
    </div>
  );
}

function ReplyComment({
  comment,
  itemId,
  replyId,
  onSuccess,
}: {
  comment: CommentItemVo;
  itemId: number;
  replyId: number | null;
  onSuccess: () => void;
}) {
  'use no memo';
  const user = useAuthStore.use.user();
  const fetcher = useFetcher();

  const form = useForm<ReplyFormValues>({
    resolver: zodResolver(replySchema),
    defaultValues: {
      content: '',
    },
  });

  const handleEffect = useEffectEvent(
    (data: { success: boolean; intent?: number; error?: string }) => {
      if (data.success) {
        form.reset();
        onSuccess();
      } else if (!data.success) {
        toast.error(data.error || '发布失败');
      }
    }
  );
  useEffect(() => {
    const data = fetcher.data as { success: boolean; intent?: number; error?: string } | undefined;
    if (!data) return;
    if (data.intent !== LOST_DETAIL_INTENT.COMMENT) return;
    handleEffect(data);
  }, [fetcher.data]);

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
    await fetcher.submit(JSON.stringify(payload), {
      method: 'POST',
      encType: 'application/json',
    });
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
