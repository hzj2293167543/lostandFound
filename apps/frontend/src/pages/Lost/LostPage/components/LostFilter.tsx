import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
  Select,
} from '@/components/ui/select';
import { Category } from '@lostfound/schema';
import { ALL_CATEGORY, FilterState, LOST_FILTER_STATUS, SetFilterState } from '../../type';

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
  const categoryOptions = [
    { value: ALL_CATEGORY, label: '全部分类' },
    ...categories.map((cat) => ({ value: cat.id, label: cat.name })),
  ];
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
          <Select
            value={String(category)}
            onValueChange={(value) => setFilterState('category', Number(value))}>
            <SelectTrigger id="filter-category">
              <SelectValue placeholder="全部分类" />
            </SelectTrigger>
            <SelectContent>
              {categoryOptions.map((cat) => (
                <SelectItem key={cat.value} value={String(cat.value)}>
                  {cat.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label htmlFor="filter-status">状态</Label>
          <Select
            value={String(status)}
            onValueChange={(value) => setFilterState('status', Number(value))}>
            <SelectTrigger id="filter-status">
              <SelectValue placeholder="全部状态" />
            </SelectTrigger>
            <SelectContent>
              {Object.entries(LOST_FILTER_STATUS).map(([name, value]) => (
                <SelectItem key={name} value={String(value)}>
                  {name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  );
}
