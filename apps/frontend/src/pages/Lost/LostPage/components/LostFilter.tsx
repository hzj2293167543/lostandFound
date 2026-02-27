import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
  Select,
} from '@/components/ui/select';
import { Category } from '@/types';
import { FilterState, SetFilterState } from '../../type';

export default function LostFilter({
  categories,
  filterState,
  setFilterState,
}: {
  categories: Category[];
  filterState: FilterState;
  setFilterState: SetFilterState;
}) {
  const { status, searchTerm, category } = filterState;
  return (
    <div className="bg-white rounded-lg shadow-md p-4 mb-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="space-y-2">
          <Label htmlFor="search">搜索</Label>
          <Input
            id="search"
            placeholder="搜索物品名称或描述"
            value={searchTerm}
            onChange={(e) => setFilterState('searchTerm', e.target.value)}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="filter-category">分类</Label>
          <Select value={category} onValueChange={(value) => setFilterState('category', value)}>
            <SelectTrigger id="filter-category">
              <SelectValue placeholder="全部分类" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">全部分类</SelectItem>
              {categories.map((cat) => (
                <SelectItem key={cat.id} value={cat.name}>
                  {cat.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label htmlFor="filter-status">状态</Label>
          <Select value={status} onValueChange={(value) => setFilterState('status', value)}>
            <SelectTrigger id="filter-status">
              <SelectValue placeholder="全部状态" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">全部状态</SelectItem>
              <SelectItem value="寻找中">寻找中</SelectItem>
              <SelectItem value="已找到">已找到</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  );
}
