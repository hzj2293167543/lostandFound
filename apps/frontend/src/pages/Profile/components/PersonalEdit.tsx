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
import { User } from '@lostfound/shared';
import { Camera } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';
import { useEditPassword } from '../hooks/useEditPassword.hook';
import { useProfileEdit } from '../hooks/useProfileEdit.hook';

export default function PersonalEdit({
  userRaw,
  open,
  setOpen,
}: {
  userRaw: User;
  open: boolean;
  setOpen: (open: boolean) => void;
}) {
  const [activeTab, setActiveTab] = useState<'profile' | 'password'>('profile');

  const {
    profileForm,
    avatarPreview,
    isUpdateAvatar,
    handleAvatarChange,
    onSubmit: onProfileSubmit,
    onSubmitError: onProfileSubmitError,
  } = useProfileEdit(
    userRaw,
    () => {
      setOpen(false);
    },
    (error) => toast.error(error),
    () => setOpen(false)
  );

  const {
    passwordForm,
    onPasswordSubmit,
    onSubmitError: onPasswordSubmitError,
  } = useEditPassword(
    () => {
      setOpen(false);
      passwordForm.reset();
    },
    (error) => toast.error(error)
  );

  const handleCancel = () => {
    if (profileForm.formState.isDirty || passwordForm.formState.isDirty) {
      if (confirm('确定要取消吗？所有修改将丢失。')) {
        profileForm.reset(userRaw);
        passwordForm.reset();
        setOpen(false);
      }
    } else {
      setOpen(false);
    }
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
                  <Button type="button" variant="outline" onClick={handleCancel}>
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
                onSubmit={passwordForm.handleSubmit(onPasswordSubmit, onPasswordSubmitError)}
                className="space-y-4">
                <FormField
                  control={passwordForm.control}
                  name="oldPassword"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>当前密码</FormLabel>
                      <FormControl>
                        <Input type="password" {...field} value={(field.value as string) ?? ''} />
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
                        <Input type="password" {...field} value={(field.value as string) ?? ''} />
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
                        <Input type="password" {...field} value={(field.value as string) ?? ''} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <DialogFooter>
                  <Button type="button" variant="outline" onClick={handleCancel}>
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
