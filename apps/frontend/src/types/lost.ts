export interface LostItem {
  id: number;
  title: string;
  category: string;
  description: string;
  time: string;
  location: string;
  status: string;
  image: string;
  user?: {
    id: number;
    name: string;
    avatar: string;
  };
  comments?: number;
}
