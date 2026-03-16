import { useActionData } from 'react-router-dom';
// profile/hooks/useProfileEdit.ts
import { uploadFile } from '@/services/upload.services';
import { getFirstError } from '@/utils';
import { zodResolver } from '@hookform/resolvers/zod';
import { UploadTypeDtoObj, User, UserEditDto, UserEditDtoSchema } from '@lostfound/shared';
import { ChangeEvent, useEffect, useState } from 'react';
import { FieldErrors, useForm } from 'react-hook-form';
import { useSubmit } from 'react-router-dom';
import { toast } from 'sonner';
import { PROFILE_INTENT } from '../types';

export function useProfileEdit(
  userRaw: User,
  onSuccess?: () => void,
  onError?: (error: string) => void
) {
  const submit = useSubmit();
  const [avatarPreview, setAvatarPreview] = useState(userRaw.avatar);
  const [isUpdateAvatar, setIsUpdateAvatar] = useState(false);

  const profileForm = useForm<UserEditDto>({
    resolver: zodResolver(UserEditDtoSchema),
    defaultValues: {
      name: userRaw.name ?? '',
      email: userRaw.email ?? '',
      contact: userRaw.contact ?? '',
      description: userRaw.description ?? '',
      avatar: userRaw.avatar ?? '',
    },
  });
  const {
    formState: { isSubmitSuccessful },
  } = profileForm;

  const handleAvatarChange = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // 预览头像
    const reader = new FileReader();
    reader.addEventListener('load', (event) => {
      const result = event.target?.result;
      if (result) {
        setAvatarPreview(result as string);
      }
    });
    reader.readAsDataURL(file);

    try {
      const imageUrl = await uploadFile(file, UploadTypeDtoObj.AVATAR);
      profileForm.setValue('avatar', imageUrl, { shouldDirty: true });
    } catch {
      toast.error('头像上传失败');
      setAvatarPreview(userRaw.avatar);
    } finally {
      setIsUpdateAvatar(false);
    }
  };

  const onSubmit = async (data: UserEditDto) => {
    try {
      const isDirty = profileForm.formState.isDirty;
      if (!isDirty) {
        toast.error('请至少修改一个字段');
        return;
      }
      const formData = new FormData();
      formData.append('intent', PROFILE_INTENT.USER_EDIT);
      Object.entries(data).forEach(([key, value]) => {
        if (value !== undefined) {
          formData.append(key, value);
        }
      });
      await submit(formData, { method: 'post' });
      toast.success('个人信息更新成功');
      onSuccess?.();
    } catch {
      onError?.('个人信息更新失败');
    }
  };

  const onSubmitError = (errors: FieldErrors<UserEditDto>) => {
    const firstError = getFirstError(errors);
    if (firstError) {
      onError?.(firstError);
    }
  };

  const actionData = useActionData();
  useEffect(() => {
    if (isSubmitSuccessful && actionData?.success) {
      // 获取当前的所有值
      const currentValues = profileForm.getValues();
      // 将当前值设为新的“旧值”基准
      profileForm.reset(currentValues);
    }
  }, [isSubmitSuccessful, profileForm, actionData]);

  return {
    profileForm,
    avatarPreview,
    isUpdateAvatar,
    handleAvatarChange,
    onSubmit,
    onSubmitError,
  };
}
