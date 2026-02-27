import { useState } from 'react';
import { useLoaderData } from 'react-router-dom';
import { Category, LostItem } from '@/types';
import LostCreate from './components/LostCreate';
import LostFilter from './components/LostFilter';
import LostList from './components/LostList';
import { FilterState, SetFilterState } from '../type';

export default function LostPage() {
  const [filterState, setFilterState] = useState<FilterState>({
    status: '',
    searchTerm: '',
    category: '',
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
  const filteredItems = lostItems.filter((item) => {
    const { searchTerm, category, status } = filterState;
    const matchesSearch =
      item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = !category || item.category === category || category === 'all';
    const matchesStatus = !status || item.status === status || status === 'all';
    return matchesSearch && matchesCategory && matchesStatus;
  });

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
