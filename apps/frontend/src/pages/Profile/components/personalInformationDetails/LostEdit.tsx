import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { useLostEdit } from '../../hooks/useLostEdit.hook';
import { LOST_STATUS, LOST_STATUS_NAME } from '../../types';
import { isEmpty } from '@lostfound/shared';

export default function LostEdit({ lostItemId }: { lostItemId: number }) {
  const {
    categories,
    imagePreview,
    isLoading,
    form,
    handleFileChange,
    onSubmit,
    onError,
    open,
    setOpen,
  } = useLostEdit(lostItemId);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">编辑</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>修改失物信息</DialogTitle>
          <DialogDescription>请谨慎修改失物信息，帮助物品早日找到</DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit, onError)}
            className="space-y-4 max-h-[70vh] overflow-y-auto">
            <input type="hidden" {...form.register('id')} />
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>物品名称</FormLabel>
                  <FormControl>
                    <Input placeholder="请输入物品名称" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="category"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>物品分类</FormLabel>
                  <Select
                    key={categories.length}
                    value={String(field.value)}
                    onValueChange={(value) => !isEmpty(value) && field.onChange(Number(value))}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="选择分类" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {categories.map((cat) => (
                        <SelectItem key={cat.id} value={String(cat.id)}>
                          {cat.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>详细描述</FormLabel>
                  <FormControl>
                    <Textarea
                      className="resize-none"
                      placeholder="请详细描述物品特征、丢失情况等"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="status"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>状态</FormLabel>
                  <Select
                    value={String(field.value)}
                    onValueChange={(value) => field.onChange(Number(value))}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="选择状态" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {Object.entries(LOST_STATUS).map(([_, code]) => (
                        <SelectItem key={code} value={String(code)}>
                          {LOST_STATUS_NAME[code]}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="time"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>丢失时间</FormLabel>
                  <FormControl>
                    <Input type="date" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="location"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>丢失地点</FormLabel>
                  <FormControl>
                    <Input placeholder="请输入丢失的地点" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="space-y-2">
              <FormLabel>图片上传</FormLabel>
              {imagePreview && (
                <div className="relative flex items-center justify-center">
                  <img
                    src={imagePreview}
                    alt="预览"
                    className="w-32 h-32 object-cover rounded-md"
                  />
                </div>
              )}
              <Input id="image" type="file" accept="image/*" onChange={handleFileChange} />
            </div>
            <DialogFooter className="flex justify-center sm:justify-center sticky bottom-0 bg-white p-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => setOpen(false)}
                disabled={isLoading}>
                取消
              </Button>
              <Button type="submit" disabled={isLoading}>
                {isLoading ? '提交中...' : '保存'}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
