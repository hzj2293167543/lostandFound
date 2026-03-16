import { zodResolver } from '@hookform/resolvers/zod';
import { FieldErrors, useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { PasswordFormValues, passwordSchema, PROFILE_INTENT } from '../types';
import { useSubmit } from 'react-router';
import { UserEditDto } from '@lostfound/shared';
import { getFirstError } from '@/utils';

export function useEditPassword(onSuccess?: () => void, onError?: (error: string) => void) {
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
      const isDirty = passwordForm.formState.isDirty;
      if (!isDirty) {
        toast.error('请至少修改一个字段');
        return;
      }
      const formData = new FormData();
      formData.append('intent', PROFILE_INTENT.USER_EDIT_PASSWORD);
      Object.entries(data).forEach(([key, value]) => {
        if (typeof value !== 'string') return;
        if (value !== undefined && value !== null) {
          formData.append(key, value);
        }
      });
      await submit(formData, { method: 'post' });
      toast.success('密码修改成功！');
      passwordForm.reset();
      onSuccess?.();
    } catch {
      onError?.('密码修改失败');
    }
  };

  const onSubmitError = (errors: FieldErrors<UserEditDto>) => {
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
