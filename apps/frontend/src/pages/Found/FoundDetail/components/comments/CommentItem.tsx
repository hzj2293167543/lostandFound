import { commentApi } from '@/api';
import { ReportDialog } from '@/components/ReportDialog/ReportDialog';
import { Button } from '@/components/ui/button';
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination';
import { Spinner } from '@/components/ui/spinner';
import { CHILD_PAGE_SIZE, getPageNumbers } from '@/utils';
import { CommentItem as CommentItemVo, ReportTargetType } from '@lostfound/shared';
import { ChevronDown, ChevronUp, ThumbsUp } from 'lucide-react';
import { useState } from 'react';
import { Link } from 'react-router';
import { toast } from 'sonner';
import { ReplyCommentForm } from './ReplyCommentForm';

export default function CommentItem({
  comment,
  replyState,
  itemId,
  onCommentChange,
  reloadRootChildren,
}: {
  comment: CommentItemVo;
  itemId: number;
  replyState: { replyId: number | undefined; setReplyState: (id: number | undefined) => void };
  onCommentChange?: undefined | (() => void);
  reloadRootChildren?: () => void;
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
  const [reportOpen, setReportOpen] = useState(false);

  const loadChildren = async (page: number) => {
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

  const handleReplySuccess = () => {
    if (isRootComment) {
      onCommentChange?.();
      loadChildren(childrenPage);
    } else {
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
                <h4 className="font-medium text-foreground">{comment.user.name}</h4>
              </Link>
              {comment.replyUser && !isRootComment && (
                <div>
                  <span className="font-medium text-muted-foreground">回复</span>
                  <Link
                    to={`/profile/${comment.replyUser.id}`}
                    className="font-medium text-green-500 hover:text-green-500/80">
                    @{comment.replyUser.name}：
                  </Link>
                </div>
              )}
            </div>
          </div>
          <p className="w-full break-words whitespace-pre-wrap text-muted-foreground">
            {comment.content}
          </p>

          <div className="flex justify-start items-center mt-2 gap-x-2">
            <span className="text-xs text-muted-foreground">{comment.time}</span>
            <Button
              size="sm"
              className="px-0 bg-transparent text-muted-foreground hover:text-ai-primary hover:bg-transparent cursor-pointer"
              onClick={handleLikeClick}
              disabled={isLiking}>
              <ThumbsUp
                className={`w-4 h-4 ${isLiked && 'fill-found-primary text-found-primary'}`}
              />
              <span className="text-xs text-muted-foreground">
                {likeCount > 0 ? likeCount : ''}
              </span>
            </Button>
            <Button
              size="sm"
              className="px-0 bg-transparent text-foreground hover:text-found-primary hover:bg-transparent cursor-pointer"
              onClick={() => replyState?.setReplyState(comment.id)}>
              回复
            </Button>
            <Button
              size="sm"
              className="px-0 bg-transparent text-foreground hover:text-destructive hover:bg-transparent cursor-pointer"
              onClick={() => setReportOpen(true)}>
              举报
            </Button>
          </div>
          {!showChildren && isRootComment && comment.childrenCount > 0 && (
            <Button
              variant="link"
              size="sm"
              onClick={handleExpand}
              className="text-found-primary pl-0 mt-1">
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
                  reloadRootChildren={() => loadChildren(childrenPage)}
                />
              ))}
              {loadingChildren && (
                <div className="absolute inset-0 flex justify-center items-center bg-background/80 z-10">
                  <Spinner className="h-4" />
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
                className="text-found-primary pl-0 mt-2">
                <ChevronUp className="w-4 h-4 mr-1" />
                收起回复
              </Button>
            </div>
          )}
          {replyState?.replyId === comment.id && (
            <ReplyCommentForm
              comment={comment}
              itemId={itemId}
              replyId={replyState.replyId}
              onSuccess={handleReplySuccess}
            />
          )}
        </div>
      </div>
      {isRootComment && <div className="my-4 border-t border-border" />}
      <ReportDialog
        open={reportOpen}
        onOpenChange={setReportOpen}
        targetType={ReportTargetType.Comment}
        targetId={comment.id}
        targetSnapshot={{ content: comment.content, userId: comment.user.id }}
      />
    </div>
  );
}
