import { lostApi, categoryApi, uploadApi } from '@/api';
import { formatDateForInput, getErrorMsg, getFirstError } from '@/utils';
import { zodResolver } from '@hookform/resolvers/zod';
import { Category, LostUpdateDto, LostUpdateDtoSchema, LostDetail } from '@lostfound/shared';
import { useState, useEffect, ChangeEvent } from 'react';
import { useForm, FieldErrors } from 'react-hook-form';
import { useRevalidator } from 'react-router';
import { toast } from 'sonner';

export function useLostEdit(lostItemId: number) {
  const [open, setOpen] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);
  const [imagePreview, setImagePreview] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);
  const revalidator = useRevalidator();

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

  useEffect(() => {
    const abortController = new AbortController();
    const fetchLostDetail = async () => {
      if (!open) return;
      setIsLoading(true);

      try {
        const [lostDetail, categoriesData]: [LostDetail, Category[]] = await Promise.all([
          lostApi.getLostItemDetailById(lostItemId, { signal: abortController.signal }),
          categoryApi.getCategories({ signal: abortController.signal }),
        ]);
        setCategories(categoriesData);
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
      } catch (error) {
        if (error instanceof Error && error.name === 'CanceledError') {
          return;
        }
        const errorMessage = error instanceof Error ? error.message : '获取失物信息失败';
        toast.error(errorMessage);
      } finally {
        setIsLoading(false);
      }
    };
    fetchLostDetail();
    return () => {
      abortController.abort();
    };
  }, [lostItemId, open, form]);

  const handleFileChange = async (e: ChangeEvent<HTMLInputElement>) => {
    try {
      setIsLoading(true);
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

  const onSubmit = async (data: LostUpdateDto) => {
    try {
      const isDirectory = form.formState.isDirty;
      if (!isDirectory) {
        toast.error('请修改失物信息');
        return;
      }
      await lostApi.updateLostItem(data);
      revalidator.revalidate();
      setOpen(false);
      toast.success('失物信息修改成功！');
    } catch (error) {
      const message = getErrorMsg(error, '修改失物信息失败');
      toast.error(message);
    }
  };

  const onError = (errors: FieldErrors<LostUpdateDto>) => {
    console.log(errors);
    const firstError = getFirstError(errors);
    toast.error(firstError || '请检查失物信息');
  };

  return {
    categories,
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
