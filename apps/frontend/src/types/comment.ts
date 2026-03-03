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
