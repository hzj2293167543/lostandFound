import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

export default function Header() {
  return (
    <section className="bg-gradient-to-r from-blue-600 to-blue-800 text-white py-16 mb-8">
      <div className="container mx-auto px-4 text-center">
        <h1 className="text-4xl md:text-5xl font-bold mb-4">校园失物招领平台</h1>
        <p className="text-xl mb-8 max-w-2xl mx-auto">
          帮助你快速找到丢失的物品，也让捡到的物品早日回家
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button className="bg-white text-blue-700 hover:bg-gray-100 text-lg px-8 py-6">
            <Link to="/lost">发布失物信息</Link>
          </Button>
          <Button className="bg-blue-400 text-white hover:bg-blue-500 text-lg px-8 py-6">
            <Link to="/found">发布招领信息</Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
