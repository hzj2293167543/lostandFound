import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

export default function Header() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-blue-600 via-blue-500 to-white text-slate-900 py-20 mb-8">
      <div className="absolute inset-0 opacity-20">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-300 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-80 h-80 bg-blue-400 rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-white/30 rounded-full blur-3xl" />
      </div>
      <div className="container mx-auto px-4 text-center relative z-10">
        <h1 className="text-4xl md:text-5xl font-bold mb-4 drop-shadow-lg">校园 失物招领平台</h1>
        <p className="text-xl mb-8 max-w-2xl mx-auto opacity-90 drop-shadow">
          帮助你快速找到丢失的物品，也让捡到的物品早日回家
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button
            className="bg-white text-blue-600 hover:bg-blue-50 text-lg px-8 py-6 shadow-lg font-semibold"
            asChild>
            <Link to="/lost">发布失物信息</Link>
          </Button>
          <Button
            className="bg-blue-500 hover:bg-blue-600 text-white text-lg px-8 py-6 shadow-lg font-semibold"
            asChild>
            <Link to="/found">发布招领信息</Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
