import { Category, GetFoundItemsParams } from '@lostfound/shared';
import { useState } from 'react';
import { useLoaderData } from 'react-router-dom';
import FoundCreate from '../components/FoundCreate';
import { ALL_CATEGORY, FilterState, FOUND_FILTER_STATUS, SetFilterState } from '../type';
import FoundFilter from './components/FoundFilter';
import FoundList from './components/FoundList';

export default function FoundPage() {
  const [filterState, setFilterState] = useState<FilterState>({
    status: FOUND_FILTER_STATUS.全部状态,
    searchTerm: '',
    category: ALL_CATEGORY,
  });
  const { categories } = useLoaderData() as {
    categories: Category[];
  };

  const setFilter: SetFilterState = (key, value) => {
    setFilterState((prev) => ({
      ...prev,
      [key]: value,
    }));
  };
  const filters: GetFoundItemsParams = {
    categoryId:
      filterState.category && filterState.category !== ALL_CATEGORY
        ? filterState.category
        : undefined,
    status:
      filterState.status && filterState.status !== FOUND_FILTER_STATUS.全部状态
        ? filterState.status
        : undefined,
    search: filterState.searchTerm || undefined,
  };

  return (
    <div className="container mx-auto px-4 py-8 h-[calc(100vh-64px)] flex flex-col">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-800">失物招领</h1>
        <FoundCreate categories={categories} />
      </div>

      {/* 筛选器 */}
      <FoundFilter categories={categories} filterState={filterState} setFilterState={setFilter} />

      {/* 招领列表 */}
      <FoundList filters={filters} />
    </div>
  );
}
