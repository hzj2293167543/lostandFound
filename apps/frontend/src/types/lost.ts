import { Category } from './category';
import { Comment } from './comment';

interface LostItemBase {
  id: number;
  title: string;
  category: Category;
  description: string;
  time: string;
  location: string;
  status: {
    code: number;
    name: string;
  };
  image: string;
}

export interface LostItem extends LostItemBase {
  commentCount?: number;
  user: {
    id: number;
    name: string;
    avatar: string;
  };
}

export interface LostDetail extends LostItem {
  comments: Comment[];
  user: {
    id: number;
    name: string;
    avatar: string;
    description: string;
    contact: string;
  };
}
