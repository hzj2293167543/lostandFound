import { categoryApi, foundApi, uploadApi } from '@/api';
import { queryClient } from '@/lib/queryClient';
import { foundKeys } from '@/queryKeys';
import { categoryKeys } from '@/queryKeys/category.key';
import { formatDateForInput, getErrorMsg, getFirstError, isFormDirty } from '@/utils';
import { zodResolver } from '@hookform/resolvers/zod';
import { FoundUpdateDto, FoundUpdateDtoSchema } from '@lostfound/shared';
import { useMutation, useQueries } from '@tanstack/react-query';
import { ChangeEvent, useEffect, useState } from 'react';
import { FieldErrors, useForm } from 'react-hook-form';
import { useLoaderData } from 'react-router';
import { toast } from 'sonner';

export function useFoundEdit(foundItemId: number) {
  const [open, setOpen] = useState(false);
  const [imagePreview, setImagePreview] = useState<string>('');
  const [isUploading, setIsUploading] = useState(false);
  const { user } = useLoaderData();
  const form = useForm<FoundUpdateDto>({
    resolver: zodResolver(FoundUpdateDtoSchema),
    defaultValues: {
      id: foundItemId,
      title: '',
      category: 0,
      description: '',
      status: 0,
      time: '',
      location: '',
      storageLocation: '',
      contactPhone: '',
      image: '',
    },
  });

  const [foundDetailQuery, categoryQuery] = useQueries({
    queries: [
      {
        queryKey: foundKeys.detail(foundItemId),
        queryFn: () => foundApi.getFoundItemDetailById(foundItemId),
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
    const fetchFoundDetail = () => {
      if (!categoryQuery.data || !foundDetailQuery.data) return;
      const foundDetail = foundDetailQuery.data;
      setImagePreview(foundDetail.image || '');
      form.reset({
        id: foundDetail.id,
        title: foundDetail.title,
        category: foundDetail.category.id,
        description: foundDetail.description,
        status: foundDetail.status,
        time: formatDateForInput(foundDetail.time) || new Date().toISOString(),
        location: foundDetail.location,
        storageLocation: foundDetail.storageLocation,
        contactPhone: foundDetail.contactPhone,
      });
    };
    fetchFoundDetail();
  }, [foundDetailQuery.data, categoryQuery.data, form]);

  // 处理错误提示
  useEffect(() => {
    if (foundDetailQuery.error) {
      toast.error(getErrorMsg(foundDetailQuery.error, '获取招领信息失败'));
    }
  }, [foundDetailQuery.error]);

  useEffect(() => {
    if (categoryQuery.error) {
      toast.error(getErrorMsg(categoryQuery.error, '获取分类失败'));
    }
  }, [categoryQuery.error]);

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
      formData.append('type', 'found');
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
    mutationFn: (data: FoundUpdateDto) => foundApi.updateFoundItem(data),
    onMutate: () => {
      setIsUploading(true);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: foundKeys.detail(foundItemId) });
      queryClient.invalidateQueries({ queryKey: foundKeys.userFoundList(user.id) });
      setOpen(false);
      toast.success('招领信息修改成功！');
    },
    onError: (error) => {
      const message = getErrorMsg(error, '修改招领信息失败');
      toast.error(message);
    },
    onSettled: () => {
      setIsUploading(false);
    },
  });

  const onSubmit = (data: FoundUpdateDto) => {
    if (!isFormDirty(form)) {
      toast.error('请修改招领信息');
      return;
    }
    updateMutation.mutate(data);
  };

  const onError = (errors: FieldErrors<FoundUpdateDto>) => {
    console.log(errors);
    const firstError = getFirstError(errors);
    toast.error(firstError || '请检查招领信息');
  };

  // 计算加载状态
  const isLoading =
    foundDetailQuery.isLoading ||
    categoryQuery.isLoading ||
    isUploading ||
    updateMutation.isPending;
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
