import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
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
import { Category } from '@lostfound/shared';
import { useFoundCreate } from '../hooks/useFoundCreate.hook';

export default function FoundCreate({
  categories,
  className,
}: {
  categories: Category[];
  className?: string;
}) {
  const { imagePreview, isLoading, form, handleFileChange, onSubmit, onError, open, setOpen } =
    useFoundCreate(categories);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className={`bg-green-600 hover:bg-green-700 ${className}`}>发布招领信息</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>发布招领信息</DialogTitle>
          <DialogDescription>请详细填写招领信息，帮助物品早日回家</DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit, onError)} className="space-y-4">
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
                    onValueChange={(value) => field.onChange(Number(value))}>
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
                      placeholder="请详细描述物品特征、捡到情况等"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="time"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>捡到时间</FormLabel>
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
                  <FormLabel>捡到地点</FormLabel>
                  <FormControl>
                    <Input placeholder="请输入捡到的地点" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="storageLocation"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>存储地点</FormLabel>
                  <FormControl>
                    <Input placeholder="请输入存储地点" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="contactPhone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>联系电话</FormLabel>
                  <FormControl>
                    <Input placeholder="请输入联系电话" {...field} />
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
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setOpen(false)}>
                取消
              </Button>
              <Button
                type="submit"
                className="bg-green-600 hover:bg-green-700"
                disabled={isLoading}>
                {isLoading ? '发布中...' : '发布'}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
