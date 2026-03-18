import { uploadApi } from '@/api';
import { useAuthAction } from '@/hooks/useAuthAction';
import { getErrorMsg, getFirstError, safeParse } from '@/utils';
import { zodResolver } from '@hookform/resolvers/zod';
import { Category, FoundCreateDto, FoundCreateDtoSchema } from '@lostfound/shared';
import { useEffect, useEffectEvent, useState } from 'react';
import { FieldErrors, useForm } from 'react-hook-form';
import { useActionData, useSubmit } from 'react-router';
import { toast } from 'sonner';

export function useFoundCreate(categories: Category[]) {
  const [open, setOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const requireAuth = useAuthAction();
  const submit = useSubmit();

  const form = useForm<FoundCreateDto>({
    resolver: zodResolver(FoundCreateDtoSchema),
    defaultValues: {
      title: '',
      category: 0,
      description: '',
      time: '',
      location: '',
      storageLocation: '',
      contactPhone: '',
      image: '',
    },
  });

  const handleOpen = (newOpen: boolean) => {
    if (newOpen) {
      requireAuth(() => setOpen(true), '请先登录后才能发布招领信息');
    } else {
      setOpen(false);
      form.reset();
    }
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    try {
      setIsLoading(true);
      const file = e.target.files?.[0];
      if (!file) return;

      const reader = new FileReader();
      reader.addEventListener('load', (event) => {
        const result = event.target?.result;
        if (result) {
          form.setValue('image', result as string, { shouldDirty: true });
        }
      });
      reader.addEventListener('error', () => {
        toast.error('图片读取失败');
      });
      reader.readAsDataURL(file);

      const formData = new FormData();
      formData.append('file', file);
      formData.append('type', 'found');
      const imageUrl = await uploadApi.upload(formData);
      if (imageUrl) {
        form.setValue('image', imageUrl, { shouldDirty: true });
      }
    } catch (error) {
      const message = getErrorMsg(error, '图片上传失败');
      toast.error(message);
    } finally {
      setIsLoading(false);
    }
  };

  const onSubmit = async (data: FoundCreateDto) => {
    try {
      setIsLoading(true);
      data.image = form.getValues('image');

      const parsedData = safeParse<FoundCreateDto>(FoundCreateDtoSchema, data);
      await submit(JSON.stringify(parsedData), { method: 'POST', encType: 'application/json' });
    } catch (error) {
      const message = getErrorMsg(error, '发布招领信息失败');
      toast.error(message);
    } finally {
      setIsLoading(false);
    }
  };

  const actionData = useActionData<{ success: boolean; result: FoundCreateDto; error?: string }>();
  const shouldClose = useEffectEvent(() => {
    return open;
  });
  useEffect(() => {
    if (!shouldClose()) return;

    if (actionData?.success) {
      setOpen(false);
      form.reset();
      toast.success('招领信息发布成功！');
    } else {
      toast.error(actionData?.error || '发布招领信息失败');
    }
  }, [actionData, form]);

  const onError = (errors: FieldErrors<FoundCreateDto>) => {
    console.log(errors);
    const firstError = getFirstError(errors);
    toast.error(firstError || '请检查招领信息');
  };

  return {
    imagePreview: form.getValues('image'),
    categories,
    isLoading,
    form,
    handleFileChange,
    onSubmit,
    onError,
    open,
    setOpen: handleOpen,
  };
}
