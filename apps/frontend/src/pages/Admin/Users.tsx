import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { User } from '@lostfound/schema';

interface Report {
  id: number;
  reporterId: number;
  reportedUserId: number;
  reason: string;
  status: 'pending' | 'resolved' | 'rejected';
  createdAt: string;
}

const mockUsers: User[] = [
  {
    id: 1,
    name: '张三',
    email: 'zhangsan@example.com',
    contact: '13800138000',
    status: 1,
    description: '学生',
    avatar: '',
    role: 'user',
  },
  {
    id: 2,
    name: '李四',
    email: 'lisi@example.com',
    contact: '13900139000',
    status: 0,
    description: '老师',
    avatar: '',
    role: 'user',
  },
  {
    id: 3,
    name: '王五',
    email: 'wangwu@example.com',
    contact: '13700137000',
    status: 0,
    description: '学生',
    avatar: '',
    role: 'user',
  },
  {
    id: 4,
    name: '管理员',
    email: 'admin@example.com',
    contact: '13600136000',
    status: 1,
    description: '管理员',
    avatar: '',
    role: 'admin',
  },
];

const mockReports: Report[] = [
  {
    id: 1,
    reporterId: 1,
    reportedUserId: 2,
    reason: '发布虚假信息',
    status: 'pending',
    createdAt: '2024-02-20',
  },
  {
    id: 2,
    reporterId: 3,
    reportedUserId: 2,
    reason: '骚扰他人',
    status: 'pending',
    createdAt: '2024-02-19',
  },
];

export default function AdminUsers() {
  const [users, setUsers] = useState<User[]>(mockUsers);
  const [reports, setReports] = useState<Report[]>(mockReports);
  const [activeTab, setActiveTab] = useState<'users' | 'reports'>('users');

  const handleBanUser = (userId: number) => {
    setUsers(users.map((user) => (user.id === userId ? { ...user, status: 0 } : user)));
  };

  const handleUnbanUser = (userId: number) => {
    setUsers(users.map((user) => (user.id === userId ? { ...user, status: 1 } : user)));
  };

  const handleResolveReport = (reportId: number) => {
    setReports(
      reports.map((report) => (report.id === reportId ? { ...report, status: 'resolved' } : report))
    );
  };

  const handleRejectReport = (reportId: number) => {
    setReports(
      reports.map((report) => (report.id === reportId ? { ...report, status: 'rejected' } : report))
    );
  };

  return (
    <div>
      <div className="flex space-x-4 mb-6">
        <Button
          variant={activeTab === 'users' ? 'default' : 'outline'}
          onClick={() => setActiveTab('users')}>
          用户列表
        </Button>
        <Button
          variant={activeTab === 'reports' ? 'default' : 'outline'}
          onClick={() => setActiveTab('reports')}>
          举报列表
          {reports.filter((r) => r.status === 'pending').length > 0 && (
            <Badge variant="destructive" className="ml-2">
              {reports.filter((r) => r.status === 'pending').length}
            </Badge>
          )}
        </Button>
      </div>

      {activeTab === 'users' && (
        <div>
          <h2 className="text-xl font-bold mb-4">用户列表</h2>
          <div className="space-y-4">
            {users.map((user) => (
              <Card key={user.id}>
                <CardHeader className="pb-2">
                  <div className="flex justify-between items-center">
                    <CardTitle className="text-base">{user.name}</CardTitle>
                    <div className="space-x-2">
                      {user.status === 1 ? (
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => handleBanUser(user.id)}>
                          封禁
                        </Button>
                      ) : (
                        <Button size="sm" onClick={() => handleUnbanUser(user.id)}>
                          解封
                        </Button>
                      )}
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-sm text-gray-600 space-y-1">
                    <p>邮箱: {user.email}</p>
                    <p>电话: {user.contact}</p>
                    <p>角色: {user.role === 'admin' ? '管理员' : '普通用户'}</p>
                    <p>状态: {user.status === 1 ? '正常' : '已封禁'}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {activeTab === 'reports' && (
        <div>
          <h2 className="text-xl font-bold mb-4">举报列表</h2>
          <div className="space-y-4">
            {reports.map((report) => (
              <Card key={report.id}>
                <CardHeader className="pb-2">
                  <div className="flex justify-between items-center">
                    <CardTitle className="text-base">
                      举报用户 ID: {report.reportedUserId}
                    </CardTitle>
                    <Badge variant={report.status === 'pending' ? 'destructive' : 'secondary'}>
                      {report.status === 'pending'
                        ? '待处理'
                        : report.status === 'resolved'
                          ? '已处理'
                          : '已拒绝'}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-sm text-gray-600 space-y-2">
                    <p>举报原因: {report.reason}</p>
                    <p>举报时间: {report.createdAt}</p>
                    {report.status === 'pending' && (
                      <div className="flex space-x-2 mt-2">
                        <Button
                          size="sm"
                          onClick={() => {
                            handleResolveReport(report.id);
                            handleBanUser(report.reportedUserId);
                          }}>
                          封禁用户
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleRejectReport(report.id)}>
                          忽略
                        </Button>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
            {reports.length === 0 && <p className="text-gray-500">暂无举报记录</p>}
          </div>
        </div>
      )}
    </div>
  );
}
