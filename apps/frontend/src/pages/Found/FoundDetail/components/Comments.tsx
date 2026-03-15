import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationPrevious,
  PaginationLink,
  PaginationNext,
} from '@/components/ui/pagination';
import { ItemTypeMap } from '@/types/type';
import { Comment } from '@lostfound/shared';
import { ThumbsUp, ChevronDown, ChevronUp } from 'lucide-react';
import { memo, useEffect, useState } from 'react';
import { Form, Link, useActionData } from 'react-router-dom';
import { FOUND_DETAIL_INTENT } from '../../type';
import { useAuthStore } from '@/stores/AuthStore';
import { commentApi } from '@/api';
import { toast } from 'sonner';

const PAGE_SIZE = 10;

function ReplyComment({ comment, itemId }: { comment: Comment; itemId: number }) {
  'use no memo';
  const user = useAuthStore.use.user();
  const [content, setContent] = useState('');
  const actionData = useActionData();
  useEffect(() => {
    if (actionData?.success) {
      setContent('');
    }
  }, [actionData]);
  return (
    <div className="flex items-start gap-x-4 mt-2">
      <img src={user?.avatar} alt={user?.name} className="w-10 h-10 rounded-full flex-shrink-0" />
      <Form method="post" className="w-full flex flex-col items-end gap-x-2">
        <input type="hidden" name="parentId" value={comment.id} />
        <input type="hidden" name="intent" value={FOUND_DETAIL_INTENT.COMMENT} />
        <input type="hidden" name="itemId" value={itemId} />
        <input type="hidden" name="itemType" value={ItemTypeMap.FOUND} />
        <Label htmlFor="content" className="sr-only">
          回复内容
        </Label>
        <Textarea
          id="content"
          name="content"
          rows={3}
          className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-400 resize-none max-h-24"
          placeholder={`回复 @${comment.user.name}：`}
          value={content}
          onChange={(e) => setContent(e.target.value)}
        />
        <Button size="sm" className="mt-2 px-6 bg-green-400 text-white hover:bg-green-500">
          发布
        </Button>
      </Form>
    </div>
  );
}

function CommentItem({
  comment,
  replyState,
  itemId,
}: {
  comment: Comment;
  itemId: number;
  replyState: { replyId: number | undefined; setReplyState: (id: number | undefined) => void };
}) {
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

  const [isLiked, setIsLiked] = useState(comment.isLiked);
  const [likeCount, setLikeCount] = useState(comment.likeCount || 0);
  const handleLikeClick = async () => {
    setIsLiked(!isLiked);
    setLikeCount((prevCount) => (isLiked ? prevCount - 1 : prevCount + 1));

    try {
      await commentApi.likeComment(comment.id, !isLiked);
    } catch {
      toast.error('点赞失败');
      setIsLiked(!isLiked);
      setLikeCount((prevCount) => (isLiked ? prevCount + 1 : prevCount - 1));
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

        <div className="flex-1">
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
                    className="font-medium text-green-500 hover:text-green-600">
                    @{comment.replyUser.name}：
                  </Link>
                </div>
              )}
            </div>
          </div>
          <p className="text-gray-600">{comment.content}</p>

          <div className="flex justify-start items-center mt-2 gap-x-2">
            <span className="text-xs text-gray-500">{comment.time}</span>
            <Button
              size="sm"
              className="px-0 bg-transparent text-gray-500 hover:text-green-300 hover:bg-transparent cursor-pointer"
              onClick={handleLikeClick}>
              <ThumbsUp className={`w-4 h-4  ${isLiked && 'fill-green-400 text-green-700'}`} />
              <span className="text-xs text-gray-500">{likeCount > 0 ? likeCount : ''}</span>
            </Button>
            <Form method="post" className="inline-block">
              <input type="hidden" name="parentId" value={comment.id} />
              <Button
                size="sm"
                className="px-0 bg-transparent text-gray-700 hover:text-green-300 hover:bg-transparent cursor-pointer"
                onClick={() => replyState?.setReplyState(comment.id)}>
                回复
              </Button>
            </Form>
          </div>
          {totalChildren > 0 && (
            <div className="ml-4 mt-2">
              {isExpanded ? (
                <>
                  {displayedChildren.map((child) => (
                    <CommentItem
                      key={child.id}
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
                    className="text-green-500 pl-0 mt-1">
                    <ChevronUp className="w-4 h-4 mr-1" />
                    收起回复
                  </Button>
                </>
              ) : (
                <Button
                  variant="link"
                  size="sm"
                  onClick={() => setIsExpanded(true)}
                  className="text-green-500 pl-0">
                  <ChevronDown className="w-4 h-4 mr-1" />
                  查看 {totalChildren} 条回复
                </Button>
              )}
            </div>
          )}
          {replyState?.replyId === comment.id && <ReplyComment comment={comment} itemId={itemId} />}
        </div>
      </div>
      <div className="my-4 border-t border-gray-200" />
    </div>
  );
}

export default function Comments({ comments, itemId }: { comments: Comment[]; itemId: number }) {
  'use no memo';
  const [content, setContent] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const actionData = useActionData();
  useEffect(() => {
    if (actionData?.intent === FOUND_DETAIL_INTENT.COMMENT) {
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
        <CardDescription>请文明发言，确认物品信息</CardDescription>
      </CardHeader>
      <CardContent>
        <Form method="post" className="mb-8">
          <input type="hidden" name="intent" value={FOUND_DETAIL_INTENT.COMMENT} />
          <input type="hidden" name="itemId" value={itemId} />
          <input type="hidden" name="itemType" value={ItemTypeMap.FOUND} />
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
          <Button type="submit" className="mt-4 bg-green-600 hover:bg-green-700">
            提交评论
          </Button>
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
