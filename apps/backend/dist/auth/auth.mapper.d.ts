import { User } from '@lostfound/schema';
import { LoginBackDto } from '@lostfound/schema';
export declare const userToLoginBackDto: (user: User, token: string) => LoginBackDto;
