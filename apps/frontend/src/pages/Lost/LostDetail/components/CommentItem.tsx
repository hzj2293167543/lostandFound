import { Button } from '@/components/ui/button';
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationPrevious,
  PaginationLink,
  PaginationNext,
} from '@/components/ui/pagination';
import { ThumbsUp, ChevronUp, ChevronDown } from 'lucide-react';
import { RefObject, useEffect, useRef, useState } from 'react';
import { Link, Form, useActionData } from 'react-router';
import { Comment } from '@lostfound/shared';
import { useAuthStore } from '@/stores/AuthStore';
import { Textarea } from '@/components/ui/textarea';
import { ItemTypeMap } from '@/types/type';
import { LOST_DETAIL_INTENT } from '../../type';
import { Label } from '@/components/ui/label';
import { commentApi } from '@/api';
import { toast } from 'sonner';

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

  // 处理回复点击事件
  const replyRef = useRef<HTMLTextAreaElement | null>(null);
  const handleReplyClick = () => {
    replyState.setReplyState(comment.id);
  };
  useEffect(() => {
    if (replyState.replyId === comment.id && replyRef.current) {
      replyRef.current.focus();
    }
  }, [replyState.replyId]);

  // 处理点赞点击事件
  const [isLiked, setIsLiked] = useState(comment.isLiked);
  const [likeCount, setLikeCount] = useState(comment.likeCount || 0);
  const handleLikeClick = async () => {
    setIsLiked(!isLiked);
    setLikeCount((prevCount) => (isLiked ? prevCount - 1 : prevCount + 1));

    try {
      // 发送点赞请求，isLiked是异步的，需要取反
      await commentApi.likeComment(comment.id, !isLiked);
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

        <div className="flex-1">
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
          <p className="text-gray-600">{comment.content}</p>

          <div className="flex justify-start items-center mt-2 gap-x-2">
            <span className="text-xs text-gray-500">{comment.time}</span>
            <Button
              size="sm"
              className="px-0 bg-transparent text-gray-500 hover:text-blue-300 hover:bg-transparent cursor-pointer"
              onClick={handleLikeClick}>
              <ThumbsUp className={`w-4 h-4  ${isLiked && 'fill-blue-400 text-blue-700'}`} />
              <span className="text-xs text-gray-500">{likeCount > 0 ? likeCount : ''}</span>
            </Button>
            <Form method="post" className="inline-block">
              <input type="hidden" name="parentId" value={comment.id} />
              <Button
                size="sm"
                className="px-0 bg-transparent text-gray-700 hover:text-blue-300 hover:bg-transparent cursor-pointer"
                onClick={handleReplyClick}>
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
            <ReplyComment
              comment={comment}
              itemId={itemId}
              ref={replyRef}
              replyId={replyState?.replyId}
            />
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
  ref,
  replyId,
}: {
  comment: Comment;
  itemId: number;
  ref: RefObject<HTMLTextAreaElement | null>;
  replyId: number | null;
}) {
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
        <input type="hidden" name="intent" value={LOST_DETAIL_INTENT.COMMENT} />
        <input type="hidden" name="itemId" value={itemId} />
        <input type="hidden" name="itemType" value={ItemTypeMap.LOST} />
        <Label htmlFor="content" className="sr-only">
          回复内容
        </Label>
        <Textarea
          ref={replyId === comment.id ? ref : undefined}
          id="content"
          name="content"
          rows={3}
          className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400 resize-none max-h-24"
          placeholder={`回复 @${comment.user.name}：`}
          value={content}
          onChange={(e) => setContent(e.target.value)}
        />
        <Button size="sm" className="mt-2 px-6 bg-blue-400 text-white hover:bg-blue-500">
          发布
        </Button>
      </Form>
    </div>
  );
}
