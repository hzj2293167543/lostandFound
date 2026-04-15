import { useQuery } from '@tanstack/react-query';
import { adminApi } from '@/api';
import { adminKeys } from '@/queryKeys/admin.key';
import type { FunnelData, WordCloudData } from '@lostfound/shared';

interface HourlyData {
  hour: number;
  count: number;
}

interface WeeklyData {
  dayName: string;
  lostCount: number;
  foundCount: number;
}

interface MonthlyData {
  month: string;
  lostCount: number;
  foundCount: number;
}

interface LocationData {
  location: string;
  count: number;
}

interface UserActivityData {
  userName: string;
  postCount: number;
}

interface CommentTrendData {
  date: string;
  commentCount: number;
}

interface ReportStatsData {
  total: number;
  pending: number;
  approved: number;
  rejected: number;
}

interface StatsData {
  lostCount: number;
  foundCount: number;
  userCount: number;
  announcementCount: number;
}

interface UseAdminDashboardResult {
  stats: StatsData | undefined;
  lostLocations: LocationData[];
  foundLocations: LocationData[];
  lostHourly: HourlyData[];
  foundHourly: HourlyData[];
  weekly: WeeklyData[];
  monthly: MonthlyData[];
  userActivity: UserActivityData[];
  commentTrend: CommentTrendData[];
  reportStats: ReportStatsData | undefined;
  funnelData: FunnelData | undefined;
  wordCloudData: WordCloudData | undefined;
  isLoading: boolean;
}

export function useAdminDashboard(): UseAdminDashboardResult {
  const { data: stats, isLoading: statsLoading } = useQuery({
    queryKey: adminKeys.stats(),
    queryFn: () => adminApi.getStats(),
  });

  const { data: lostLocations = [], isLoading: lostLocationsLoading } = useQuery({
    queryKey: adminKeys.locations('lost'),
    queryFn: () => adminApi.getTopLocations('lost', 10),
  });

  const { data: foundLocations = [], isLoading: foundLocationsLoading } = useQuery({
    queryKey: adminKeys.locations('found'),
    queryFn: () => adminApi.getTopLocations('found', 10),
  });

  const { data: lostHourly = [], isLoading: lostHourlyLoading } = useQuery({
    queryKey: adminKeys.hourly('lost'),
    queryFn: () => adminApi.getHourlyDistribution('lost', 30),
  });

  const { data: foundHourly = [], isLoading: foundHourlyLoading } = useQuery({
    queryKey: adminKeys.hourly('found'),
    queryFn: () => adminApi.getHourlyDistribution('found', 30),
  });

  const { data: weekly = [], isLoading: weeklyLoading } = useQuery({
    queryKey: adminKeys.weekly(),
    queryFn: () => adminApi.getWeeklyDistribution(30),
  });

  const { data: monthly = [], isLoading: monthlyLoading } = useQuery({
    queryKey: adminKeys.monthly(),
    queryFn: () => adminApi.getMonthlyDistribution(12),
  });

  const { data: userActivity = [], isLoading: userActivityLoading } = useQuery({
    queryKey: adminKeys.userActivity('lost'),
    queryFn: () => adminApi.getUserActivityRanking('lost', 10),
  });

  const { data: commentTrend = [], isLoading: commentTrendLoading } = useQuery({
    queryKey: adminKeys.commentTrend(),
    queryFn: () => adminApi.getCommentTrend(30),
  });

  const { data: reportStats, isLoading: reportStatsLoading } = useQuery({
    queryKey: adminKeys.reportHandling(),
    queryFn: () => adminApi.getReportHandlingStats(),
  });

  const { data: funnelData, isLoading: funnelLoading } = useQuery({
    queryKey: adminKeys.funnel(),
    queryFn: () => adminApi.getFunnelData(),
  });

  const { data: wordCloudData, isLoading: wordCloudLoading } = useQuery({
    queryKey: adminKeys.wordcloud(),
    queryFn: () => adminApi.getWordCloudData(20),
  });

  const isLoading =
    statsLoading ||
    lostLocationsLoading ||
    foundLocationsLoading ||
    lostHourlyLoading ||
    foundHourlyLoading ||
    weeklyLoading ||
    monthlyLoading ||
    userActivityLoading ||
    commentTrendLoading ||
    reportStatsLoading ||
    funnelLoading ||
    wordCloudLoading;

  return {
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
  };
}
