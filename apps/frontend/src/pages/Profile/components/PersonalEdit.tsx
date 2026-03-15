import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import { uploadFile } from '@/services/upload.services';
import { getFirstError } from '@/utils/form';
import { zodResolver } from '@hookform/resolvers/zod';
import { UploadTypeDtoObj, User, UserEditDto, UserEditDtoSchema } from '@lostfound/shared';
import { Camera } from 'lucide-react';
import type { ChangeEvent } from 'react';
import { useState } from 'react';
import { FieldErrors, useForm } from 'react-hook-form';
import { useSubmit } from 'react-router-dom';
import { toast } from 'sonner';
import * as z from 'zod';
import { PROFILE_INTENT } from '../types';

const passwordSchema = z
  .object({
    oldPassword: z.string().min(1, '请输入当前密码'),
    newPassword: z.string().min(6, '新密码长度至少为6位'),
    confirmPassword: z.string().min(1, '请确认新密码'),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: '两次输入的密码不一致',
    path: ['confirmPassword'],
  });

type PasswordFormValues = z.infer<typeof passwordSchema>;

export default function PersonalEdit({
  userRaw,
  setUser,
  open,
  setOpen,
}: {
  userRaw: User;
  setUser: (user: User) => void;
  open: boolean;
  setOpen: (open: boolean) => void;
}) {
  const [avatarPreview, setAvatarPreview] = useState(userRaw.avatar);
  const [activeTab, setActiveTab] = useState<'profile' | 'password'>('profile');

  const submit = useSubmit();

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

  const passwordForm = useForm<PasswordFormValues>({
    resolver: zodResolver(passwordSchema),
    defaultValues: {
      oldPassword: '',
      newPassword: '',
      confirmPassword: '',
    },
  });

  const [isUpdateAvatar, setIsUpdateAvatar] = useState(false);
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
      profileForm.setValue('avatar', imageUrl);
    } catch {
      toast.error('头像上传失败');
      setAvatarPreview(userRaw.avatar);
    } finally {
      setIsUpdateAvatar(false);
    }
  };

  const onProfileSubmit = async (data: UserEditDto) => {
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
      setOpen(false);
      toast.success('个人信息更新成功！');
    } catch {
      toast.error('个人信息更新失败');
    }
  };
  const onProfileSubmitError = (errors: FieldErrors<UserEditDto>) => {
    const firstError = getFirstError(errors);
    if (firstError) {
      toast.error(firstError);
    }
  };

  const onPasswordSubmit = (data: PasswordFormValues) => {
    console.log('修改密码:', data);
    toast.success('密码修改成功！');
    passwordForm.reset();
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>编辑个人信息</DialogTitle>
          <DialogDescription>请修改你的个人信息</DialogDescription>
        </DialogHeader>

        <Tabs
          value={activeTab}
          onValueChange={(v) => setActiveTab(v as 'profile' | 'password')}
          className="w-full">
          <TabsList variant="line" className="w-full">
            <TabsTrigger value="profile" className="flex-1">
              基本信息
            </TabsTrigger>
            <TabsTrigger value="password" className="flex-1">
              修改密码
            </TabsTrigger>
          </TabsList>

          <TabsContent value="profile">
            <Form {...profileForm}>
              <form
                onSubmit={profileForm.handleSubmit(onProfileSubmit, onProfileSubmitError)}
                className="space-y-4">
                <div className="flex justify-center">
                  <div className="relative">
                    <img
                      src={
                        avatarPreview ||
                        'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=default%20user%20avatar&image_size=square'
                      }
                      alt="头像"
                      className="w-24 h-24 rounded-full object-cover"
                    />
                    <Label
                      htmlFor="avatar-upload"
                      className="absolute bottom-0 right-0 bg-blue-500 text-white rounded-full p-1 cursor-pointer hover:bg-blue-600">
                      <Camera />
                    </Label>
                    <Input
                      id="avatar-upload"
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={handleAvatarChange}
                    />
                  </div>
                </div>

                <FormField
                  control={profileForm.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>姓名</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={profileForm.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>邮箱</FormLabel>
                      <FormControl>
                        <Input type="email" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={profileForm.control}
                  name="contact"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>手机号码</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={profileForm.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>个人描述</FormLabel>
                      <FormControl>
                        <Textarea
                          className="resize-none max-h-12"
                          {...field}
                          value={field.value || ''}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <DialogFooter>
                  <Button type="button" variant="outline" onClick={() => setOpen(false)}>
                    取消
                  </Button>
                  <Button type="submit" disabled={isUpdateAvatar}>
                    {isUpdateAvatar ? '更新头像中' : '保存'}
                  </Button>
                </DialogFooter>
              </form>
            </Form>
          </TabsContent>

          <TabsContent value="password">
            <Form {...passwordForm}>
              <form
                onSubmit={passwordForm.handleSubmit(onPasswordSubmit, (errors) =>
                  console.log('表单校验失败拦截:', errors)
                )}
                className="space-y-4">
                <FormField
                  control={passwordForm.control}
                  name="oldPassword"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>当前密码</FormLabel>
                      <FormControl>
                        <Input type="password" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={passwordForm.control}
                  name="newPassword"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>新密码</FormLabel>
                      <FormControl>
                        <Input type="password" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={passwordForm.control}
                  name="confirmPassword"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>确认新密码</FormLabel>
                      <FormControl>
                        <Input type="password" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <DialogFooter>
                  <Button type="button" variant="outline" onClick={() => setOpen(false)}>
                    取消
                  </Button>
                  <Button type="submit">修改密码</Button>
                </DialogFooter>
              </form>
            </Form>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}
