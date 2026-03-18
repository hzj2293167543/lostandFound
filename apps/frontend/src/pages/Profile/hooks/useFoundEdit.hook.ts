import { categoryApi, foundApi, uploadApi } from '@/api';
import { formatDateForInput, getErrorMsg, getFirstError, isFormDirty } from '@/utils';
import { zodResolver } from '@hookform/resolvers/zod';
import { Category, FoundDetail, FoundUpdateDto, FoundUpdateDtoSchema } from '@lostfound/shared';
import { ChangeEvent, useEffect, useState } from 'react';
import { FieldErrors, useForm } from 'react-hook-form';
import { useRevalidator } from 'react-router';
import { toast } from 'sonner';

export function useFoundEdit(foundItemId: number) {
  const [open, setOpen] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);
  const [imagePreview, setImagePreview] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);
  const revalidator = useRevalidator();

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

  useEffect(() => {
    const abortController = new AbortController();
    const fetchFoundDetail = async () => {
      if (!open) return;
      setIsLoading(true);

      try {
        const [foundDetail, categoriesData]: [FoundDetail, Category[]] = await Promise.all([
          foundApi.getFoundItemDetailById(foundItemId, { signal: abortController.signal }),
          categoryApi.getCategories({ signal: abortController.signal }),
        ]);
        setCategories(categoriesData);
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
      } catch (error) {
        if (error instanceof Error && error.name === 'CanceledError') {
          return;
        }
        const errorMessage = error instanceof Error ? error.message : '获取招领信息失败';
        toast.error(errorMessage);
      } finally {
        setIsLoading(false);
      }
    };
    fetchFoundDetail();
    return () => {
      abortController.abort();
    };
  }, [foundItemId, open, form]);

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

  const onSubmit = async (data: FoundUpdateDto) => {
    try {
      if (!isFormDirty(form)) {
        toast.error('请修改招领信息');
        return;
      }
      await foundApi.updateFoundItem(data);
      revalidator.revalidate();
      setOpen(false);
      toast.success('招领信息修改成功！');
    } catch (error) {
      const message = getErrorMsg(error, '修改招领信息失败');
      toast.error(message);
    }
  };

  const onError = (errors: FieldErrors<FoundUpdateDto>) => {
    console.log(errors);
    const firstError = getFirstError(errors);
    toast.error(firstError || '请检查招领信息');
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
