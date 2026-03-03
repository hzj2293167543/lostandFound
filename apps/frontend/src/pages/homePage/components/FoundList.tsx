import { FoundItem } from '@/types';
import { Link } from 'react-router-dom';

export default function FoundList({ foundItems }: { foundItems: FoundItem[] }) {
  return (
    <section className="mb-12">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-800">失物招领</h2>
        <Link to="/found" className="text-blue-600 hover:underline flex items-center">
          查看全部 <span className="ml-1">→</span>
        </Link>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {foundItems.map((item) => (
          <div
            key={item.id}
            className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
            <div className="h-48 overflow-hidden">
              <img src={item.image} alt={item.title} className="w-full h-full object-cover" />
            </div>
            <div className="p-4">
              <h3 className="font-semibold text-lg mb-2">{item.title}</h3>
              <p className="text-sm text-gray-600 mb-2">{item.description}</p>
              <div className="text-xs text-gray-500 space-y-1">
                <p>分类：{item.category.name}</p>
                <p>时间：{item.time}</p>
                <p>地点：{item.location}</p>
              </div>
              <Link
                to={`/found/${item.id}`}
                className="mt-4 inline-block text-blue-600 hover:underline">
                查看详情
              </Link>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
