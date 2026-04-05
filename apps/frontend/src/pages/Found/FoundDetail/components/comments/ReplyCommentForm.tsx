import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormMessage } from '@/components/ui/form';
import { Textarea } from '@/components/ui/textarea';
import { FOUND_DETAIL_INTENT } from '@/pages/Found/type';
import { useAuthStore } from '@/stores/AuthStore';
import { ItemTypeMap } from '@/types/type';
import { getErrorMsg } from '@/utils';
import { zodResolver } from '@hookform/resolvers/zod';
import { CommentItem as CommentItemVo } from '@lostfound/shared';
import { useEffect, useEffectEvent } from 'react';
import { FieldErrors, useForm } from 'react-hook-form';
import { useFetcher } from 'react-router';
import { toast } from 'sonner';
import * as z from 'zod';

const replySchema = z.object({
  content: z.string().min(1, '回复内容不能为空'),
});

type ReplyFormValues = z.infer<typeof replySchema>;

export function ReplyCommentForm({
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
    if (data.intent !== FOUND_DETAIL_INTENT.COMMENT) return;
    handleEffect(data);
  }, [fetcher.data]);

  useEffect(() => {
    if (replyId === comment.id) {
      form.setFocus('content');
    }
  }, [replyId, comment.id, form]);

  const onSubmit = async (data: ReplyFormValues) => {
    const payload = {
      intent: FOUND_DETAIL_INTENT.COMMENT,
      parentId: replyId || null,
      itemId,
      itemType: ItemTypeMap.FOUND,
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
                    className="w-full p-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-ai-primary resize-none max-h-24"
                    placeholder={`回复 @${comment.user.name}：`}
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button
            size="sm"
            className="mt-2 px-6 bg-found-primary text-white hover:bg-found-primary/90">
            发布
          </Button>
        </form>
      </Form>
    </div>
  );
}
