import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { CellRowCommentProps, CellRowCommentPropsExplicit } from '@/types/type';
import { formatDateForInput } from '@/utils';
import { CommentItem } from '@lostfound/shared';
import { ThumbsUp } from 'lucide-react';
import { memo, useState } from 'react';
import { List } from 'react-window';
import { useUserCommentInfinite } from '../../hooks/useUserCommentInfinite';

function CommentRow(props: CellRowCommentProps<CommentItem>) {
  const {
    index,
    style,
    data: { items, hasNextPage, toggleComment, expandedComments },
  } = props as CellRowCommentPropsExplicit<CommentItem>;

  if (index >= items.length) {
    return (
      <div style={style} className="px-3 py-2">
        <div className="flex justify-center items-center py-4">
          {hasNextPage ? (
            <p className="text-gray-500">加载中...</p>
          ) : (
            <p className="text-gray-400">没有更多了</p>
          )}
        </div>
      </div>
    );
  }

  const comment = items[index];
  if (!comment) return null;

  const isExpanded = expandedComments[comment.id];

  return (
    <div style={style} className="px-3 py-3">
      <Card className="flex flex-col h-full">
        <CardHeader>
          <CardTitle className="flex justify-between items-center">
            <span>发布时间：{formatDateForInput(comment.time)}</span>
            {comment.likeCount > 0 && (
              <span className="flex items-center gap-1">
                <ThumbsUp className="w-4 h-4 fill-green-400" />
                {comment.likeCount}人点赞
              </span>
            )}
          </CardTitle>
          <CardDescription
            className={`break-words whitespace-pre-wrap ${isExpanded ? `overflow-auto h-[100px]` : 'line-clamp-3'}`}>
            {comment.content}
          </CardDescription>
        </CardHeader>
        {comment.content.length > 100 && (
          <CardFooter className="mt-auto">
            <Button variant="outline" className="ml-auto" onClick={() => toggleComment(comment.id)}>
              {isExpanded ? '收起' : '查看详情'}
            </Button>
          </CardFooter>
        )}
      </Card>
    </div>
  );
}

export default memo(function PersonalInfoDetailComments({ userId }: { userId: number }) {
  const { parentRef, isFetching, status, rowCount, itemData, handleScroll } =
    useUserCommentInfinite(userId);

  const [expandedComments, setExpandedComments] = useState<Record<number, boolean>>({});

  const toggleComment = (commentId: number) => {
    setExpandedComments((prev) => ({
      ...prev,
      [commentId]: !prev[commentId],
    }));
  };
  const commentItemData = {
    ...itemData,
    expandedComments,
    toggleComment,
  };
  if (status === 'pending') {
    return (
      <>
        <h2 className="text-2xl font-bold mb-6">我的评论</h2>
        <Card>
          <CardContent>
            <p className="text-gray-600 text-center py-12">加载中...</p>
          </CardContent>
        </Card>
      </>
    );
  }

  if (itemData.items.length === 0) {
    return (
      <>
        <h2 className="text-2xl font-bold mb-6">我的评论</h2>
        <Card>
          <CardContent>
            <p className="text-gray-600 text-center py-12">暂无评论记录</p>
          </CardContent>
        </Card>
      </>
    );
  }

  const getRowHeight = (index: number) => {
    const comment = itemData.items[index];
    if (!comment) return 200; // 默认高度
    let height = 120; // 基础高度
    if (comment.content.length > 100) height += 90; // 内容较多时增加
    if (expandedComments[comment.id]) height += 80; // 展开状态增加
    return height;
  };

  return (
    <>
      <h2 className="text-2xl font-bold">我的评论</h2>
      <div ref={parentRef} className="h-[650px] relative ">
        <List
          style={{ scrollbarWidth: 'none' }}
          rowHeight={getRowHeight}
          rowCount={rowCount}
          onScroll={handleScroll}
          rowProps={{ data: commentItemData }}
          rowComponent={CommentRow}
        />
      </div>
      {isFetching && status !== 'success' && (
        <div className="bg-blue-50 text-blue-600 text-center py-1 text-sm">加载中...</div>
      )}
    </>
  );
});
