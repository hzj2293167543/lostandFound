import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
export declare class UsersService {
    private usersRepository;
    constructor(usersRepository: Repository<User>);
    findAll(): Promise<User[]>;
    findOne(id: number): Promise<User>;
    update(id: number, updateData: Partial<User>): Promise<User>;
    updatePassword(id: number, oldPassword: string, newPassword: string): Promise<void>;
    updateAvatar(id: number, avatar: string): Promise<User>;
}
