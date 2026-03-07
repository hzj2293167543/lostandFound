import { User } from '@lostfound/schema';
import { LoginBackDto } from '@lostfound/schema';

export const userToLoginBackDto = (user: User, token: string): LoginBackDto => ({
  token,
  user: {
    id: user.id,
    name: user.name,
    email: user.email,
    avatar: user.avatar,
    contact: user.contact,
    description: user.description,
    role: user.role,
    status: user.status,
  },
});
