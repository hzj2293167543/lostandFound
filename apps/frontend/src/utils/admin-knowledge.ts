export const getTypeLabel = (type: string) => {
  switch (type) {
    case 'faq':
      return '常见问题';
    case 'notice':
      return '通知公告';
    case 'rule':
      return '规章制度';
    default:
      return type;
  }
};

export const formatDateKnowledge = (dateStr: string) => {
  return new Date(dateStr).toLocaleString('zh-CN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  });
};
