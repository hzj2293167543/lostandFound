import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
  Select,
} from '@/components/ui/select';
import { Category } from '@lostfound/shared';
import { ALL_CATEGORY, FilterState, FOUND_FILTER_STATUS, SetFilterState } from '../../type';
import { SearchInput } from '@/components/searchInput/searchInput';
import { SEARCH_DEBOUNCE_DELAY } from '@/constants';

export default function FoundFilter({
  categories,
  filterState,
  setFilterState,
}: {
  categories: Category[];
  filterState: FilterState;
  setFilterState: SetFilterState;
}) {
  const { status, searchTerm, category } = filterState;
  const categoryOptions = [{ id: ALL_CATEGORY, name: '全部分类' }, ...categories];

  return (
    <div className="bg-white rounded-lg shadow-md p-4 mb-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="space-y-2">
          <SearchInput
            delay={SEARCH_DEBOUNCE_DELAY}
            value={searchTerm}
            onSearch={(value) => setFilterState('searchTerm', value)}
            placeholder="搜索物品名称或描述"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="filter-category">分类</Label>
          <Select
            value={String(category)}
            onValueChange={(value) => setFilterState('category', Number(value))}>
            <SelectTrigger id="filter-category">
              <SelectValue placeholder={categoryOptions.find((cat) => cat.id === category)?.name} />
            </SelectTrigger>
            <SelectContent>
              {categoryOptions.map((cat) => (
                <SelectItem key={cat.id} value={String(cat.id)}>
                  {cat.name}
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
              <SelectValue placeholder={status} />
            </SelectTrigger>
            <SelectContent>
              {Object.entries(FOUND_FILTER_STATUS).map(([name, status]) => (
                <SelectItem key={name} value={String(status)}>
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
