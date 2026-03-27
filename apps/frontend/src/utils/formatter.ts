import { CommentItem, Comment } from '@lostfound/shared';

/**
 * 格式化日期对象为YYYY-MM-DD格式
 * @param date 日期对象
 * @returns 格式化后的日期字符串
 */
export const formatDate = (date: Date | undefined): string => {
  if (!date) return '';
  const dateObj = new Date(date);
  if (!isNaN(dateObj.getTime())) return '';
  return dateObj.toLocaleDateString().replaceAll('/', '-');
};

/**
 * 格式化日期字符串YYYY/MM/DD -> YYYY-MM-DD 格式
 * @param dateStr 日期字符串
 * @returns 格式化后的日期字符串
 */
export const formatDateForInput = (dateStr: string | undefined) => {
  if (!dateStr) return '';
  // 如果已经是 YYYY-MM-DD，直接返回；否则尝试转换
  if (/^\d{4}-\d{2}-\d{2}$/.test(dateStr)) return dateStr;
  const date = new Date(dateStr);
  if (isNaN(date.getTime())) return '';
  return date.toLocaleDateString().replaceAll('/', '-');
};

/**
 * 递归收集一个节点下的所有后代节点（包括所有层级的子节点）
 * @param node 要收集后代节点的节点
 * @returns 所有后代节点的数组
 */
function collectDescendants(node: Comment): Comment[] {
  return node.children.flatMap((child) => [child, ...collectDescendants(child)]);
}

/**
 * 将扁平列表转换为树结构（二级结构）
 * @param flatList 扁平列表，包含所有评论项
 * @returns 树结构的评论数组，每个评论项包含其子评论项
 */
export function buildTree(flatList: CommentItem[]): Comment[] {
  const map = new Map<number, Comment>();
  const roots: Comment[] = [];

  // 第一次遍历：创建新节点并存入 Map
  flatList.forEach((item) => {
    const node: Comment = {
      ...item,
      children: [],
    };
    map.set(node.id, node);
    if (!node.parentId) {
      roots.push(node);
    }
  });

  // 第二次遍历：挂载子节点
  flatList.forEach((item) => {
    if (item.parentId) {
      const parent = map.get(item.parentId);
      const child = map.get(item.id);
      if (parent && child) {
        parent.children.push(child);
        child.replyUser = parent.user;
      }
    }
  });

  // 第三次遍历：将所有节点转换为二级结构
  const twoLevelComments = roots.map((root) =>
    Object.assign({}, root, {
      children: collectDescendants(root) // 收集所有后代节点
        .map((desc) => Object.assign({}, desc, { children: [] })),
    })
  );
  // 第四次遍历：对每个根节点的子节点按时间排序
  twoLevelComments.forEach((root) => {
    root.children.sort((a, b) => new Date(b.time).getTime() - new Date(a.time).getTime());
  });
  return twoLevelComments;
}
