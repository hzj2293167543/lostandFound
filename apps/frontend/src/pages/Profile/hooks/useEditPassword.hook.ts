import { zodResolver } from '@hookform/resolvers/zod';
import { FieldErrors, useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { PasswordFormValues, passwordSchema, PROFILE_INTENT } from '../types';
import { useSubmit, useActionData } from 'react-router';
import { getFirstError, isFormDirty } from '@/utils';
import { useEffect, useEffectEvent } from 'react';
import { ActionResult } from '@/types/type';
import { queryClient } from '@/lib/queryClient';
import { userKeys } from '@/queryKeys';
import { User } from '@lostfound/shared';

export function useEditPassword(
  userRaw: User,
  onSuccess?: () => void,
  onError?: (error: string) => void
) {
  const submit = useSubmit();
  const passwordForm = useForm<PasswordFormValues>({
    resolver: zodResolver(passwordSchema),
    defaultValues: {
      oldPassword: '',
      newPassword: '',
      confirmPassword: '',
    },
  });

  const onPasswordSubmit = async (data: PasswordFormValues) => {
    try {
      if (!isFormDirty(passwordForm)) {
        toast.error('请至少修改一个字段');
        return;
      }
      const payload = { ...data, intent: PROFILE_INTENT.USER_EDIT_PASSWORD };
      await submit(JSON.stringify(payload), { method: 'post', encType: 'application/json' });
    } catch {
      onError?.('密码修改失败');
    }
  };

  const actionData = useActionData<ActionResult<keyof typeof PROFILE_INTENT>>();
  const handleCallback = useEffectEvent((actionData: ActionResult<keyof typeof PROFILE_INTENT>) => {
    if (actionData?.intent !== PROFILE_INTENT.USER_EDIT_PASSWORD) return;
    if (actionData?.success) {
      toast.success('密码修改成功！');
      queryClient.refetchQueries({ queryKey: userKeys.detail(userRaw.id) });
      passwordForm.reset();
      onSuccess?.();
    } else if (actionData?.error) {
      toast.error(actionData.error);
      onError?.(actionData.error);
    }
  });
  useEffect(() => {
    passwordForm.reset();
    if (actionData) {
      handleCallback(actionData);
    }
  }, [actionData, passwordForm]);

  const onSubmitError = (errors: FieldErrors<PasswordFormValues>) => {
    const firstError = getFirstError(errors);
    if (firstError) {
      onError?.(firstError);
    }
  };

  return {
    passwordForm,
    onPasswordSubmit,
    onSubmitError,
  };
}
