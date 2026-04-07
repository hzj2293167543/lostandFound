import { Card, CardContent, CardDescription, CardFooter, CardHeader } from '@/components/ui/card';
import { CellRowCommentPropsExplicit, CellRowProps } from '@/types/type';
import { formatDateForInput } from '@/utils';
import { CommentItem } from '@lostfound/shared';
import { ThumbsUp } from 'lucide-react';
import { memo } from 'react';
import { List } from 'react-window';
import { useRepliesToMeInfinite } from '../../hooks/useRepliesToMeInfinite';

function ReplyRow(props: CellRowProps<CommentItem>) {
  const {
    index,
    style,
    data: { items, hasNextPage },
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

  return (
    <div style={style} className="px-3 py-3">
      <Card className="flex flex-col h-full hover:shadow-md transition-shadow">
        <CardHeader>
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2">
              <span className="font-medium text-primary">{comment.user.name}</span>
              <span className="text-muted-foreground">回复了你</span>
            </div>
            <span className="text-sm text-muted-foreground">
              {formatDateForInput(comment.time)}
            </span>
          </div>
          {comment.parentId !== null && comment.replyUser && (
            <CardDescription className="mt-2 text-sm bg-muted p-2 rounded-md">
              <span className="text-muted-foreground">@{comment.replyUser.name} ：</span>
              <span className="line-clamp-2">{comment.parent?.content || ''}</span>
            </CardDescription>
          )}
          <CardDescription className="break-words whitespace-pre-wrap mt-2 line-clamp-3">
            {comment.content}
          </CardDescription>
        </CardHeader>
        <CardFooter className="mt-auto flex justify-between">
          <div className="flex items-center gap-4 text-muted-foreground text-sm">
            {comment.likeCount > 0 && (
              <span className="flex items-center gap-1">
                <ThumbsUp className="w-4 h-4" />
                {comment.likeCount}
              </span>
            )}
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}

export default memo(function PersonalInfoDetailReplies({ userId }: { userId: number }) {
  const { parentRef, isFetching, status, rowCount, itemData, handleScroll } =
    useRepliesToMeInfinite(userId);

  if (status === 'pending') {
    return (
      <>
        <h2 className="text-2xl font-bold mb-6">回复我的</h2>
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
        <h2 className="text-2xl font-bold mb-6">回复我的</h2>
        <Card>
          <CardContent>
            <p className="text-gray-600 text-center py-12">暂无回复记录</p>
          </CardContent>
        </Card>
      </>
    );
  }

  return (
    <>
      <h2 className="text-2xl font-bold">回复我的</h2>
      <div ref={parentRef} className="h-[650px] relative">
        <List
          style={{ scrollbarWidth: 'none' }}
          rowHeight={200}
          rowCount={rowCount}
          onScroll={handleScroll}
          rowProps={{ data: itemData }}
          rowComponent={ReplyRow}
        />
      </div>
      {isFetching && status !== 'success' && (
        <div className="bg-blue-50 text-blue-600 text-center py-1 text-sm">加载中...</div>
      )}
    </>
  );
});
