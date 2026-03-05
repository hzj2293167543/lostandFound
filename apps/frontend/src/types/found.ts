import { Category } from './category';
import { Comment } from './comment';

export interface FoundItemBase {
  id: number;
  title: string;
  category: Category;
  time: string;
  storage_location: string;
  contact_phone: string;
  status: {
    code: number;
    name: string;
  };
  description: string;
  location: string;
  image: string;
}

export interface FoundItem extends FoundItemBase {
  user?: {
    id: number;
    name: string;
    avatar: string;
  };
  commentCount?: number;
}

export interface FoundDetail extends FoundItemBase {
  user: {
    id: number;
    name: string;
    avatar: string;
    description: string;
    contact: string;
  };
  comments: Comment[];
}

export interface FoundEditFormData {
  id: number;
  title: string;
  category: number;
  time: string;
  storage_location: string;
  contact_phone: string;
  status: number;
  description: string;
  location: string;
  image: string;
  imageFile?: File;
}
