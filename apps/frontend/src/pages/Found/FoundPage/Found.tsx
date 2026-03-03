import { useState } from 'react';
import { useLoaderData } from 'react-router-dom';
import {
  ALL_CATEGORY,
  FilterState,
  FOUND_FILTER_STATUS,
  FoundLoaderData,
  SetFilterState,
} from '../type';
import FoundCreate from '../components/FoundCreate';
import FoundFilter from './components/FoundFilter';
import FoundList from './components/FoundList';

export default function FoundPage() {
  const [filterState, setFilterState] = useState<FilterState>({
    status: FOUND_FILTER_STATUS.全部状态,
    searchTerm: '',
    category: ALL_CATEGORY,
  });
  const { foundItems, categories } = useLoaderData() as FoundLoaderData;

  const setFilter: SetFilterState = (key, value) => {
    setFilterState((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  // 筛选招领
  const filteredItems = foundItems.filter((item) => {
    const { searchTerm, category, status } = filterState;
    const matchesSearch = item.title.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = !category || item.category.id === category || category === ALL_CATEGORY;
    const matchesStatus =
      !status || item.status.code === status || status === FOUND_FILTER_STATUS.全部状态;
    return matchesSearch && matchesCategory && matchesStatus;
  });

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-800">失物招领</h1>
        <FoundCreate categories={categories} />
      </div>

      {/* 筛选器 */}
      <FoundFilter categories={categories} filterState={filterState} setFilterState={setFilter} />

      {/* 招领列表 */}
      <FoundList filteredItems={filteredItems} />
    </div>
  );
}
