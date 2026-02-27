interface LostItemBase {
  id: number;
  title: string;
  category: string;
  description: string;
  time: string;
  location: string;
  status: string;
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

export interface Comment {
  id: number;
  content: string;
  time: string;
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
