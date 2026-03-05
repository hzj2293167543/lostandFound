export const formatDateForInput = (dateStr: string | undefined) => {
  if (!dateStr) return '';
  // 如果已经是 YYYY-MM-DD，直接返回；否则尝试转换
  if (/^\d{4}-\d{2}-\d{2}$/.test(dateStr)) return dateStr;
  const date = new Date(dateStr);
  if (isNaN(date.getTime())) return '';
  return date.toISOString().split('T')[0];
};
