import { useActionData } from 'react-router-dom';
import { uploadFile } from '@/services/upload.services';
import { getFirstError, isFormDirty } from '@/utils';
import { zodResolver } from '@hookform/resolvers/zod';
import { UploadTypeDtoObj, User, UserEditDto, UserEditDtoSchema } from '@lostfound/shared';
import { ChangeEvent, useEffect, useEffectEvent, useState } from 'react';
import { FieldErrors, useForm } from 'react-hook-form';
import { useSubmit } from 'react-router-dom';
import { toast } from 'sonner';
import { PROFILE_INTENT } from '../types';
import { ActionResult } from '@/types/type';

export function useProfileEdit(
  userRaw: User,
  onSuccess?: () => void,
  onError?: (error: string) => void
) {
  const submit = useSubmit();
  const [avatarPreview, setAvatarPreview] = useState(userRaw.avatar);

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

  const handleAvatarChange = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

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
    }
  };

  const onSubmit = async (data: UserEditDto) => {
    try {
      if (!isFormDirty(profileForm)) {
        toast.error('请至少修改一个字段');
        return;
      }
      const payload = { ...data, intent: PROFILE_INTENT.USER_EDIT };
      await submit(JSON.stringify(payload), { method: 'post', encType: 'application/json' });
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

  const actionData = useActionData<ActionResult<keyof typeof PROFILE_INTENT>>();
  const handleCallback = useEffectEvent((actionData: ActionResult<keyof typeof PROFILE_INTENT>) => {
    if (actionData.intent !== PROFILE_INTENT.USER_EDIT) return;
    if (actionData?.success) {
      toast.success('个人信息更新成功');
      onSuccess?.();
    } else if (actionData?.error) {
      toast.error(actionData.error);
      onError?.(actionData.error);
    }
  });
  useEffect(() => {
    const currentValues = profileForm.getValues();
    profileForm.reset(currentValues);
    if (actionData) {
      handleCallback(actionData);
    }
  }, [profileForm, actionData]);

  return {
    profileForm,
    isUpdateAvatar: profileForm.getValues().avatar !== userRaw.avatar,
    avatarPreview,
    handleAvatarChange,
    onSubmit,
    onSubmitError,
  };
}
