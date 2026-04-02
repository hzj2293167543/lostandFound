import { Loader2 } from 'lucide-react';
import { useAdminDashboard } from './hooks/useAdminDashboard';
import {
  StatsCards,
  LocationCharts,
  HourlyDistributionChart,
  WeeklyDistributionChart,
  TrendCharts,
  UserActivityChart,
  ReportCharts,
  FunnelSection,
  WordCloudSection,
} from './components';

export default function Dashboard() {
  const {
    stats,
    lostLocations,
    foundLocations,
    lostHourly,
    foundHourly,
    weekly,
    monthly,
    userActivity,
    commentTrend,
    reportStats,
    funnelData,
    wordCloudData,
    isLoading,
  } = useAdminDashboard();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold">数据统计</h1>

      <StatsCards stats={stats} />

      <LocationCharts lostLocations={lostLocations} foundLocations={foundLocations} />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <HourlyDistributionChart lostHourly={lostHourly} foundHourly={foundHourly} />
        <WeeklyDistributionChart weekly={weekly} />
      </div>

      <TrendCharts monthly={monthly} commentTrend={commentTrend} />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <UserActivityChart userActivity={userActivity} />
        <ReportCharts reportStats={reportStats} />
      </div>

      <FunnelSection funnelData={funnelData} />

      <WordCloudSection wordCloudData={wordCloudData} />
    </div>
  );
}
