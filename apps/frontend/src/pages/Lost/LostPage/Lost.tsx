import { useMemo, useState } from 'react';
import { useLoaderData } from 'react-router-dom';
import { Category, LostItem } from '@/types';
import LostCreate from '../components/LostCreate';
import LostFilter from './components/LostFilter';
import LostList from './components/LostList';
import { ALL_CATEGORY, FilterState, LOST_FILTER_STATUS, SetFilterState } from '../type';

export default function LostPage() {
  const [filterState, setFilterState] = useState<FilterState>({
    status: LOST_FILTER_STATUS.全部状态,
    searchTerm: '',
    category: ALL_CATEGORY,
  });
  const { lostItems, categories } = useLoaderData() as {
    lostItems: LostItem[];
    categories: Category[];
  };

  const setFilter: SetFilterState = (key, value) => {
    setFilterState((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  // 筛选失物
  const filteredItems = useMemo(
    () =>
      lostItems.filter((item) => {
        const { searchTerm, category, status } = filterState;
        const matchesSearch =
          item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          item.description.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesCategory =
          !category || item.category.id === category || category === ALL_CATEGORY;
        const matchesStatus =
          !status || item.status.code === status || status === LOST_FILTER_STATUS.全部状态;
        return matchesSearch && matchesCategory && matchesStatus;
      }),
    [filterState, lostItems]
  );

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-800">失物寻回</h1>
        <LostCreate categories={categories} />
      </div>

      {/* 筛选器 */}
      <LostFilter categories={categories} filterState={filterState} setFilterState={setFilter} />

      {/* 失物列表 */}
      <LostList filteredItems={filteredItems} />
    </div>
  );
}
