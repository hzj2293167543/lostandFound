import { categoryApi, lostApi, uploadApi } from '@/api';
import { queryClient } from '@/lib/queryClient';
import { categoryKeys, lostKeys } from '@/queryKeys';
import { formatDateForInput, getErrorMsg, getFirstError, isFormDirty } from '@/utils';
import { zodResolver } from '@hookform/resolvers/zod';
import { LostUpdateDto, LostUpdateDtoSchema } from '@lostfound/shared';
import { useMutation, useQueries } from '@tanstack/react-query';
import { ChangeEvent, useEffect, useState } from 'react';
import { FieldErrors, useForm } from 'react-hook-form';
import { useLoaderData } from 'react-router';
import { toast } from 'sonner';

export function useLostEdit(lostItemId: number) {
  const [open, setOpen] = useState(false);
  const [imagePreview, setImagePreview] = useState<string>('');
  const [isUploading, setIsUploading] = useState(false);
  const { user } = useLoaderData();

  const form = useForm<LostUpdateDto>({
    resolver: zodResolver(LostUpdateDtoSchema),
    defaultValues: {
      id: lostItemId,
      title: '',
      category: 0,
      description: '',
      status: 0,
      time: '',
      location: '',
    },
  });

  const [lostDetailQuery, categoryQuery] = useQueries({
    queries: [
      {
        queryKey: lostKeys.detail(lostItemId),
        queryFn: () => lostApi.getLostItemDetailById(lostItemId),
        enabled: open,
      },
      {
        queryKey: categoryKeys.list(),
        queryFn: () => categoryApi.getCategories(),
        enabled: open,
      },
    ],
  });

  useEffect(() => {
    if (lostDetailQuery.error) {
      toast.error(getErrorMsg(lostDetailQuery.error, '获取失物信息失败'));
    }
  }, [lostDetailQuery.error]);

  useEffect(() => {
    if (categoryQuery.error) {
      toast.error(getErrorMsg(categoryQuery.error, '获取分类失败'));
    }
  }, [categoryQuery.error]);

  useEffect(() => {
    if (!lostDetailQuery.data) return;
    const lostDetail = lostDetailQuery.data;
    setImagePreview(lostDetail.image || '');
    form.reset({
      id: lostDetail.id,
      title: lostDetail.title,
      category: lostDetail.category.id,
      description: lostDetail.description,
      status: lostDetail.status,
      time: formatDateForInput(lostDetail.time) || new Date().toISOString(),
      location: lostDetail.location,
    });
  }, [lostDetailQuery.data, form]);

  const handleFileChange = async (e: ChangeEvent<HTMLInputElement>) => {
    try {
      const file = e.target.files?.[0];
      if (!file) return;

      const reader = new FileReader();
      reader.addEventListener('load', (event) => {
        const result = event.target?.result;
        if (result) {
          setImagePreview(result as string);
        }
      });
      reader.addEventListener('error', () => {
        toast.error('图片读取失败');
      });
      reader.readAsDataURL(file);

      const formData = new FormData();
      formData.append('file', file);
      formData.append('type', 'lost');
      setIsUploading(true);
      const imageUrl = await uploadApi.upload(formData);
      if (imageUrl) {
        form.setValue('image', imageUrl, { shouldDirty: true });
      }
    } catch (error) {
      const message = getErrorMsg(error, '图片上传失败');
      toast.error(message);
    } finally {
      setIsUploading(false);
    }
  };

  const updateMutation = useMutation({
    mutationFn: (data: LostUpdateDto) => lostApi.updateLostItem(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: lostKeys.detail(lostItemId) });
      queryClient.invalidateQueries({ queryKey: lostKeys.userLostList(user.id) });
      setOpen(false);
      toast.success('失物信息修改成功！');
    },
    onError: (error) => {
      const message = getErrorMsg(error, '修改失物信息失败');
      toast.error(message);
    },
  });

  const onSubmit = (data: LostUpdateDto) => {
    if (!isFormDirty(form)) {
      toast.error('请修改失物信息');
      return;
    }
    updateMutation.mutate(data);
  };

  const onError = (errors: FieldErrors<LostUpdateDto>) => {
    console.log(errors);
    const firstError = getFirstError(errors);
    toast.error(firstError || '请检查失物信息');
  };

  const isLoading =
    lostDetailQuery.isLoading || categoryQuery.isLoading || isUploading || updateMutation.isPending;
  return {
    categories: categoryQuery.data || [],
    imagePreview,
    isLoading,
    form,
    handleFileChange,
    onSubmit,
    onError,
    open,
    setOpen,
  };
}
