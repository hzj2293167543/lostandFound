import { useCallback, useState } from 'react';
import { useLoaderData } from 'react-router-dom';
import { Category, GetLostItemsParams } from '@lostfound/shared';
import LostCreate from '../components/LostCreate';
import LostFilter from './components/LostFilter';
import LostList from './components/lostList/LostList';
import { ALL_CATEGORY, FilterState, LOST_FILTER_STATUS, SetFilterState } from '../type';

export default function LostPage() {
  const [filterState, setFilterState] = useState<FilterState>({
    status: LOST_FILTER_STATUS.全部状态,
    searchTerm: '',
    category: ALL_CATEGORY,
  });
  const { categories } = useLoaderData() as { categories: Category[] };

  const setFilter: SetFilterState = useCallback((key, value) => {
    setFilterState((prev) => ({
      ...prev,
      [key]: value,
    }));
  }, []);

  const filters: GetLostItemsParams = {
    categoryId:
      filterState.category && filterState.category !== ALL_CATEGORY
        ? filterState.category
        : undefined,
    status:
      filterState.status && filterState.status !== LOST_FILTER_STATUS.全部状态
        ? filterState.status
        : undefined,
    search: filterState.searchTerm || undefined,
  };

  return (
    <div className="container mx-auto px-4 py-8 h-[calc(100vh-256px)] flex flex-col">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-foreground">失物寻回</h1>
        <LostCreate categories={categories} />
      </div>

      {/* 筛选器 */}
      <LostFilter categories={categories} filterState={filterState} setFilterState={setFilter} />

      {/* 失物列表 */}
      <LostList filters={filters} />
    </div>
  );
}
