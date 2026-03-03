import React from 'react';
import { Link } from 'react-router';

export default React.memo(function NavHeader() {
  return (
    <nav className="bg-white shadow-md sticky top-0 z-50">
      <div className="container mx-auto px-4 py-3 flex items-center justify-between">
        <Link to="/" className="text-2xl font-bold text-blue-600">
          校园失物招领
        </Link>
        <div className="flex space-x-6">
          <Link to="/" className="text-gray-700 hover:text-blue-600 font-medium">
            首页
          </Link>
          <Link to="/lost" className="text-gray-700 hover:text-blue-600 font-medium">
            失物寻回
          </Link>
          <Link to="/found" className="text-gray-700 hover:text-blue-600 font-medium">
            失物招领
          </Link>
          <Link to="/announcements" className="text-gray-700 hover:text-blue-600 font-medium">
            公告中心
          </Link>
          <Link to="/profile" className="text-gray-700 hover:text-blue-600 font-medium">
            个人中心
          </Link>
        </div>
      </div>
    </nav>
  );
});
